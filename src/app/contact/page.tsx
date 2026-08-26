'use client';

import ContactSection from '@/components/contact-section';
import AsciiHandsSection from '@/components/ascii-hands-section';

export default function ContactPage() {
  return (
    <main className="bg-[#0A0A0A] relative min-h-screen">
      <div className="pt-24">
        <ContactSection isActive={true} />
      </div>
      
      {/* Footer / Finale */}
      <div className="relative z-30 bg-black overflow-hidden mt-20">
        <AsciiHandsSection />
      </div>
    </main>
  );
}
