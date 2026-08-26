import type {Metadata} from 'next';
import './globals.css';
import { SmoothScrollProvider } from '@/components/smooth-scroll-provider';
import { Toaster } from "@/components/ui/toaster";


export const metadata: Metadata = {
  title: 'pr3thivv : : Portfolio@2.0.0',
  description: 'A multi-awarded digital studio crafting immersive & interactive experiences for global brands since 2006.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Inter:wght@400;700;900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Bebas+Neue&family=Space+Grotesk:wght@300..700&family=Big+Shoulders+Display:wght@100..900&family=VT323&family=Silkscreen&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased cursor-none">
        <SmoothScrollProvider>
          {children}
          <Toaster />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}