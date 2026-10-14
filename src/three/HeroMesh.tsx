import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface NetworkProps {
  mouse: { normX: number; normY: number };
}

function NeuralNetworkCore({ mouse }: NetworkProps) {
  const groupRef = useRef<THREE.Group>(null);
  const outerRef = useRef<THREE.Group>(null);

  // Generate nodes and connecting lines on an algorithmic sphere/icosahedron
  const { nodePositions, linePositions } = useMemo(() => {
    const tempGeo = new THREE.IcosahedronGeometry(2.6, 2);
    const posAttr = tempGeo.attributes.position;
    const count = posAttr.count;

    const points: [number, number, number][] = [];
    const uniquePoints = new Set<string>();

    for (let i = 0; i < count; i++) {
      const x = Number(posAttr.getX(i).toFixed(3));
      const y = Number(posAttr.getY(i).toFixed(3));
      const z = Number(posAttr.getZ(i).toFixed(3));
      const key = `${x},${y},${z}`;
      if (!uniquePoints.has(key)) {
        uniquePoints.add(key);
        points.push([x, y, z]);
      }
    }

    const lines: number[] = [];
    const maxDist = 1.35;

    for (let i = 0; i < points.length; i++) {
      const p1 = points[i];
      for (let j = i + 1; j < points.length; j++) {
        const p2 = points[j];
        const dx = p1[0] - p2[0];
        const dy = p1[1] - p2[1];
        const dz = p1[2] - p2[2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < maxDist) {
          lines.push(p1[0], p1[1], p1[2], p2[0], p2[1], p2[2]);
        }
      }
    }

    const flatNodes = new Float32Array(points.flat());
    const flatLines = new Float32Array(lines);

    return { nodePositions: flatNodes, linePositions: flatLines };
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Continuous slow rotation
    groupRef.current.rotation.y += delta * 0.12;
    groupRef.current.rotation.x += delta * 0.05;

    // Mouse parallax interpolation
    const targetX = mouse.normY * 0.35;
    const targetY = mouse.normX * 0.45;
    groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.05;
    groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.05;

    if (outerRef.current) {
      outerRef.current.rotation.y -= delta * 0.08;
      outerRef.current.rotation.z += delta * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 1. Wireframe Core Icosahedron */}
      <mesh>
        <icosahedronGeometry args={[2.5, 2]} />
        <meshBasicMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.16}
        />
      </mesh>

      {/* 2. Inner Nested Dodecahedron */}
      <mesh>
        <dodecahedronGeometry args={[1.6, 0]} />
        <meshBasicMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.25}
        />
      </mesh>

      {/* 3. Neural Network Connecting Lines */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.32}
        />
      </lineSegments>

      {/* 4. Neural Network Nodes */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={nodePositions.length / 3}
            array={nodePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#ffffff"
          size={0.065}
          sizeAttenuation
          transparent
          opacity={0.9}
        />
      </points>

      {/* 5. Outer Orbital Gimbal Ring */}
      <group ref={outerRef}>
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <ringGeometry args={[3.4, 3.42, 64]} />
          <meshBasicMaterial
            color="#ffffff"
            wireframe
            transparent
            opacity={0.22}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh rotation={[-Math.PI / 4, Math.PI / 6, 0]}>
          <ringGeometry args={[3.8, 3.82, 64]} />
          <meshBasicMaterial
            color="#ffffff"
            wireframe
            transparent
            opacity={0.15}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
}

interface HeroMeshProps {
  mouse?: { normX: number; normY: number };
}

export const HeroMesh: React.FC<HeroMeshProps> = ({ mouse = { normX: 0, normY: 0 } }) => {
  const isReduced = useReducedMotion();

  if (isReduced) {
    // Static accessible fallback
    return (
      <div className="w-full h-full flex items-center justify-center pointer-events-none select-none">
        <div className="w-64 h-64 border border-white/20 rounded-full flex items-center justify-center relative animate-pulse-subtle">
          <div className="w-48 h-48 border border-white/30 rounded-full flex items-center justify-center">
            <div className="w-32 h-32 border border-white/40 rotate-45"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-12 h-12 border border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
        }
      >
        <Canvas
          camera={{ position: [0, 0, 7.8], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          className="w-full h-full"
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 10]} intensity={0.8} />
          <NeuralNetworkCore mouse={mouse} />
        </Canvas>
      </Suspense>
    </div>
  );
};

