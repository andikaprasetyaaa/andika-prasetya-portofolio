import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface ShapeMeshProps {
  shape: 'newspaper' | 'ufc-octagon' | 'fashion-hanger' | 'boxing' | 'discount-tag' | 'shopping-cart' | 'chat-shield' | 'vision-apple';
}

// 01. Boxing: 100% 3D Pro Boxing Glove (Sarung Tinju 3D)
const BoxingModel: React.FC = () => {
  const gloveGroupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!gloveGroupRef.current) return;
    const t = state.clock.elapsedTime;

    // Smooth continuous 3D rotation
    gloveGroupRef.current.rotation.y += delta * 0.6;

    // Floating combat stance bobbing & tilting
    gloveGroupRef.current.rotation.x = Math.sin(t * 2) * 0.12 + 0.1;
    gloveGroupRef.current.rotation.z = Math.cos(t * 1.8) * 0.08 - 0.15;

    // Periodic jab punch snap forward
    const punchCycle = (t * 2.5) % (Math.PI * 2);
    const isJab = Math.sin(punchCycle) > 0.85;
    const jabZ = isJab ? Math.sin(punchCycle) * 0.35 : 0;
    gloveGroupRef.current.position.z = jabZ;
  });

  return (
    <group ref={gloveGroupRef} position={[0, 0, 0]}>
      {/* --- MAIN PADDED KNUCKLE FIST (Kepala Sarung Tinju) --- */}
      {/* Outer Knuckle Strike Dome */}
      <mesh position={[0, 0.35, 0]} scale={[1.25, 1.4, 1.1]}>
        <sphereGeometry args={[0.55, 24, 20]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.85} />
      </mesh>

      {/* Solid Inner Volume for Depth & Shadow */}
      <mesh position={[0, 0.35, 0]} scale={[1.2, 1.35, 1.05]}>
        <sphereGeometry args={[0.52, 16, 16]} />
        <meshBasicMaterial color="#1a1a1a" transparent opacity={0.65} />
      </mesh>

      {/* Knuckle Strike Ridge Line / Seam */}
      <mesh position={[0, 0.82, 0.22]} rotation={[0.45, 0, 0]}>
        <torusGeometry args={[0.38, 0.025, 8, 24, Math.PI * 0.9]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* --- THUMB (Jempol Sarung Tinju dengan Thumb-Lock) --- */}
      <group position={[-0.52, 0.18, 0.28]} rotation={[0.3, 0.25, -0.65]}>
        {/* Thumb Padded Capsule */}
        <mesh scale={[0.85, 1.35, 0.85]}>
          <sphereGeometry args={[0.24, 16, 16]} />
          <meshBasicMaterial color="#ffffff" wireframe />
        </mesh>
        {/* Inner Solid Thumb Core */}
        <mesh scale={[0.8, 1.3, 0.8]}>
          <sphereGeometry args={[0.22, 12, 12]} />
          <meshBasicMaterial color="#1f1f1f" />
        </mesh>
        {/* Thumb Lock Safety Strap (Menghubungkan jempol ke kepalan) */}
        <mesh position={[0.2, 0.08, -0.08]} rotation={[0, 0, 0.75]}>
          <boxGeometry args={[0.28, 0.07, 0.03]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* --- PALM & GRIP BAR (Bagian Telapak & Grip Bar) --- */}
      {/* Palm Inset Cavity */}
      <mesh position={[0.05, 0.22, -0.25]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.38, 0.35, 0.5, 16, 2, true]} />
        <meshBasicMaterial color="#8e9192" wireframe transparent opacity={0.45} />
      </mesh>

      {/* Internal Grip Bar (Batang Pegangan Jari) */}
      <mesh position={[0.05, 0.18, -0.16]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.065, 0.065, 0.55, 12]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Palm Breathable Eyelets (Lubang Sirkulasi Udara) */}
      {[-0.12, 0, 0.12].map((x, i) => (
        <mesh key={i} position={[x + 0.05, 0.32, -0.36]}>
          <circleGeometry args={[0.022, 8]} />
          <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* --- WRIST SUPPORT CUFF (Manset Pergelangan Tangan) --- */}
      <mesh position={[0, -0.42, 0]}>
        <cylinderGeometry args={[0.48, 0.55, 0.65, 20, 3, true]} />
        <meshBasicMaterial color="#c4c7c8" wireframe transparent opacity={0.8} />
      </mesh>

      {/* Inner Cuff Volume */}
      <mesh position={[0, -0.42, 0]}>
        <cylinderGeometry args={[0.46, 0.53, 0.63, 16, 1, true]} />
        <meshBasicMaterial color="#161616" />
      </mesh>

      {/* --- WIDE VELCRO STRAP BAND (Tali Perekat Velcro 16-OZ) --- */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.52, 0.54, 0.26, 20, 1, true]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Strap Edges / Seams */}
      <mesh position={[0, -0.27, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.51, 0.018, 8, 24]} />
        <meshBasicMaterial color="#8e9192" />
      </mesh>
      <mesh position={[0, -0.53, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.53, 0.018, 8, 24]} />
        <meshBasicMaterial color="#8e9192" />
      </mesh>

      {/* Pro Boxing Glove Brand Patch Label */}
      <group position={[0, -0.4, 0.53]}>
        <mesh>
          <boxGeometry args={[0.5, 0.16, 0.02]} />
          <meshBasicMaterial color="#0a0a0a" />
        </mesh>
        <mesh position={[0, 0, 0.015]}>
          <boxGeometry args={[0.46, 0.12, 0.01]} />
          <meshBasicMaterial color="#ffffff" wireframe />
        </mesh>
      </group>

      {/* --- WRIST LACING / SEAM ACCENTS --- */}
      <lineSegments position={[0.02, -0.42, -0.52]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={8}
            array={new Float32Array([
              -0.12, 0.12, 0, 0.12, 0.06, 0,
              0.12, 0.06, 0, -0.12, 0.0, 0,
              -0.12, 0.0, 0, 0.12, -0.06, 0,
              0.12, -0.06, 0, -0.12, -0.12, 0,
            ])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#ffffff" linewidth={2} />
      </lineSegments>
    </group>
  );
};

// 02. UFC-GraphRAG: 3D Octagon Cage with Graph Nodes Inside
const UfcOctagonModel: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const graphRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.4;
    if (graphRef.current) graphRef.current.rotation.y -= delta * 0.6;
  });

  const posts = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => {
      const angle = (i * Math.PI * 2) / 8;
      const radius = 1.35;
      return [radius * Math.cos(angle), radius * Math.sin(angle)];
    });
  }, []);

  return (
    <group ref={groupRef}>
      {/* Octagon Canvas Floor */}
      <mesh position={[0, -0.65, 0]} rotation={[0, Math.PI / 8, 0]}>
        <cylinderGeometry args={[1.35, 1.35, 0.08, 8]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.8} />
      </mesh>

      {/* 8 Corner Posts */}
      {posts.map(([x, z], i) => (
        <mesh key={i} position={[x, 0, z]}>
          <cylinderGeometry args={[0.04, 0.04, 1.3, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}

      {/* Octagonal Wireframe Fence Cage */}
      <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 8, 0]}>
        <cylinderGeometry args={[1.35, 1.35, 1.3, 8, 6, true]} />
        <meshBasicMaterial color="#c4c7c8" wireframe transparent opacity={0.45} />
      </mesh>

      {/* Top Rail Padding */}
      <mesh position={[0, 0.65, 0]} rotation={[0, Math.PI / 8, 0]}>
        <cylinderGeometry args={[1.38, 1.38, 0.06, 8, 1, true]} />
        <meshBasicMaterial color="#ffffff" wireframe />
      </mesh>

      {/* Floating Graph Nodes Inside Octagon */}
      <group ref={graphRef} position={[0, 0.1, 0]}>
        <mesh>
          <octahedronGeometry args={[0.5, 0]} />
          <meshBasicMaterial color="#ffffff" wireframe />
        </mesh>
        <points>
          <sphereGeometry args={[0.7, 8, 8]} />
          <pointsMaterial color="#ffffff" size={0.08} />
        </points>
      </group>
    </group>
  );
};

// 03. News Summarization: 3D Newspaper / Open Document with AI Scan Line
const NewspaperModel: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const scanRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.45;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.5) * 0.15;
    }
    if (scanRef.current) {
      scanRef.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.7;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Left Page */}
      <mesh position={[-0.55, 0, 0.08]} rotation={[0, 0.18, 0]}>
        <boxGeometry args={[0.9, 1.4, 0.03]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.7} />
      </mesh>

      {/* Right Page */}
      <mesh position={[0.55, 0, 0.08]} rotation={[0, -0.18, 0]}>
        <boxGeometry args={[0.9, 1.4, 0.03]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.7} />
      </mesh>

      {/* Spine / Crease */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.42, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Text Lines Representation */}
      {[-0.4, -0.2, 0.0, 0.2, 0.4].map((y, i) => (
        <group key={i}>
          <mesh position={[-0.55, y, 0.1]}>
            <boxGeometry args={[0.6, 0.03, 0.01]} />
            <meshBasicMaterial color="#8e9192" transparent opacity={0.5} />
          </mesh>
          <mesh position={[0.55, y, 0.1]}>
            <boxGeometry args={[0.6, 0.03, 0.01]} />
            <meshBasicMaterial color="#8e9192" transparent opacity={0.5} />
          </mesh>
        </group>
      ))}

      {/* Laser AI Summarization Scan Line */}
      <mesh ref={scanRef} position={[0, 0, 0.14]}>
        <boxGeometry args={[1.9, 0.04, 0.02]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
};

