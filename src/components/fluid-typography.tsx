'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, RenderTexture, OrthographicCamera } from '@react-three/drei';
import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform sampler2D uTexture;
uniform vec2 uMouse;
uniform float uHover;
uniform float uTime;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  
  // Calculate distance to mouse
  float dist = distance(uv, uMouse);
  
  // Create a fluid/blobby displacement based on distance to mouse
  float radius = 0.25;
  // Use smoothstep for a softer edge of the ripple effect
  float intensity = smoothstep(radius, 0.0, dist) * uHover;
  
  // Add some noise or sine wave for fluid feel
  float wave = sin(dist * 30.0 - uTime * 10.0) * 0.015 * intensity;
  
  // Calculate displacement direction (away from mouse)
  vec2 dir = uv - uMouse;
  if (length(dir) == 0.0) {
    dir = vec2(0.0);
  } else {
    dir = normalize(dir);
  }
  
  vec2 displacedUv = uv + dir * wave;
  
  // Chromatic Aberration (RGB Split)
  float splitAmount = 0.02 * intensity; // Red/Blue color separation distance
  
  // Sample textures with offsets along the displacement direction
  vec4 colorR = texture2D(uTexture, displacedUv + dir * splitAmount);
  vec4 colorG = texture2D(uTexture, displacedUv);
  vec4 colorB = texture2D(uTexture, displacedUv - dir * splitAmount);
  
  // The texture has white text on transparent background.
  // We invert the RGB to get black text with colored edges.
  vec3 invertedColor = vec3(1.0 - colorR.r, 1.0 - colorG.g, 1.0 - colorB.b);
  
  // We take the maximum alpha of the three samples so that the color shifts are visible
  // even outside the original alpha bounds.
  float finalAlpha = max(max(colorR.a, colorG.a), colorB.a);
  
  gl_FragColor = vec4(invertedColor, finalAlpha);
}
`;

function FluidTextScene({ 
  text1, 
  text2,
  isPreloaderCompleted 
}: { 
  text1: string; 
  text2: string;
  isPreloaderCompleted: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const textGroupRef = useRef<THREE.Group>(null);
  const { viewport, size } = useThree();
  
  // Target mouse and smoothed mouse for fluid motion
  const targetMouse = useRef(new THREE.Vector2(0.5, 0.5));
  const currentMouse = useRef(new THREE.Vector2(0.5, 0.5));
  const targetHover = useRef(0);
  const currentHover = useRef(0);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: null },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uHover: { value: 0 },
      uTime: { value: 0 },
    }),
    []
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates to 0-1 range for UVs
      const x = e.clientX / window.innerWidth;
      const y = 1.0 - (e.clientY / window.innerHeight); // Invert Y for WebGL UVs
      targetMouse.current.set(x, y);
    };
    
    const handleMouseEnter = () => { targetHover.current = 1; };
    const handleMouseLeave = () => { targetHover.current = 0; targetMouse.current.set(0.5, 0.5); };

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseenter', handleMouseEnter);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    
    targetHover.current = 1; // Start hovering if mouse is in window

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  useFrame((state, delta) => {
    // Smoothly interpolate mouse position and hover state
    currentMouse.current.lerp(targetMouse.current, 0.1);
    currentHover.current = THREE.MathUtils.lerp(currentHover.current, targetHover.current, 0.1);

    if (materialRef.current) {
      materialRef.current.uniforms.uMouse.value.copy(currentMouse.current);
      materialRef.current.uniforms.uHover.value = currentHover.current;
      materialRef.current.uniforms.uTime.value += delta;
    }

    if (textGroupRef.current) {
      if (isPreloaderCompleted) {
        textGroupRef.current.position.y = THREE.MathUtils.lerp(textGroupRef.current.position.y, 0, 0.05);
      } else {
        textGroupRef.current.position.y = 0; // For testing, let's keep it at 0 to ensure visibility
      }
    }
  });

  const fontAirone = "/fonts/AironeFont-Demo.ttf";
  const fontBuilt = "/fonts/built titling rg.otf";
  
  // Calculate relative sizes. 
  // We want the text to fill the plane correctly to match CSS.
  // viewport.width is the WebGL unit width of the screen.
  const scale1 = viewport.width * 0.085; // Roughly matching CSS text-[6.5vw] to [9.2vw]
  const scale2 = viewport.width * 0.085;

  return (
    <mesh ref={meshRef}>
      {/* Plane that covers the entire viewport */}
      <planeGeometry args={[viewport.width, viewport.height]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
      />
      
      {/* Render the text into a texture using RenderTexture */}
      <RenderTexture attach="uniforms-uTexture-value" width={size.width * 2} height={size.height * 2}>
        <OrthographicCamera makeDefault args={[-viewport.width / 2, viewport.width / 2, viewport.height / 2, -viewport.height / 2, 0.1, 10]} position={[0, 0, 5]} />
        
        <group ref={textGroupRef} position={[0, isPreloaderCompleted ? 0 : -5, 0]}>
          <Text
            position={[-viewport.width * 0.05, 0, 0]}
            font={fontAirone}
            fontSize={scale1}
            color="white"
            anchorX="right"
            anchorY="middle"
            letterSpacing={0.02}
          >
            {text1}
          </Text>
          
          <Text
            position={[viewport.width * 0.05, 0, 0]}
            font={fontBuilt}
            fontSize={scale2}
            color="white"
            anchorX="left"
            anchorY="middle"
            letterSpacing={0.15}
          >
            {text2}
          </Text>
        </group>
      </RenderTexture>
    </mesh>
  );
}

export default function FluidTypography({ isPreloaderCompleted }: { isPreloaderCompleted: boolean }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-20">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
        gl={{ alpha: true, antialias: true }}
      >
        <FluidTextScene 
          text1="PRETHIV" 
          text2="SRIMAN." 
          isPreloaderCompleted={isPreloaderCompleted} 
        />
      </Canvas>
    </div>
  );
}
