import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useInView } from 'framer-motion';
import * as THREE from 'three';
import type { Project } from '../lib/projectsData';
import { useReducedMotionPref } from '../lib/settings';
import { HoloModel, HoloProvider, makePalette } from './HoloModels';

function displayColor(hex: string) {
  const c = new THREE.Color(hex);
  c.convertLinearToSRGB();
  return new THREE.Vector3(c.r, c.g, c.b);
}

/* ---------------- projector pad: rings, light cone, rising motes ---------------- */

const beamVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
const beamFragment = /* glsl */ `
uniform vec3 uColor;
varying vec2 vUv;
void main() {
  float a = pow(1.0 - vUv.y, 2.4) * 0.20;
  gl_FragColor = vec4(uColor * a, 1.0);
}
`;
const glowFragment = /* glsl */ `
uniform vec3 uColor;
varying vec2 vUv;
void main() {
  float d = length(vUv - 0.5) * 2.0;
  float a = pow(max(1.0 - d, 0.0), 2.0) * 0.38;
  gl_FragColor = vec4(uColor * a, 1.0);
}
`;
const moteVertex = /* glsl */ `
attribute float aSeed;
uniform float uTime;
uniform float uPx;
varying float vAlpha;
void main() {
  vec3 p = position;
  float span = 2.9;
  float y = mod(position.y + 1.3 + uTime * (0.16 + aSeed * 0.22), span);
  p.y = y - 1.3;
  p.x += sin(uTime * 0.7 + aSeed * 30.0) * 0.06;
  vAlpha = smoothstep(0.0, 0.35, y) * (1.0 - smoothstep(span - 0.9, span, y));
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uPx * (0.6 + aSeed * 0.9) / -mv.z;
}
`;
const moteFragment = /* glsl */ `
uniform vec3 uColor;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float a = pow(max(1.0 - d, 0.0), 2.0);
  gl_FragColor = vec4(uColor * a * vAlpha * 0.9, 1.0);
}
`;

function Pad({ accent }: { accent: string }) {
  const dashRef = useRef<THREE.Mesh>(null);
  const moteMat = useRef<THREE.ShaderMaterial>(null);
  const color = useMemo(() => displayColor(accent), [accent]);

  const motes = useMemo(() => {
    const n = 34;
    const pos = new Float32Array(n * 3);
    const seed = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const a = (i * 2.399963) % (Math.PI * 2);
      const r = 0.25 + ((i * 0.618) % 1) * 0.95;
      pos.set([Math.cos(a) * r, ((i * 0.37) % 1) * 2.9 - 1.3, Math.sin(a) * r], i * 3);
      seed[i] = (i * 0.754) % 1;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    return g;
  }, []);

  useEffect(() => () => motes.dispose(), [motes]);

  useFrame(({ clock, gl }, dt) => {
    if (dashRef.current) dashRef.current.rotation.z -= dt * 0.25;
    if (moteMat.current) {
      moteMat.current.uniforms.uTime.value = clock.elapsedTime;
      moteMat.current.uniforms.uPx.value = gl.domElement.height * 0.085;
    }
  });

  const common = { transparent: true, depthWrite: false, blending: THREE.AdditiveBlending } as const;

  return (
    <group position={[0, -1.12, 0]}>
      {/* floor glow */}
      <mesh rotation-x={-Math.PI / 2}>
        <planeGeometry args={[4.4, 4.4]} />
        <shaderMaterial args={[{ uniforms: { uColor: { value: color } }, vertexShader: beamVertex, fragmentShader: glowFragment }]} {...common} />
      </mesh>
      {/* pad rings */}
      <mesh rotation-x={-Math.PI / 2} position-y={0.01}>
        <ringGeometry args={[1.42, 1.46, 72]} />
        <meshBasicMaterial color={accent} transparent opacity={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={dashRef} rotation-x={-Math.PI / 2} position-y={0.012}>
        <ringGeometry args={[1.12, 1.18, 48, 1, 0, Math.PI * 1.55]} />
        <meshBasicMaterial color={accent} transparent opacity={0.45} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={0.008}>
        <ringGeometry args={[0.02, 1.42, 6, 1]} />
        <meshBasicMaterial color={accent} wireframe transparent opacity={0.14} />
      </mesh>
      {/* projector cone */}
      <mesh position-y={1.5}>
        <cylinderGeometry args={[1.75, 1.3, 3.0, 48, 1, true]} />
        <shaderMaterial
          args={[{ uniforms: { uColor: { value: color } }, vertexShader: beamVertex, fragmentShader: beamFragment }]}
          side={THREE.DoubleSide}
          {...common}
        />
      </mesh>
      {/* rising motes */}
      <points geometry={motes} position-y={1.3}>
        <shaderMaterial
          ref={moteMat}
          args={[
            {
              uniforms: { uColor: { value: color }, uTime: { value: 0 }, uPx: { value: 40 } },
              vertexShader: moteVertex,
              fragmentShader: moteFragment,
            },
          ]}
          {...common}
        />
      </points>
    </group>
  );
}

/* ---------------- model with materialise-in + optional drag to spin ---------------- */

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
    g.scale.setScalar(0.96 * (0.6 + 0.4 * e));
    // user spin with inertia
    const d = drag.current;
    if (!d.active) {
      d.offset += d.velocity;
      d.velocity *= 0.94;
    }
    g.rotation.y = d.offset + (1 - e) * -1.1;
    g.position.y = 0.34 + (animate ? Math.sin(performance.now() * 0.0011) * 0.045 : 0);
  });

  return (
    <group ref={ref} position={[0, 0.34, 0]} scale={0.96}>
      <HoloModel shape={shape} />
    </group>
  );
}

/* ---------------- public viewer ---------------- */

interface HoloViewerProps {
  shape: Project['wireframeShape'];
  accent: string;
  className?: string;
  /** Allow dragging to spin the model */
  interactive?: boolean;
  /** Hold rendering (e.g. while a modal covers this viewer) */
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
        camera={{ position: [0, 0.9, 5.6], fov: 38 }}
        style={{ pointerEvents: 'none' }}
      >
        <HoloProvider value={palette}>
          <Pad accent={accent} />
          <Model key={shape} shape={shape} animate={!reduced} drag={drag} />
        </HoloProvider>
      </Canvas>
    </div>
  );
};

export default HoloViewer;
