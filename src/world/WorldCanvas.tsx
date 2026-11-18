import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { onScrollFrame } from '../lib/scroll';
import { resolveQuality, useSettings, useUi } from '../lib/settings';
import { BannerPlane } from './BannerPlane';
import { Birds } from './Birds';
import { Boats } from './Boats';
import { CameraRig } from './CameraRig';
import { Causeway } from './Causeway';
import { City } from './City';
import { Ocean } from './Ocean';
import { Palms } from './Palms';
import { Sky } from './Sky';

function Scene({ animate, onReady }: { animate: boolean; onReady?: () => void }) {
  const invalidate = useThree((s) => s.invalidate);
  const frames = useRef(0);
  const notified = useRef(false);

  // In reduced-motion mode the world only redraws when the page scrolls.
  useEffect(() => {
    if (animate) return;
    return onScrollFrame(() => invalidate());
  }, [animate, invalidate]);

  useFrame(() => {
    if (notified.current) return;
    frames.current += 1;
    if (frames.current >= 2) {
      notified.current = true;
      onReady?.();
    }
  });

  return (
    <>
      <CameraRig animate={animate} />
      <Sky />
      <Ocean />
      <City />
      <Causeway />
      <Boats />
      <Palms />
      <Birds />
      <BannerPlane />
    </>
  );
}

export default function WorldCanvas({ onReady }: { onReady?: () => void }) {
  const settings = useSettings();
  const ui = useUi();
  const quality = resolveQuality(settings.quality);
  const reduced = settings.motion === 'reduced';
  const paused = ui.menuOpen || ui.modalOpen;
  const [dprCap, setDprCap] = useState(quality === 'high' ? 1.6 : 1.0);

  useEffect(() => {
    setDprCap(quality === 'high' ? 1.6 : 1.0);
  }, [quality]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <Canvas
        flat
        dpr={[quality === 'high' ? 1 : 0.75, dprCap]}
        frameloop={paused ? 'never' : reduced ? 'demand' : 'always'}
        gl={{
          antialias: quality === 'high',
          alpha: false,
          stencil: false,
          powerPreference: 'high-performance',
        }}
        camera={{ fov: 38, near: 0.5, far: 7000, position: [0, 6, 62] }}
        onCreated={({ gl }) => {
          gl.setClearColor('#0c0716', 1);
        }}
      >
        <PerformanceMonitor
          flipflops={2}
          onDecline={() => setDprCap((c) => Math.max(0.9, c - 0.35))}
          onIncline={() => setDprCap((c) => Math.min(quality === 'high' ? 1.6 : 1.0, c + 0.2))}
        />
        <Scene animate={!reduced} onReady={onReady} />
      </Canvas>
    </div>
  );
}