// 04. Fashion Ops: 3D Clothes Hanger & Garment
const FashionHangerModel: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.5;
  });

  return (
    <group ref={groupRef}>
      {/* Top Hook */}
      <mesh position={[0, 0.95, 0]}>
        <torusGeometry args={[0.2, 0.03, 8, 16, Math.PI * 1.3]} />
        <meshBasicMaterial color="#ffffff" wireframe />
      </mesh>

      {/* Hanger Triangle Frame */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={6}
            array={new Float32Array([
              0, 0.75, 0, -1.0, 0.35, 0,
              -1.0, 0.35, 0, 1.0, 0.35, 0,
              1.0, 0.35, 0, 0, 0.75, 0,
            ])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#ffffff" linewidth={2} />
      </lineSegments>

      {/* Stylized Hanging Garment / Shirt Body */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.7, 0.9, 1.1, 12, 3, true]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.65} />
      </mesh>

      {/* Sleeves */}
      <mesh position={[-0.8, 0.1, 0]} rotation={[0, 0, 0.6]}>
        <cylinderGeometry args={[0.25, 0.3, 0.5, 8, 1, true]} />
        <meshBasicMaterial color="#8e9192" wireframe transparent opacity={0.5} />
      </mesh>
      <mesh position={[0.8, 0.1, 0]} rotation={[0, 0, -0.6]}>
        <cylinderGeometry args={[0.25, 0.3, 0.5, 8, 1, true]} />
        <meshBasicMaterial color="#8e9192" wireframe transparent opacity={0.5} />
      </mesh>
    </group>
  );
};

