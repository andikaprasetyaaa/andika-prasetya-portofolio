import React, { useRef, useMemo, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface ZoroSceneProps {
  mouse: { normX: number; normY: number };
}

// 01. 3D Curved Samurai Katana (Wado Ichimonji / Enma)
function SamuraiKatana3D() {
  const katanaRef = useRef<THREE.Group>(null);
  const slashRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (katanaRef.current) {
      // Slow rotation on Y and dynamic combat angle
      katanaRef.current.rotation.y += delta * 0.5;
      katanaRef.current.rotation.z = Math.sin(t * 1.8) * 0.08 - 0.45;
      katanaRef.current.rotation.x = Math.cos(t * 1.5) * 0.08 + 0.15;
    }

    if (slashRef.current) {
      // Rotating wind/energy slash crescent
      slashRef.current.rotation.z += delta * 2.2;
      const s = 1 + Math.sin(t * 3.5) * 0.08;
      slashRef.current.scale.set(s, s, s);
    }
  });

  // Construct curved katana blade path (Traditional Japanese Sori Curvature)
  const bladeGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const segments = 28;
    const length = 2.4;
    const positions: number[] = [];
    const indices: number[] = [];

    // Generate curved spine (mune) and sharp cutting edge (ha)
    for (let i = 0; i <= segments; i++) {
      const u = i / segments;
      const y = (u - 0.5) * length;
      // Authentic curvature
      const curve = Math.sin(u * Math.PI * 0.85) * 0.14;

      // Spine vertex
      positions.push(-curve + 0.02, y, 0);
      // Edge vertex
      positions.push(-curve - 0.04, y, 0);
    }

    for (let i = 0; i < segments; i++) {
      const a = i * 2;
      const b = a + 1;
      const c = a + 2;
      const d = a + 3;
      indices.push(a, b, c);
      indices.push(b, d, c);
    }

    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geom.setIndex(indices);
    geom.computeVertexNormals();
    return geom;
  }, []);

  return (
    <group ref={katanaRef} position={[0.7, -0.1, 0.9]} scale={[1.1, 1.1, 1.1]}>
      {/* Curved Katana Blade */}
      <mesh geometry={bladeGeometry} position={[0, 0.4, 0]}>
        <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} wireframe={false} />
      </mesh>

      {/* Blade Spine Wireframe Outline */}
      <mesh geometry={bladeGeometry} position={[0, 0.4, 0]}>
        <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} wireframe transparent opacity={0.65} />
      </mesh>

      {/* Pointed Sword Tip (Kissaki) */}
      <mesh position={[-0.04, 1.62, 0]} rotation={[0, 0, 0.4]}>
        <coneGeometry args={[0.04, 0.16, 4]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Habaki (Blade Collar) */}
      <mesh position={[0, -0.78, 0]}>
        <boxGeometry args={[0.07, 0.1, 0.04]} />
        <meshBasicMaterial color="#c4c7c8" />
      </mesh>

      {/* Tsuba (Samurai Handguard / Pelindung Tangan) */}
      <mesh position={[0, -0.84, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.03, 24]} />
        <meshBasicMaterial color="#ffffff" wireframe />
      </mesh>
      <mesh position={[0, -0.84, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.21, 0.21, 0.02, 16]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>

      {/* Tsuka (Gagang Pedang Bertali Tsuka-Ito) */}
      <mesh position={[0, -1.25, 0]}>
        <cylinderGeometry args={[0.045, 0.048, 0.76, 12]} />
        <meshBasicMaterial color="#c4c7c8" wireframe />
      </mesh>

      {/* Diamond Tsuka-Ito Cord Wrap Accents */}
      {[-1.0, -1.15, -1.3, -1.45].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.08, 0.03, 0.08]} />
          <meshBasicMaterial color="#ffffff" wireframe />
        </mesh>
      ))}

      {/* Kashira (Pommel / Ujung Bawah Gagang) */}
      <mesh position={[0, -1.64, 0]}>
        <sphereGeometry args={[0.052, 12, 12]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Saya (Sarung Pedang Katana / Scabbard) */}
      <mesh position={[-0.22, -0.5, -0.12]} rotation={[0, 0, 0.08]}>
        <cylinderGeometry args={[0.055, 0.05, 2.3, 12]} />
        <meshBasicMaterial color="#8e9192" wireframe transparent opacity={0.55} />
      </mesh>

      {/* 3D Wind / Energy Slash Arc (Cahaya Tebasan Samurai) */}
      <mesh ref={slashRef} position={[0, 0.4, 0]} rotation={[0.4, 0.2, 0]}>
        <ringGeometry args={[1.5, 1.58, 48, 1, 0, Math.PI * 1.1]} />
        <meshBasicMaterial
          color="#ffffff"
          side={THREE.DoubleSide}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// 02. Zoro Hologram Matrix Plane (Loaded from /sigma.png)
function ZoroHologram({ mouse }: ZoroSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useLoader(THREE.TextureLoader, '/sigma.png');

  useEffect(() => {
    if (texture) {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      texture.needsUpdate = true;
    }
  }, [texture]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Mouse parallax tilt interpolation
    const targetY = mouse.normX * 0.42;
    const targetX = -mouse.normY * 0.32;

    groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.08;
    groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.08;
  });

  return (
    <group ref={groupRef}>
      {/* Background Holographic Depth Plate (Zoro sigma.png) */}
      <mesh position={[0, 0, -0.45]}>
        {/* Aspect ratio 1.6: 1920 / 1200 */}
        <planeGeometry args={[6.2, 3.88]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Cybernetic Hologram Scanline Depth Plane */}
      <mesh position={[0, 0, -0.48]}>
        <planeGeometry args={[6.4, 4.0]} />
        <meshBasicMaterial
          color="#161616"
          transparent
          opacity={0.4}
          depthWrite={false}
        />
      </mesh>

      {/* Floating 3D Samurai Katana in front of Zoro */}
      <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.4}>
        <SamuraiKatana3D />
      </Float>

      {/* Orbital Telemetry Samurai Rings */}
      <mesh rotation={[Math.PI / 3, 0.4, 0]}>
        <ringGeometry args={[3.2, 3.22, 64]} />
        <meshBasicMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 3.5, -0.3, 0]}>
        <ringGeometry args={[3.6, 3.62, 64]} />
        <meshBasicMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.14}
          side={THREE.DoubleSide}
        />
      </mesh>
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
        <img
          src="/sigma.png"
          alt="Zoro Visual"
          className="w-full h-full object-contain filter invert opacity-80"
        />
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
          camera={{ position: [0, 0, 5.6], fov: 42 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          className="w-full h-full"
        >
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 8, 8]} intensity={1.2} />
          <ZoroHologram mouse={mouse} />
        </Canvas>
      </Suspense>
    </div>
  );
};
