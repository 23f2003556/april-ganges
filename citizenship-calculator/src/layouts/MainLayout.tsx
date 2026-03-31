import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { motion, useScroll, useTransform } from 'framer-motion';

export function MainLayout({ children }: { children: ReactNode }) {
  // Scroll detection
  const { scrollY } = useScroll();

  // Parallax effect for background elements
  const yParallaxOrange = useTransform(scrollY, [0, 1000], ['0%', '-30%']);
  const yParallaxGold = useTransform(scrollY, [0, 1000], ['0%', '-40%']);

  return (
    <div
      className={cn(
        'min-h-screen w-full flex flex-col transition-all duration-1000 ease-in-out relative overflow-hidden',
        // Ganges deep blue aesthetic
        'bg-[#002B5E] text-white' // Darker variant of Ganges blue for optimal text contrast
      )}
    >
      {/* Decorative ambient grain for premium texture */}
      <div className="absolute inset-0 z-0 opacity-[0.08] mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.65\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\"/%3E%3C/svg%3E')" }}></div>

      {/* Modern subtle Mandala/Paisley pattern overlay */}
      <div className="absolute inset-0 z-0 opacity-10 mix-blend-color-dodge pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 2px, transparent 3px)',
        backgroundSize: '40px 40px'
      }}></div>

      {/* Animated Gradient Background Blobs for Ganges vibe */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] sm:w-[50vw] sm:h-[50vw] rounded-full bg-accent-orange blur-[120px] mix-blend-screen opacity-[0.15] will-change-transform"
          style={{ y: yParallaxOrange }}
          animate={{
            x: ['0%', '10%', '-5%', '0%'],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-[30%] -right-[20%] w-[80vw] h-[80vw] sm:w-[60vw] sm:h-[60vw] rounded-full bg-accent-gold blur-[140px] mix-blend-screen opacity-[0.12] will-change-transform"
          style={{ y: yParallaxGold }}
          animate={{
            x: ['0%', '-15%', '5%', '0%'],
            scale: [1, 1.2, 0.85, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        <motion.div
          className="absolute -bottom-[20%] left-[20%] w-[70vw] h-[60vw] rounded-full bg-primary-navy blur-[130px] mix-blend-screen opacity-40 will-change-transform"
          animate={{
            x: ['0%', '20%', '-10%', '0%'],
            scale: [1, 1.05, 0.95, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
        />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 relative z-20 w-full max-w-lg mx-auto">
        {children}
      </main>
    </div>
  );
}