// 05. Discount Alert: 3D Retail Price Tag with "%" Symbol
const DiscountTagModel: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.5;
    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.08;
  });

  return (
    <group ref={groupRef}>
      {/* Hanging Loop / String */}
      <mesh position={[0, 1.05, 0]}>
        <torusGeometry args={[0.22, 0.02, 8, 16]} />
        <meshBasicMaterial color="#8e9192" wireframe />
      </mesh>

      {/* Main Tag Body */}
      <mesh position={[0, 0.0, 0]}>
        <boxGeometry args={[1.1, 1.6, 0.06]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.7} />
      </mesh>

      {/* Clipped Top Corners Wireframe */}
      <mesh position={[0, 0.8, 0]}>
        <coneGeometry args={[0.55, 0.35, 4]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.5} />
      </mesh>

      {/* Tag Eyelet Hole */}
      <mesh position={[0, 0.65, 0.04]}>
        <ringGeometry args={[0.07, 0.12, 16]} />
        <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
      </mesh>

      {/* Big "%" Percent Discount Glyph in 3D */}
      <group position={[0, -0.1, 0.05]}>
        {/* Slash */}
        <mesh rotation={[0, 0, 0.65]}>
          <boxGeometry args={[0.8, 0.08, 0.04]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Top-Left Circle */}
        <mesh position={[-0.22, 0.22, 0]}>
          <torusGeometry args={[0.12, 0.04, 8, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Bottom-Right Circle */}
        <mesh position={[0.22, -0.22, 0]}>
          <torusGeometry args={[0.12, 0.04, 8, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
    </group>
  );
};

// 06. Shopify Store Pulse: 3D Shopping Cart with Pulsing Core
const ShoppingCartModel: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.45;
    if (pulseRef.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.25;
      pulseRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Basket Grid Body */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[1.3, 0.9, 0.9]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.7} />
      </mesh>

      {/* Push Handle */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={4}
            array={new Float32Array([
              -0.65, 0.65, 0.45, -0.95, 0.85, 0.45,
              -0.65, 0.65, -0.45, -0.95, 0.85, -0.45,
            ])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#ffffff" />
      </lineSegments>
      <mesh position={[-0.95, 0.85, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.95, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Cart Lower Wheel Chassis */}
      <mesh position={[-0.1, -0.4, 0]}>
        <boxGeometry args={[1.0, 0.1, 0.7]} />
        <meshBasicMaterial color="#8e9192" wireframe />
      </mesh>

      {/* 4 Wheels */}
      {[
        [-0.45, -0.55, 0.35],
        [0.35, -0.55, 0.35],
        [-0.45, -0.55, -0.35],
        [0.35, -0.55, -0.35],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.08, 12]} />
          <meshBasicMaterial color="#ffffff" wireframe />
        </mesh>
      ))}

      {/* Pulsing Telemetry Heartbeat Core inside basket */}
      <mesh ref={pulseRef} position={[0, 0.2, 0]}>
        <dodecahedronGeometry args={[0.35, 0]} />
        <meshBasicMaterial color="#ffffff" wireframe />
      </mesh>
    </group>
  );
};

