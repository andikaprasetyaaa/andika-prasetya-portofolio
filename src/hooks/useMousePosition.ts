import { useState, useEffect } from 'react';

export interface MousePosition {
  x: number;
  y: number;
  normX: number;
  normY: number;
}

export function useMousePosition(): MousePosition {
  const [pos, setPos] = useState<MousePosition>({
    x: 0,
    y: 0,
    normX: 0,
    normY: 0,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      setPos({
        x: e.clientX,
        y: e.clientY,
        normX,
        normY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return pos;
}

