import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface OrbitNodeProps {
  position: [number, number, number];
  label: string;
  category: string;
  speed?: number;
}

function OrbitNode({ position, label, category, speed = 1 }: OrbitNodeProps) {
  return (
    <Float speed={speed * 1.5} rotationIntensity={0.4} floatIntensity={1.2}>
      <group position={position}>
        <mesh>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <Html center distanceFactor={10} zIndexRange={[100, 0]}>
          <div className="pointer-events-none select-none flex items-center gap-1.5 px-2.5 py-1 bg-[#131313]/90 border border-[#444748] shadow-xl backdrop-blur-md whitespace-nowrap">
            <span className="w-1 h-1 rounded-full bg-white animate-pulse"></span>
            <span className="font-mono text-[9px] text-[#8e9192] uppercase">{category}</span>
            <span className="font-mono text-[10px] text-white font-semibold uppercase">{label}</span>
          </div>
        </Html>
      </group>
    </Float>
  );
}

function CentralWireframeObject() {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * 0.15;
    }
  });

  return (
    <group>
      {/* Central Rotating Geometric Core */}
      <mesh ref={meshRef}>
        <octahedronGeometry args={[1.5, 0]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.35} />
      </mesh>

      {/* Orbiting Axis Rings */}
      <group ref={ringRef}>
        <mesh rotation={[Math.PI / 4, 0, 0]}>
          <ringGeometry args={[2.8, 2.82, 48]} />
          <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.18} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[-Math.PI / 3, Math.PI / 4, 0]}>
          <ringGeometry args={[3.4, 3.42, 48]} />
          <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.12} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

export const StackOrbit: React.FC = () => {
  const isReduced = useReducedMotion();

  if (isReduced) {
    return (
      <div className="w-full h-full flex items-center justify-center pointer-events-none select-none">
        <div className="w-48 h-48 border border-white/20 rounded-full flex items-center justify-center">
          <span className="font-mono text-xs text-white/60">TENSOR CLUSTER CORE</span>
        </div>
      </div>
    );
  }

  const nodes: { position: [number, number, number]; label: string; category: string; speed: number }[] = [
    { position: [-2.4, 1.4, 0.5], label: 'PyTorch', category: 'ML', speed: 1.1 },
    { position: [2.5, 1.2, -0.6], label: 'GraphRAG', category: 'NLP', speed: 0.9 },
    { position: [-2.6, -1.2, 0.8], label: 'PostgreSQL', category: 'DATA', speed: 1.3 },
    { position: [2.2, -1.4, 0.4], label: 'FastAPI', category: 'API', speed: 1.0 },
    { position: [0.3, 2.5, 0.8], label: 'IndoBERT', category: 'LLM', speed: 1.2 },
    { position: [-0.4, -2.4, -0.7], label: 'Docker', category: 'INFRA', speed: 0.8 },
    { position: [1.8, 0.2, 1.8], label: 'Neo4j', category: 'GRAPH', speed: 1.4 },
    { position: [-1.9, 0.3, -1.6], label: 'FAISS', category: 'VEC', speed: 1.1 },
  ];

  return (
    <div className="w-full h-full relative">
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 7.5], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          className="w-full h-full"
        >
          <ambientLight intensity={0.5} />
          <CentralWireframeObject />
          {nodes.map((node, i) => (
            <OrbitNode
              key={i}
              position={node.position}
              label={node.label}
              category={node.category}
              speed={node.speed}
            />
          ))}
        </Canvas>
      </Suspense>
    </div>
  );
};

