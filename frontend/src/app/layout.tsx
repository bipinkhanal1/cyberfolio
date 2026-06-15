'use client';
import './globals.css';
import { useEffect, useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ParticleBackground from '@/components/animations/ParticleBackground';
import LoadingScreen from '@/components/animations/LoadingScreen';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const cursorDot = useRef<HTMLDivElement>(null);
  const cursorRing = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  useEffect(() => {
    const dot = cursorDot.current;
    const ring = cursorRing.current;
    if (!dot || !ring) return;

    let raf: number;
    let ringX = 0, ringY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;

      raf = requestAnimationFrame(() => {
        ringX += (x - ringX) * 0.15;
        ringY += (y - ringY) * 0.15;
        ring.style.left = `${ringX}px`;
        ring.style.top = `${ringY}px`;
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className="bg-cyber-dark text-gray-100 antialiased">
        {/* Custom cursor */}
        <div ref={cursorDot} className="cursor-dot hidden md:block" />
        <div ref={cursorRing} className="cursor-ring hidden md:block" />

        {/* Toasts */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0a1628',
              color: '#e2e8f0',
              border: '1px solid rgba(0,255,136,0.2)',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.875rem'
            },
            success: { iconTheme: { primary: '#00ff88', secondary: '#0a1628' } },
            error: { iconTheme: { primary: '#ff0040', secondary: '#0a1628' } }
          }}
        />

        {isAdmin ? (
          <>{children}</>
        ) : (
          <>
            <ParticleBackground />
            <Navbar />
            <main className="relative z-10">{children}</main>
            <Footer />
          </>
        )}
      </body>
    </html>
  );
}

// Separate metadata export (server component compatible)
export const metadata = {
  title: { template: '%s | CyberFolio', default: 'CyberFolio - Cybersecurity Portfolio' },
  description: 'Professional cybersecurity portfolio and services platform',
};
