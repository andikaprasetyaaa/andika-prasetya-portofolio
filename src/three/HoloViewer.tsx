import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useInView } from 'framer-motion';
import * as THREE from 'three';
import type { Project } from '../lib/projectsData';
import { useReducedMotionPref } from '../lib/settings';
import { HoloModel, HoloProvider, makePalette } from './HoloModels';

/* ---------------- GTA VI Synthwave Slatted Sunset Sun + Twin 3D Palm Trees + Neon Plinth ---------------- */

const sunVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const sunFragment = /* glsl */ `
uniform float uTime;
varying vec2 vUv;
void main() {
  vec2 p = vUv - 0.5;
  float r = length(p) * 2.0;
  if (r > 1.0) discard;

  // Classic 80s / GTA VI Vice sunset gradient (gold top -> coral -> hot magenta bottom)
  vec3 topCol = vec3(1.0, 0.88, 0.48);
  vec3 midCol = vec3(1.0, 0.48, 0.36);
  vec3 botCol = vec3(1.0, 0.22, 0.62);
  vec3 col = mix(botCol, midCol, smoothstep(0.0, 0.55, vUv.y));
  col = mix(col, topCol, smoothstep(0.45, 1.0, vUv.y));

  // Horizontal synthwave scan slats in the lower half of the sun
  if (vUv.y < 0.58) {
    float freq = 18.0;
    float wave = fract(vUv.y * freq - uTime * 0.12);
    float cutThreshold = (0.62 - vUv.y) * 1.15;
    if (wave < cutThreshold) discard;
  }

  float edge = smoothstep(1.0, 0.92, r);
  gl_FragColor = vec4(col, edge * 0.92);
}
`;

/** Stylized 3D Vice Palm Tree silhouette with neon rim sheen */
function VicePalm({ position, scale = 1, flip = false }: { position: [number, number, number]; scale?: number; flip?: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.z = Math.sin(clock.elapsedTime * 1.1 + (flip ? 2 : 0)) * 0.035;
  });

  const fronds = [0, 55, 115, 180, 245, 305];

  return (
    <group position={position} scale={[flip ? -scale : scale, scale, scale]}>
      {/* Curved trunk segments */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh
          key={i}
          position={[Math.pow(i * 0.14, 1.7) * 0.55, i * 0.36, 0]}
          rotation={[0, 0, -i * 0.08]}
        >
          <cylinderGeometry args={[0.055 - i * 0.005, 0.07 - i * 0.005, 0.4, 8]} />
          <meshStandardMaterial color="#160926" roughness={0.5} metalness={0.3} emissive="#ff5fa8" emissiveIntensity={0.08} />
        </mesh>
      ))}
      {/* Crown & fronds */}
      <group ref={ref} position={[0.42, 2.1, 0]}>
        {fronds.map((deg, idx) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <group key={idx} rotation={[0, rad, 0]}>
              <mesh position={[0.42, -0.05, 0]} rotation={[0, 0, -0.38]}>
                <boxGeometry args={[0.85, 0.03, 0.16]} />
                <meshStandardMaterial
                  color="#120722"
                  roughness={0.4}
                  metalness={0.4}
                  emissive={idx % 2 === 0 ? '#ff5fa8' : '#ffc46b'}
                  emissiveIntensity={0.18}
                />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
}

/** GTA VI Vice Sunset Stage: Neon Art-Deco Pedestal, Sunset Sun Disc & Twin Palms */
function ViceStage({ accent }: { accent: string }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const sunMat = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }, dt) => {
    if (ringRef.current) ringRef.current.rotation.z -= dt * 0.35;
    if (sunMat.current) sunMat.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <group>
      {/* 3-Point GTA VI Sunset Studio Lighting */}
      <ambientLight intensity={1.25} color="#421c6b" />
      <directionalLight position={[4, 6, 5]} intensity={2.6} color="#ffc46b" />
      <pointLight position={[-4, 2.5, 2]} intensity={18} color="#ff5fa8" distance={14} />
      <pointLight position={[3.5, -1, 3]} intensity={14} color="#45e3d0" distance={12} />
      <pointLight position={[0, 1.5, -2]} intensity={10} color={accent} distance={10} />

      {/* Slatted Vice Sunset Sun Disc in Background */}
      <mesh position={[0, 0.55, -2.3]}>
        <planeGeometry args={[3.5, 3.5]} />
        <shaderMaterial
          ref={sunMat}
          transparent
          depthWrite={false}
          uniforms={{ uTime: { value: 0 } }}
          vertexShader={sunVertex}
          fragmentShader={sunFragment}
        />
      </mesh>

      {/* Twin 3D Vice Palm Trees framing the background */}
      <VicePalm position={[-2.25, -1.25, -1.7]} scale={0.92} />
      <VicePalm position={[2.25, -1.25, -1.7]} scale={0.92} flip />

      {/* Art-Deco Obsidian & Neon Boulevard Pedestal */}
      <group position={[0, -1.15, 0]}>
        {/* Solid Obsidian Octagonal Plinth */}
        <mesh position={[0, -0.14, 0]}>
          <cylinderGeometry args={[1.55, 1.72, 0.26, 16]} />
          <meshStandardMaterial color="#120824" metalness={0.75} roughness={0.22} />
        </mesh>

        {/* Top Glossy Mirror Deck */}
        <mesh position={[0, 0.0, 0]}>
          <cylinderGeometry args={[1.48, 1.48, 0.04, 32]} />
          <meshStandardMaterial color="#1d0d36" metalness={0.85} roughness={0.15} />
        </mesh>

        {/* Outer Hot-Pink Neon Tube Ring */}
        <mesh rotation-x={-Math.PI / 2} position-y={0.025}>
          <torusGeometry args={[1.5, 0.028, 12, 64]} />
          <meshBasicMaterial color="#ff5fa8" />
        </mesh>

        {/* Inner Project-Accent Neon Tube Ring */}
        <mesh ref={ringRef} rotation-x={-Math.PI / 2} position-y={0.028}>
          <ringGeometry args={[1.14, 1.2, 32]} />
          <meshBasicMaterial color={accent} side={THREE.DoubleSide} />
        </mesh>

        {/* Warm Sunset Floor Reflection Glow */}
        <mesh rotation-x={-Math.PI / 2} position-y={-0.26}>
          <ringGeometry args={[1.65, 2.7, 48]} />
          <meshBasicMaterial color="#ff5fa8" transparent opacity={0.16} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

/* ---------------- Model with materialise-in + optional drag to spin ---------------- */

interface DragState {
  active: boolean;
  lastX: number;
  velocity: number;
  offset: number;
}

function Model({
  shape,
  animate,
  drag,
}: {
  shape: Project['wireframeShape'];
  animate: boolean;
  drag: React.MutableRefObject<DragState>;
}) {
  const ref = useRef<THREE.Group>(null);
  const appear = useRef(0);

  useEffect(() => {
    appear.current = animate ? 0 : 1;
  }, [shape, animate]);

  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    appear.current = Math.min(1, appear.current + dt * 2.4);
    const e = animate ? 1 - Math.pow(1 - appear.current, 3) : 1;
    g.scale.setScalar(0.96 * (0.65 + 0.35 * e));
    const d = drag.current;
    if (!d.active) {
      d.offset += d.velocity;
      d.velocity *= 0.94;
    }
    g.rotation.y = d.offset + (1 - e) * -0.9;
    g.position.y = 0.28 + (animate ? Math.sin(performance.now() * 0.0014) * 0.055 : 0);
  });

  return (
    <group ref={ref} position={[0, 0.28, 0]} scale={0.96}>
      <HoloModel shape={shape} />
    </group>
  );
}

