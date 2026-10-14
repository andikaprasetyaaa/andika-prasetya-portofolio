import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 3D Starfield layer with depth, twinkling, and mouse parallax
const DeepStars: React.FC<{ count?: number }> = ({ count = 2200 }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const scrollRef = useRef(0);

  // Generate 3D spherical distribution with variable depths
  const [positions, sizes, opacities, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const op = new Float32Array(count);
    const sp = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Cylindrical/spherical volume distribution
      const radius = 15 + Math.random() * 45;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60;

      // Variable star scales
      const rand = Math.random();
      sz[i] = rand > 0.96 ? 2.4 : rand > 0.8 ? 1.6 : 0.8;
      op[i] = 0.2 + Math.random() * 0.8;
      sp[i] = 0.5 + Math.random() * 1.5;
    }
    return [pos, sz, op, sp];
  }, [count]);

  // Track window scroll for scroll-driven star drift
  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    // Slow orbital rotation
    pointsRef.current.rotation.y += delta * 0.025;
    pointsRef.current.rotation.x += delta * 0.01;

    // Mouse parallax tracking
    const targetX = state.pointer.x * 2.5;
    const targetY = state.pointer.y * 2.0;
    pointsRef.current.position.x += (targetX - pointsRef.current.position.x) * 0.04;
    pointsRef.current.position.y += (targetY - pointsRef.current.position.y) * 0.04;

    // Subtle scroll travel through the stars
    const targetZ = -(scrollRef.current * 0.006) % 30;
    pointsRef.current.position.z += (targetZ - pointsRef.current.position.z) * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.12}
        sizeAttenuation
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// Periodic 3D Shooting Star / Meteor
const ShootingStar: React.FC = () => {
  const lineRef = useRef<THREE.Line>(null);
  const activeRef = useRef(false);
  const progressRef = useRef(0);
  const startPos = useRef(new THREE.Vector3());
  const velocity = useRef(new THREE.Vector3());

  const resetMeteor = () => {
    activeRef.current = true;
    progressRef.current = 0;
    // Random origin at upper sector
    startPos.current.set(
      (Math.random() - 0.5) * 35,
      12 + Math.random() * 10,
      -10 + (Math.random() - 0.5) * 15
    );
    // Trajectory down-left or down-right with high speed
    velocity.current.set(
      -(18 + Math.random() * 12),
      -(14 + Math.random() * 10),
      (Math.random() - 0.5) * 8
    );
  };

  useEffect(() => {
    // Fire shooting stars every 3.5 - 7 seconds
    const interval = setInterval(() => {
      if (!activeRef.current && Math.random() > 0.3) {
        resetMeteor();
      }
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const lineObject = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const pos = new Float32Array([0, 0, 0, -3.5, 2.5, 0]);
    geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    return new THREE.Line(geom, mat);
  }, []);

  useFrame((state, delta) => {
    if (!lineRef.current || !activeRef.current) return;

    progressRef.current += delta * 2.2;
    const mat = lineObject.material as THREE.LineBasicMaterial;

    if (progressRef.current >= 1) {
      activeRef.current = false;
      mat.opacity = 0;
      return;
    }

    // Move along trajectory
    lineRef.current.position.x = startPos.current.x + velocity.current.x * progressRef.current;
    lineRef.current.position.y = startPos.current.y + velocity.current.y * progressRef.current;
    lineRef.current.position.z = startPos.current.z + velocity.current.z * progressRef.current;

    // Fade in quickly, then fade out
    if (progressRef.current < 0.2) {
      mat.opacity = (progressRef.current / 0.2) * 0.9;
    } else {
      mat.opacity = (1 - (progressRef.current - 0.2) / 0.8) * 0.9;
    }
  });

  return <primitive object={lineObject} ref={lineRef} />;
};

// Subtle 3D Geometric Stardust Polyhedrons floating in deep space
const FloatingStardust: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const items = useMemo(() => {
    return Array.from({ length: 18 }).map(() => ({
      pos: [
        (Math.random() - 0.5) * 36,
        (Math.random() - 0.5) * 28,
        (Math.random() - 0.5) * 20,
      ] as [number, number, number],
      scale: 0.15 + Math.random() * 0.3,
      speedX: 0.2 + Math.random() * 0.5,
      speedY: 0.3 + Math.random() * 0.6,
    }));
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.04;
    groupRef.current.children.forEach((child, idx) => {
      const item = items[idx];
      if (item) {
        child.rotation.x += delta * item.speedX;
        child.rotation.y += delta * item.speedY;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {items.map((item, idx) => (
        <mesh key={idx} position={item.pos} scale={item.scale}>
          <octahedronGeometry args={[1, 0]} />
          <meshBasicMaterial
            wireframe
            color="#ffffff"
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
};

export const GlobalStarfield3D: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ opacity: 0.85 }}
    >
      <Canvas
        camera={{ position: [0, 0, 22], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      >
        <DeepStars count={2400} />
        <FloatingStardust />
        <ShootingStar />
      </Canvas>
    </div>
  );
};

