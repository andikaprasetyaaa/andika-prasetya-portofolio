import Lenis from 'lenis';

let lenisInstance: Lenis | null = null;

export function initLenis(): Lenis | null {
  if (typeof window === 'undefined') return null;

  // Don't initialize multiple instances
  if (lenisInstance) return lenisInstance;

  lenisInstance = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
  });

  function raf(time: number) {
    lenisInstance?.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
  return lenisInstance;
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;

  if (lenisInstance) {
    lenisInstance.scrollTo(target, { offset: 0, duration: 1.2 });
  } else {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

