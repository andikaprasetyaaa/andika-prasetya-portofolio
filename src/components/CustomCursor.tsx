import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

export const CustomCursor: React.FC = () => {
  const isReduced = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);

  const springConfig = { damping: 25, stiffness: 350 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  useEffect(() => {
    // Disable on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX - 12);
      cursorY.set(e.clientY - 12);
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest('a, button, input, [role="button"], article, .cursor-pointer')
        );
        setIsPointer(isInteractive);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  if (isReduced || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Outer subtle trailing ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-white pointer-events-none mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          width: isPointer ? 32 : 20,
          height: isPointer ? 32 : 20,
          translateX: isPointer ? -4 : 2,
          translateY: isPointer ? -4 : 2,
          opacity: 0.65,
          transition: 'width 0.2s, height 0.2s, transform 0.2s',
        }}
      />
      {/* Precision center focal dot */}
      <motion.div
        className="fixed top-0 left-0 rounded-full bg-white pointer-events-none mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          width: 6,
          height: 6,
          translateX: isPointer ? 13 : 9,
          translateY: isPointer ? 13 : 9,
          transition: 'transform 0.15s',
        }}
      />
    </div>
  );
};

