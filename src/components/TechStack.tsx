import React, { useState } from 'react';
import './TechStack.css';

import py from "../assets/icons/python.png";
import rs from "../assets/icons/rust.png";
import ts from "../assets/icons/ts.png";
import cpp from '../assets/icons/cpp.png'
import go from '../assets/icons/go.png'
import java from '../assets/icons/java.png'

import html from "../assets/icons/html.png";
import react from "../assets/icons/react.png";
import sql from "../assets/icons/sql.png";
import mongo from '../assets/icons/mongodb.png'
import node from '../assets/icons/nodejs.png'
import figma from '../assets/icons/figma.png'


interface TechItem {
  name: string;
  icon: string; 
  frameworks: string[];  
}

interface TechCategory {
  title: string;
  items: TechItem[];
}

const TechStack: React.FC = () => {
  
  const [activeTech, setActiveTech] = useState<TechItem | null>(null);

  
  const techData: TechCategory[] = [
    {
      title: "LANGUAGES",
      items: [
        { name: "Python", icon: py, frameworks: ["PyTorch", "Scikit-learn", "OpenCV","Hugging Face Transformers", "XGBoost", "FastApi"] },
        { name: "Rust", icon: rs, frameworks: ["Burn", "Rocket", "Tokio", "ndarray"] },
        { name: "TypeScript", icon: ts, frameworks: ["React", "Next.js", "Node.js", "Express.js"] },
        { name: "C++", icon: cpp, frameworks: ["OpenGL", "PyTorch C++ API", "Eigen", "GSL"] },
        { name: "Golang", icon: go, frameworks: ["Gin", "Cobra"] },
        { name: "Java", icon: java, frameworks: ["Swing", "Springboot"] },
      ]
    },
    {
      title: "WEB & TOOLS",
      items: [
        { name: "HTML/CSS", icon: html, frameworks: ["Tailwind", "Bootstrap", "SASS"] },
        { name: "Node.js", icon: node, frameworks: ["PostgreSQL", "SQLite", "Prisma"] },
        { name: "React.js", icon: react, frameworks: ["Redux", "Next.js"] },
        { name: "SQL", icon: sql, frameworks: ["PostgreSQL", "SQLite", "Prisma"] },
        { name: "MongoDB", icon: mongo, frameworks: [] },
        { name: "Figma", icon: figma, frameworks: [] },
      ]
    }
  ];

  return (
    <section className="tech-stack-section" id="tech-stack">
      <div className="tech-container">
        <h1 className="section-title">// TECH_ARSENAL</h1>
        
        <div className="tech-layout">
          
          <div className="tech-grid">
            {techData.map((category, idx) => (
              <div key={idx} className="tech-category">
                <h3>{category.title}</h3>
                <div className="icons-row">
                  {category.items.map((item, i) => (
                    <div 
                      key={i} 
                      className="tech-icon-box"
                      onMouseEnter={() => setActiveTech(item)}
                      onMouseLeave={() => setActiveTech(null)}
                    >
                      <img src={item.icon} alt={item.name} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          
          <div className="tech-info-panel">
            <div className="terminal-header">
              <span className="blink">_</span> SYSTEM.CHECK
            </div>
            
            <div className="terminal-content">
              {activeTech ? (
                <>
                  <h2 className="tech-name">{activeTech.name}</h2>
                  <ul className="framework-list">
                    {activeTech.frameworks.map((fw, i) => (
                      <li key={i}>
                        <span className="arrow"></span> {fw}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <div className="placeholder-text">
                  <p>// HOVER OVER ARSENAL</p>
                  <p>// TO DECRYPT SPECS...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;