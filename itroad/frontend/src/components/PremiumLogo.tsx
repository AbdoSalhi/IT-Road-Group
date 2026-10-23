"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export default function PremiumLogo({ className = "" }: { className?: string }) {
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [loopActive, setLoopActive] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (reducedMotion) {
      setLoopActive(true);
      return;
    }
    const timer = setTimeout(() => setLoopActive(true), 4000);
    return () => clearTimeout(timer);
  }, [reducedMotion]);

  // Rendu initial : image statique
  if (!mounted) {
    return (
      <div className={`relative w-full max-w-[520px] ${className}`}>
        <div className="relative overflow-hidden rounded-[1.75rem]">
          <img
            src="/IT-Group.png"
            alt="ITROAD Group"
            className="h-auto w-full object-contain"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full max-w-[520px] ${className}`}>
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,163,224,0.20)_0%,rgba(56,189,248,0.06)_40%,transparent_70%)] blur-2xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.7, scale: 1 }}
        transition={{ duration: 2000000 }}
      />

      <motion.div
        className="relative overflow-hidden rounded-[1.75rem]"
        initial={reducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.img
          src="/IT-Group.png"
          alt="ITROAD Group"
          className="h-auto w-full object-contain drop-shadow-[0_20px_50px_rgba(0,163,224,0.14)]"
          initial={reducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        />

        {loopActive && !reducedMotion && (
          <motion.div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,transparent_30%,rgba(255,255,255,0.50)_50%,transparent_70%)]"
            initial={{ x: '-130%' }}
            animate={{ x: '230%' }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'linear',
              repeatDelay: 2.5,
            }}
          />
        )}
      </motion.div>

      <motion.div
        className="pointer-events-none absolute -inset-4 rounded-[2rem] border border-cyan-200/40"
        initial={{ opacity: 0 }}
        animate={loopActive ? { opacity: [0.1, 0.5, 0.1] } : { opacity: 0.2 }}
        transition={
          loopActive
            ? { duration: 10, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.8, delay: 1100 }
        }
      />
    </div>
  );
}
