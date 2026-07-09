/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface MotionIntroProps {
  onComplete: () => void;
}

export default function MotionIntro({ onComplete }: MotionIntroProps) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Animate progress bar from 0 to 100
    const duration = 2000; // 2 seconds total loading time
    const intervalTime = 20;
    const step = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + step;
      });
    }, intervalTime);

    // Trigger complete callback after intro ends
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
      // Wait for exit zoom animation to complete (1.2s) before unmounting
      const completeTimer = setTimeout(() => {
        onComplete();
      }, 1200);
      return () => clearTimeout(completeTimer);
    }, duration);

    return () => {
      clearInterval(timer);
      clearTimeout(exitTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      id="app-motion-intro"
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        transition: { duration: 1.0, ease: 'easeInOut', delay: 0.1 }
      }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white overflow-hidden select-none"
    >
      {/* Light coming from the borders - soft glowing ambient frames */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft inner radial gradient from borders */}
        <div className="absolute inset-0 border-[16px] border-transparent shadow-[inset_0_0_80px_rgba(13,93,241,0.12)] animate-pulse" />
        
        {/* Animated top-light border line */}
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={isExiting ? { scaleX: 0, opacity: 0 } : { scaleX: 1 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#0D5DF1] to-transparent opacity-80"
        />
        {/* Animated bottom-light border line */}
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={isExiting ? { scaleX: 0, opacity: 0 } : { scaleX: 1 }}
          transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.2 }}
          className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#0D5DF1] to-transparent opacity-80"
        />
        {/* Animated left-light border line */}
        <motion.div 
          initial={{ scaleY: 0 }}
          animate={isExiting ? { scaleY: 0, opacity: 0 } : { scaleY: 1 }}
          transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.4 }}
          className="absolute top-0 bottom-0 left-0 w-[3px] bg-gradient-to-b from-transparent via-[#0D5DF1]/70 to-transparent"
        />
        {/* Animated right-light border line */}
        <motion.div 
          initial={{ scaleY: 0 }}
          animate={isExiting ? { scaleY: 0, opacity: 0 } : { scaleY: 1 }}
          transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.4 }}
          className="absolute top-0 bottom-0 right-0 w-[3px] bg-gradient-to-b from-transparent via-[#0D5DF1]/70 to-transparent"
        />

        {/* Pulsing light spots on the four corners to represent emanating border lights */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#0D5DF1]/5 blur-3xl rounded-full" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-300/10 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-300/10 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#0D5DF1]/5 blur-3xl rounded-full" />
      </div>

      {/* Ambient center soft glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-[#0D5DF1]/5 blur-[120px] pointer-events-none" />

      {/* Intro Content Container */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md w-full">
        {/* Logo Motion with scale up animation on exit */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isExiting ? {
            scale: 45,
            opacity: 0,
            filter: 'blur(16px)',
            transition: { 
              scale: { duration: 1.1, ease: [0.64, 0, 0.78, 0] },
              opacity: { duration: 0.9, ease: 'easeIn' },
              filter: { duration: 1.0 }
            }
          } : { 
            opacity: 1, 
            scale: 1, 
            y: [0, -6, 0],
            transition: { 
              opacity: { duration: 0.8, ease: 'easeOut' },
              scale: { duration: 0.8, ease: 'easeOut' },
              y: { repeat: Infinity, duration: 3, ease: 'easeInOut' }
            }
          }}
          className="mb-6 relative flex items-center justify-center origin-center"
        >
          <img
            src="/logo.png"
            alt="Mosta Run Club Logo"
            className="h-28 w-auto object-contain drop-shadow-[0_10px_30px_rgba(13,93,241,0.15)]"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Progress Bar Container - vanishes when exiting */}
        <motion.div 
          animate={{ opacity: isExiting ? 0 : 1, scale: isExiting ? 0.9 : 1 }}
          transition={{ duration: 0.3 }}
          className="mt-12 w-48 h-[3px] bg-neutral-100 rounded-full overflow-hidden relative border border-neutral-200/50"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-[#0D5DF1] to-blue-400"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