/* ---------------- Public Viewer ---------------- */

interface HoloViewerProps {
  shape: Project['wireframeShape'];
  accent: string;
  className?: string;
  interactive?: boolean;
  paused?: boolean;
}

const HoloViewer: React.FC<HoloViewerProps> = ({ shape, accent, className = '', interactive = false, paused = false }) => {
  const wrap = useRef<HTMLDivElement>(null);
  const inView = useInView(wrap, { margin: '120px' });
  const reduced = useReducedMotionPref();
  const palette = useMemo(() => makePalette(accent), [accent]);
  const drag = useRef<DragState>({ active: false, lastX: 0, velocity: 0, offset: 0 });
  const running = inView && !paused && !reduced;

  const handlers = interactive
    ? {
        onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => {
          drag.current.active = true;
          drag.current.lastX = e.clientX;
          drag.current.velocity = 0;
          e.currentTarget.setPointerCapture(e.pointerId);
        },
        onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => {
          const d = drag.current;
          if (!d.active) return;
          const dx = e.clientX - d.lastX;
          d.lastX = e.clientX;
          d.offset += dx * 0.011;
          d.velocity = dx * 0.011;
        },
        onPointerUp: () => {
          drag.current.active = false;
        },
        onPointerCancel: () => {
          drag.current.active = false;
        },
      }
    : {};

  return (
    <div
      ref={wrap}
      className={`relative ${interactive ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'} ${className}`}
      style={interactive ? { touchAction: 'pan-y' } : undefined}
      {...handlers}
    >
      <Canvas
        dpr={[1, 1.6]}
        frameloop={running ? 'always' : 'demand'}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0.85, 5.5], fov: 38 }}
        style={{ pointerEvents: 'none' }}
      >
        <HoloProvider value={palette}>
          <ViceStage accent={accent} />
          <Model key={shape} shape={shape} animate={!reduced} drag={drag} />
        </HoloProvider>
      </Canvas>
    </div>
  );
};

export default HoloViewer;