// 07. IndoBERTweet: 3D Speech/Tweet Bubble & Security Shield
const ChatShieldModel: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const shieldRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.5;
    if (shieldRef.current) shieldRef.current.rotation.y -= delta * 0.3;
  });

  return (
    <group ref={groupRef}>
      {/* Speech Bubble Main Box */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[1.5, 1.1, 0.5]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.65} />
      </mesh>

      {/* Speech Bubble Corner Tail */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={6}
            array={new Float32Array([
              -0.5, -0.35, 0.25, -0.85, -0.75, 0.25,
              -0.85, -0.75, 0.25, -0.15, -0.35, 0.25,
              -0.15, -0.35, 0.25, -0.5, -0.35, 0.25,
            ])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#ffffff" />
      </lineSegments>

      {/* Security Filter Shield */}
      <mesh ref={shieldRef} position={[0, 0.2, 0.35]}>
        <octahedronGeometry args={[0.45, 0]} />
        <meshBasicMaterial color="#ffffff" wireframe />
      </mesh>

      {/* Filter Checkmark in Shield */}
      <mesh position={[0, 0.2, 0.6]}>
        <ringGeometry args={[0.1, 0.16, 16]} />
        <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

// 08. Edge Vision AI: 3D Fruit (Apple) with AI Bounding Box & Reticle
const VisionAppleModel: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const boxRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.45;
    if (boxRef.current) {
      // Bounding box subtle target pulse
      const s = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.05;
      boxRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Apple Body */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.65} />
      </mesh>

      {/* Stem */}
      <mesh position={[0, 0.75, 0]} rotation={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.35, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Leaf */}
      <mesh position={[0.18, 0.8, 0]} rotation={[0, 0, -0.8]}>
        <boxGeometry args={[0.25, 0.1, 0.02]} />
        <meshBasicMaterial color="#8e9192" wireframe />
      </mesh>

      {/* AI Computer Vision Bounding Box with Corner Brackets */}
      <group ref={boxRef}>
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[1.7, 1.7, 1.7]} />
          <meshBasicMaterial color="#c4c7c8" wireframe transparent opacity={0.35} />
        </mesh>
        {/* Detection Confidence Reticle / Tag */}
        <mesh position={[0, 0.95, 0.86]}>
          <boxGeometry args={[0.6, 0.12, 0.02]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
    </group>
  );
};

export const ProjectVisualizer3D: React.FC<{
  shape: 'newspaper' | 'ufc-octagon' | 'fashion-hanger' | 'boxing' | 'discount-tag' | 'shopping-cart' | 'chat-shield' | 'vision-apple';
  className?: string;
}> = ({ shape, className = 'w-full h-full' }) => {
  return (
    <div className={`relative ${className} select-none pointer-events-none`}>
      <Canvas
        camera={{ position: [0, 0, 4.0], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.9} />
        <Float speed={1.8} rotationIntensity={0.5} floatIntensity={0.4}>
          {shape === 'boxing' && <BoxingModel />}
          {shape === 'ufc-octagon' && <UfcOctagonModel />}
          {shape === 'newspaper' && <NewspaperModel />}
          {shape === 'fashion-hanger' && <FashionHangerModel />}
          {shape === 'discount-tag' && <DiscountTagModel />}
          {shape === 'shopping-cart' && <ShoppingCartModel />}
          {shape === 'chat-shield' && <ChatShieldModel />}
          {shape === 'vision-apple' && <VisionAppleModel />}
        </Float>
      </Canvas>
    </div>
  );
};
