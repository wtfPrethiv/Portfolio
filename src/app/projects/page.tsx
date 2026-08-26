'use client';

import ProjectsSection from '@/components/projects-section';
import { useRef } from 'react';

export default function ProjectsPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <main ref={containerRef} className="bg-[#0A0A0A] relative min-h-screen pt-24">
      <ProjectsSection />
    </main>
  );
}
