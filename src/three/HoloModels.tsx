import React, { createContext, useContext, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Project } from '../lib/projectsData';

/**
 * High-Detail Sculpted 3D GTA VI Vice Sunset Diorama Models.
 * Every model uses custom sculpted ExtrudeGeometry / LatheGeometry / multi-part articulated
 * assemblies with metallic & glowing Vice neon materials.
 */

export interface HoloPalette {
  main: string;
  soft: string;
  dim: string;
  solid: string;
}

const HoloContext = createContext<HoloPalette>({
  main: '#ff5fa8',
  soft: '#ffd98a',
  dim: '#9d6bff',
  solid: '#1a0c2e',
});
export const HoloProvider = HoloContext.Provider;
const useHolo = () => useContext(HoloContext);

export function makePalette(accent: string): HoloPalette {
  const main = new THREE.Color(accent);
  const soft = main.clone().lerp(new THREE.Color('#ffd98a'), 0.45);
  const dim = main.clone().lerp(new THREE.Color('#ff5fa8'), 0.45);
  return {
    main: `#${main.getHexString()}`,
    soft: `#${soft.getHexString()}`,
    dim: `#${dim.getHexString()}`,
    solid: '#1c0e32',
  };
}

/* ============================================================================
 * 01. BOXING COACH: Championship 3D Boxing Ring + Corner Stairs + 3D Pose Boxer
 * ============================================================================ */
const BoxingModel: React.FC = () => {
  const c = useHolo();
  const ringRef = useRef<THREE.Group>(null);
  const fighterRef = useRef<THREE.Group>(null);

  // Sculpted trapezoidal corner turnbuckle pad geometry
  const padGeo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.07, -0.4);
    s.lineTo(0.07, -0.4);
    s.lineTo(0.085, 0.4);
    s.lineTo(-0.085, 0.4);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, {
      depth: 0.14,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.02,
      bevelThickness: 0.02,
    });
    g.center();
    return g;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (ringRef.current) {
      ringRef.current.rotation.y += delta * 0.38;
      ringRef.current.rotation.x = Math.sin(t * 1.3) * 0.04 + 0.26;
    }
    if (fighterRef.current) {
      // Subtle boxer rhythm bob & weave inside the ring
      fighterRef.current.position.y = -0.35 + Math.abs(Math.sin(t * 3.2)) * 0.05;
      fighterRef.current.rotation.y = Math.sin(t * 2.4) * 0.18;
    }
  });

  const postPositions: [number, number][] = [
    [-1.02, -1.02],
    [1.02, 1.02],
    [-1.02, 1.02],
    [1.02, -1.02],
  ];

  const ropeHeights = [-0.14, 0.06, 0.26, 0.46];
  const ropeRadius = 0.96;
  const ropeColors = ['#ff5fa8', '#ffc46b', '#ff5fa8', '#45e3d0'];

  return (
    <group ref={ringRef} position={[0, -0.06, 0]}>
      {/* --- 1. ELEVATED STADIUM RING BASE, SKIRT & STEEL UNDER-TRUSS --- */}
      <mesh position={[0, -0.56, 0]}>
        <boxGeometry args={[2.32, 0.3, 2.32]} />
        <meshStandardMaterial color="#17092b" metalness={0.65} roughness={0.28} />
      </mesh>
      {/* Outer Padded Apron Ledge */}
      <mesh position={[0, -0.4, 0]}>
        <boxGeometry args={[2.38, 0.05, 2.38]} />
        <meshStandardMaterial color="#2a134a" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Glowing Neon Championship Apron Trim */}
      <mesh position={[0, -0.42, 0]}>
        <boxGeometry args={[2.4, 0.022, 2.4]} />
        <meshBasicMaterial color={c.main} />
      </mesh>
      <mesh position={[0, -0.68, 0]}>
        <boxGeometry args={[2.35, 0.022, 2.35]} />
        <meshBasicMaterial color="#ffc46b" />
      </mesh>

      {/* Corner Ring Entry Staircase (3 Metallic Steps at Front-Left Corner) */}
      <group position={[-1.24, -0.58, 0.85]}>
        {[0, 1, 2].map((step) => (
          <mesh key={step} position={[-step * 0.1, -step * 0.08, 0]}>
            <boxGeometry args={[0.14, 0.04, 0.34]} />
            <meshStandardMaterial color="#ffc46b" metalness={0.85} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* --- 2. CANVAS FIGHTING MAT & CORNER ZONES --- */}
      <mesh position={[0, -0.372, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.22, 2.22]} />
        <meshStandardMaterial color="#21103a" roughness={0.42} metalness={0.28} />
      </mesh>
      {/* Outer Boundary Box Line */}
      <mesh position={[0, -0.368, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 4]}>
        <ringGeometry args={[1.22, 1.26, 4]} />
        <meshBasicMaterial color="#ffd98a" side={THREE.DoubleSide} />
      </mesh>
      {/* Center Championship Medallion Logo */}
      <mesh position={[0, -0.367, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.28, 0.38, 32]} />
        <meshBasicMaterial color="#ffc46b" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -0.367, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.22, 32]} />
        <meshBasicMaterial color="#ff5fa8" side={THREE.DoubleSide} />
      </mesh>

      {/* --- 3. 4 HEAVY CORNER POSTS, TURNBUCKLE STRUTS, SCULPTED PADS & STOOLS --- */}
      {postPositions.map(([x, z], i) => {
        const cornerColor = i === 0 ? '#ff5fa8' : i === 1 ? '#45e3d0' : '#ffc46b';
        const angle = Math.atan2(-z, -x);
        return (
          <group key={i} position={[x, 0.08, z]}>
            {/* Outer Steel Corner Pillar */}
            <mesh>
              <cylinderGeometry args={[0.06, 0.065, 1.18, 16]} />
              <meshStandardMaterial color="#2a1548" metalness={0.88} roughness={0.16} />
            </mesh>
            {/* Glowing Top Finial Dome */}
            <mesh position={[0, 0.62, 0]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshBasicMaterial color={cornerColor} />
            </mesh>
            {/* Sculpted Beveled Corner Turnbuckle Pad */}
            <mesh
              geometry={padGeo}
              position={[-x * 0.13, 0.12, -z * 0.13]}
              rotation={[0, -angle + Math.PI / 2, 0]}
            >
              <meshStandardMaterial
                color={cornerColor}
                roughness={0.28}
                metalness={0.45}
                emissive={cornerColor}
                emissiveIntensity={0.32}
              />
            </mesh>
            {/* Corner Fighter Stool in Red & Blue Corners */}
            {i < 2 && (
              <mesh position={[-x * 0.2, -0.38, -z * 0.2]}>
                <cylinderGeometry args={[0.09, 0.07, 0.14, 14]} />
                <meshStandardMaterial color={cornerColor} metalness={0.7} roughness={0.25} />
              </mesh>
            )}
          </group>
        );
      })}

      {/* --- 4. 4 TIERS OF CYLINDRICAL TENSIONED BOXING ROPES --- */}
      {ropeHeights.map((y, tier) => (
        <group key={tier} position={[0, y, 0]}>
          <mesh position={[0, 0, -ropeRadius]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.018, 0.018, 1.94, 12]} />
            <meshBasicMaterial color={ropeColors[tier]} />
          </mesh>
          <mesh position={[0, 0, ropeRadius]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.018, 0.018, 1.94, 12]} />
            <meshBasicMaterial color={ropeColors[tier]} />
          </mesh>
          <mesh position={[ropeRadius, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 1.94, 12]} />
            <meshBasicMaterial color={ropeColors[tier]} />
          </mesh>
          <mesh position={[-ropeRadius, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 1.94, 12]} />
            <meshBasicMaterial color={ropeColors[tier]} />
          </mesh>
        </group>
      ))}
      {/* Vertical Rope Spacer Straps */}
      {[-ropeRadius, ropeRadius].map((z, i) => (
        <mesh key={`ns-${i}`} position={[0, 0.16, z]}>
          <boxGeometry args={[0.035, 0.66, 0.035]} />
          <meshBasicMaterial color="#ffd98a" />
        </mesh>
      ))}
      {[-ropeRadius, ropeRadius].map((x, i) => (
        <mesh key={`ew-${i}`} position={[x, 0.16, 0]}>
          <boxGeometry args={[0.035, 0.66, 0.035]} />
          <meshBasicMaterial color="#ffd98a" />
        </mesh>
      ))}

      {/* --- 5. 3D MEDIAPIPE KINEMATIC BOXER POSE SILHOUETTE & GLOVES IN CENTER --- */}
      <group ref={fighterRef} position={[0, -0.35, 0]}>
        {/* Head */}
        <mesh position={[0, 0.78, 0]}>
          <sphereGeometry args={[0.095, 16, 16]} />
          <meshStandardMaterial color="#ffd98a" metalness={0.6} roughness={0.2} emissive="#ffc46b" emissiveIntensity={0.35} />
        </mesh>
        {/* Athletic Torso */}
        <mesh position={[0, 0.52, 0]}>
          <cylinderGeometry args={[0.13, 0.09, 0.34, 14]} />
          <meshStandardMaterial color="#2a1348" metalness={0.7} roughness={0.25} emissive="#ff5fa8" emissiveIntensity={0.2} />
        </mesh>
        {/* Left Lead Jab Arm + Sculpted 3D Boxing Glove */}
        <group position={[-0.15, 0.64, 0.05]}>
          <mesh position={[-0.1, -0.02, 0.14]} rotation={[1.1, 0, 0.4]}>
            <cylinderGeometry args={[0.032, 0.028, 0.28, 10]} />
            <meshBasicMaterial color="#45e3d0" />
          </mesh>
          <mesh position={[-0.16, 0.02, 0.28]} scale={[1, 0.85, 1.25]}>
            <sphereGeometry args={[0.085, 16, 16]} />
            <meshStandardMaterial color="#ff5fa8" metalness={0.5} roughness={0.2} emissive="#ff5fa8" emissiveIntensity={0.5} />
          </mesh>
        </group>
        {/* Right Guard Arm + Sculpted 3D Boxing Glove */}
        <group position={[0.15, 0.64, 0]}>
          <mesh position={[0.06, -0.06, 0.08]} rotation={[0.6, 0, -0.3]}>
            <cylinderGeometry args={[0.032, 0.028, 0.24, 10]} />
            <meshBasicMaterial color="#45e3d0" />
          </mesh>
          <mesh position={[0.08, 0.06, 0.16]} scale={[1, 0.85, 1.2]}>
            <sphereGeometry args={[0.082, 16, 16]} />
            <meshStandardMaterial color="#ffc46b" metalness={0.5} roughness={0.2} emissive="#ffc46b" emissiveIntensity={0.5} />
          </mesh>
        </group>
        {/* Boxing Shorts & Stance Legs */}
        <mesh position={[-0.07, 0.2, 0.06]} rotation={[-0.2, 0, 0.12]}>
          <cylinderGeometry args={[0.04, 0.03, 0.34, 10]} />
          <meshBasicMaterial color="#45e3d0" />
        </mesh>
        <mesh position={[0.07, 0.2, -0.06]} rotation={[0.2, 0, -0.12]}>
          <cylinderGeometry args={[0.04, 0.03, 0.34, 10]} />
          <meshBasicMaterial color="#45e3d0" />
        </mesh>
        {/* Kinematic Punch Trajectory Arc */}
        <mesh position={[0, 0.64, 0.08]} rotation={[Math.PI / 2.2, 0.2, 0]}>
          <torusGeometry args={[0.38, 0.012, 8, 32, Math.PI * 0.85]} />
          <meshBasicMaterial color="#45e3d0" />
        </mesh>
      </group>
    </group>
  );
};

/* ============================================================================
 * 02. UFC-GRAPHRAG: Championship Octagon Cage + 3D Connected Knowledge Graph
 * ============================================================================ */
const UfcOctagonModel: React.FC = () => {
  const c = useHolo();
  const groupRef = useRef<THREE.Group>(null);
  const graphRef = useRef<THREE.Group>(null);

  const posts = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * Math.PI * 2) / 8 + Math.PI / 8;
        const radius = 1.32;
        return { x: radius * Math.cos(angle), z: radius * Math.sin(angle), angle };
      }),
    [],
  );

  // Knowledge Graph Nodes & Connecting 3D Cylinder Edges
  const { nodes, edges } = useMemo(() => {
    const pts: Array<{ pos: [number, number, number]; color: string; size: number }> = [
      { pos: [0, 0.16, 0], color: '#ffc46b', size: 0.13 }, // Central Fighter Entity Hub
      { pos: [0.52, 0.42, 0.18], color: '#ff5fa8', size: 0.085 },
      { pos: [-0.48, 0.38, -0.22], color: '#45e3d0', size: 0.085 },
      { pos: [0.36, -0.14, -0.45], color: '#ff5fa8', size: 0.08 },
      { pos: [-0.42, -0.12, 0.42], color: '#ffc46b', size: 0.08 },
      { pos: [0.05, 0.56, -0.35], color: '#45e3d0', size: 0.075 },
      { pos: [-0.12, -0.22, -0.48], color: '#9d6bff', size: 0.075 },
      { pos: [0.46, 0.08, 0.42], color: '#45e3d0', size: 0.08 },
    ];
    const pairs: Array<[number, number]> = [
      [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7],
      [1, 5], [1, 7], [2, 5], [2, 4], [3, 6], [4, 7],
    ];
    const edgeData = pairs.map(([a, b]) => {
      const va = new THREE.Vector3(...pts[a].pos);
      const vb = new THREE.Vector3(...pts[b].pos);
      const mid = va.clone().add(vb).multiplyScalar(0.5);
      const len = va.distanceTo(vb);
      const dir = vb.clone().sub(va).normalize();
      const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
      return { mid, len, quat };
    });
    return { nodes: pts, edges: edgeData };
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.36;
    if (graphRef.current) {
      graphRef.current.rotation.y -= delta * 0.55;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.05, 0]}>
      {/* --- 1. TIERED OCTAGON STADIUM DECK & WALKWAY APRON --- */}
      <mesh position={[0, -0.56, 0]} rotation={[0, Math.PI / 8, 0]}>
        <cylinderGeometry args={[1.48, 1.58, 0.24, 8]} />
        <meshStandardMaterial color="#160829" metalness={0.78} roughness={0.22} />
      </mesh>
      {/* Raised Octagon Fighting Canvas */}
      <mesh position={[0, -0.43, 0]} rotation={[0, Math.PI / 8, 0]}>
        <cylinderGeometry args={[1.34, 1.38, 0.06, 8]} />
        <meshStandardMaterial color="#24113e" metalness={0.4} roughness={0.35} />
      </mesh>
      {/* Neon Octagon Perimeter & Center Fighting Octagon Line */}
      <mesh position={[0, -0.395, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 8]}>
        <ringGeometry args={[1.22, 1.3, 8]} />
        <meshBasicMaterial color={c.main} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -0.394, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 8]}>
        <ringGeometry args={[0.52, 0.58, 8]} />
        <meshBasicMaterial color="#ffc46b" side={THREE.DoubleSide} />
      </mesh>

      {/* --- 2. 8 SCULPTED PADDED OCTAGON CORNER BUMPERS & CAGE PANELS --- */}
      {posts.map(({ x, z, angle }, i) => (
        <group key={i} position={[x, 0.08, z]} rotation={[0, -angle, 0]}>
          {/* Heavy Padded Corner Bumper Column */}
          <mesh>
            <boxGeometry args={[0.14, 1.02, 0.16]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#1b0b30' : '#2a1248'}
              metalness={0.65}
              roughness={0.25}
            />
          </mesh>
          {/* Neon Vertical Accent Strip on Each Pillar */}
          <mesh position={[-0.075, 0, 0]}>
            <boxGeometry args={[0.02, 0.96, 0.05]} />
            <meshBasicMaterial color={i % 2 === 0 ? '#ff5fa8' : '#ffc46b'} />
          </mesh>
          {/* Gold Championship Pillar Cap */}
          <mesh position={[0, 0.54, 0]}>
            <boxGeometry args={[0.16, 0.06, 0.18]} />
            <meshBasicMaterial color="#ffc46b" />
          </mesh>
        </group>
      ))}

      {/* Top Padded Octagon Rail Ring */}
      <mesh position={[0, 0.56, 0]} rotation={[0, Math.PI / 8, 0]}>
        <cylinderGeometry args={[1.34, 1.34, 0.09, 8, 1, true]} />
        <meshStandardMaterial color="#1a0b2e" metalness={0.7} roughness={0.25} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.61, 0]} rotation={[0, Math.PI / 8, 0]}>
        <cylinderGeometry args={[1.35, 1.35, 0.025, 8, 1, true]} />
        <meshBasicMaterial color="#ffc46b" side={THREE.DoubleSide} />
      </mesh>

      {/* Translucent Chain-Link Mesh Fence */}
      <mesh position={[0, 0.06, 0]} rotation={[0, Math.PI / 8, 0]}>
        <cylinderGeometry args={[1.31, 1.31, 0.92, 8, 6, true]} />
        <meshBasicMaterial color={c.soft} wireframe transparent opacity={0.38} />
      </mesh>

      {/* --- 3. 3D MULTI-HOP NEO4J KNOWLEDGE GRAPH CONSTELLATION --- */}
      <group ref={graphRef} position={[0, 0.08, 0]}>
        {/* 3D Connecting Graph Edges */}
        {edges.map((e, idx) => (
          <mesh key={idx} position={e.mid} quaternion={e.quat}>
            <cylinderGeometry args={[0.014, 0.014, e.len, 8]} />
            <meshBasicMaterial color={idx % 2 === 0 ? '#ff5fa8' : '#45e3d0'} transparent opacity={0.8} />
          </mesh>
        ))}
        {/* 3D Glowing Entity Nodes */}
        {nodes.map((n, idx) => (
          <group key={idx} position={n.pos}>
            <mesh>
              <sphereGeometry args={[n.size, 18, 18]} />
              <meshStandardMaterial
                color={n.color}
                metalness={0.5}
                roughness={0.15}
                emissive={n.color}
                emissiveIntensity={0.6}
              />
            </mesh>
            {idx === 0 && (
              <mesh rotation={[Math.PI / 3, 0.4, 0]}>
                <torusGeometry args={[0.22, 0.012, 10, 32]} />
                <meshBasicMaterial color="#ffc46b" />
              </mesh>
            )}
          </group>
        ))}
      </group>
    </group>
  );
};

/* ============================================================================
 * 03. NEWS SUMMARIZATION: Sculpted Curved Open Broadsheet Folio & Optical Scanner
 * ============================================================================ */
const NewspaperModel: React.FC = () => {
  const c = useHolo();
  const groupRef = useRef<THREE.Group>(null);
  const scanRef = useRef<THREE.Group>(null);

  // Sculpted curved open book/newspaper page profile using ExtrudeGeometry
  const { leftPageGeo, rightPageGeo } = useMemo(() => {
    // Cross-section in XZ plane, extruded along Y height
    const lShape = new THREE.Shape();
    lShape.moveTo(0, 0);
    lShape.bezierCurveTo(-0.22, 0.18, -0.58, 0.16, -0.96, 0.04);
    lShape.lineTo(-0.96, -0.03);
    lShape.bezierCurveTo(-0.58, 0.09, -0.22, 0.11, 0, -0.06);
    lShape.closePath();

    const rShape = new THREE.Shape();
    rShape.moveTo(0, 0);
    rShape.bezierCurveTo(0.22, 0.18, 0.58, 0.16, 0.96, 0.04);
    rShape.lineTo(0.96, -0.03);
    rShape.bezierCurveTo(0.58, 0.09, 0.22, 0.11, 0, -0.06);
    rShape.closePath();

    const opts = {
      depth: 1.42,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.015,
      bevelThickness: 0.015,
    };
    const lGeo = new THREE.ExtrudeGeometry(lShape, opts);
    lGeo.rotateX(Math.PI / 2);
    lGeo.translate(0, 0.71, 0);

    const rGeo = new THREE.ExtrudeGeometry(rShape, opts);
    rGeo.rotateX(Math.PI / 2);
    rGeo.translate(0, 0.71, 0);

    return { leftPageGeo: lGeo, rightPageGeo: rGeo };
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
      groupRef.current.rotation.x = Math.sin(t * 1.4) * 0.08 + 0.12;
    }
    if (scanRef.current) {
      scanRef.current.position.y = Math.sin(t * 2.4) * 0.58;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.02, 0]}>
      {/* Hardcover Folio Outer Binding Backing */}
      <mesh position={[-0.49, 0, -0.04]} rotation={[0, 0.08, 0]}>
        <boxGeometry args={[0.98, 1.5, 0.04]} />
        <meshStandardMaterial color="#160828" metalness={0.7} roughness={0.25} />
      </mesh>
      <mesh position={[0.49, 0, -0.04]} rotation={[0, -0.08, 0]}>
        <boxGeometry args={[0.98, 1.5, 0.04]} />
        <meshStandardMaterial color="#160828" metalness={0.7} roughness={0.25} />
      </mesh>

      {/* Center Gold Folio Spine & Binding Rings */}
      <mesh position={[0, 0, -0.03]}>
        <cylinderGeometry args={[0.055, 0.055, 1.54, 16]} />
        <meshStandardMaterial color="#ffc46b" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Sculpted Curved Left & Right Broadsheet Pages */}
      <mesh geometry={leftPageGeo}>
        <meshStandardMaterial color="#271242" metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh geometry={rightPageGeo}>
        <meshStandardMaterial color="#271242" metalness={0.4} roughness={0.3} />
      </mesh>

      {/* --- LEFT PAGE 3D EDITORIAL LAYOUT (Masthead, Photo Relief, Article Columns) --- */}
      <group position={[-0.48, 0, 0.14]} rotation={[0, 0.1, 0]}>
        {/* Breaking News Masthead Banner */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.76, 0.13, 0.02]} />
          <meshBasicMaterial color="#ff5fa8" />
        </mesh>
        {/* Framed 3D Mini-Skyline Feature Photo Relief */}
        <group position={[-0.18, 0.18, 0]}>
          <mesh>
            <boxGeometry args={[0.4, 0.34, 0.018]} />
            <meshStandardMaterial color="#140724" metalness={0.5} roughness={0.3} />
          </mesh>
          {/* Mini 3D Bars / Buildings Inside Photo */}
          {[-0.1, 0, 0.1].map((bx, bIdx) => (
            <mesh key={bIdx} position={[bx, -0.04 + bIdx * 0.03, 0.015]}>
              <boxGeometry args={[0.065, 0.14 + bIdx * 0.05, 0.02]} />
              <meshBasicMaterial color={bIdx === 1 ? '#ffc46b' : '#45e3d0'} />
            </mesh>
          ))}
        </group>
        {/* Right-side Column Lines next to Photo */}
        {[0.3, 0.2, 0.1, 0.0].map((cy, idx) => (
          <mesh key={idx} position={[0.2, cy, 0]}>
            <boxGeometry args={[0.28, 0.04, 0.015]} />
            <meshBasicMaterial color={idx === 0 ? '#ffc46b' : '#dfd3ea'} />
          </mesh>
        ))}
        {/* Lower Full-Width Entailment Verified Paragraph Lines */}
        {[-0.14, -0.26, -0.38, -0.5].map((ly, idx) => (
          <mesh key={idx} position={[0, ly, 0]}>
            <boxGeometry args={[0.74, 0.045, 0.015]} />
            <meshBasicMaterial color={idx === 1 ? '#45e3d0' : '#b9a8cc'} />
          </mesh>
        ))}
      </group>

      {/* --- RIGHT PAGE 3D AI SUMMARY & NLI VERIFICATION LAYOUT --- */}
      <group position={[0.48, 0, 0.14]} rotation={[0, -0.1, 0]}>
        {/* IndoT5 Summary Header */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.76, 0.11, 0.02]} />
          <meshBasicMaterial color="#45e3d0" />
        </mesh>
        {/* Summary Bullet Cards */}
        {[0.26, 0.02, -0.22].map((sy, idx) => (
          <group key={idx} position={[0, sy, 0]}>
            <mesh>
              <boxGeometry args={[0.74, 0.16, 0.018]} />
              <meshStandardMaterial color="#1a0b2e" metalness={0.5} roughness={0.3} />
            </mesh>
            <mesh position={[-0.29, 0, 0.014]}>
              <sphereGeometry args={[0.035, 12, 12]} />
              <meshBasicMaterial color={idx === 0 ? '#ffc46b' : idx === 1 ? '#ff5fa8' : '#45e3d0'} />
            </mesh>
            <mesh position={[0.04, 0.025, 0.014]}>
              <boxGeometry args={[0.52, 0.035, 0.01]} />
              <meshBasicMaterial color="#fff6f2" />
            </mesh>
            <mesh position={[-0.02, -0.03, 0.014]}>
              <boxGeometry args={[0.4, 0.028, 0.01]} />
              <meshBasicMaterial color="#ffc46b" />
            </mesh>
          </group>
        ))}
        {/* ROUGE-L Metric Footer Bar */}
        <mesh position={[0, -0.48, 0]}>
          <boxGeometry args={[0.74, 0.08, 0.02]} />
          <meshBasicMaterial color="#ffc46b" />
        </mesh>
      </group>

      {/* --- DUAL-RAIL OPTICAL AI LASER SCANNER --- */}
      <group ref={scanRef} position={[0, 0, 0.24]}>
        <mesh>
          <boxGeometry args={[2.12, 0.04, 0.03]} />
          <meshBasicMaterial color={c.main} />
        </mesh>
        {/* Left & Right Laser Emitter Pods */}
        {[-1.06, 1.06].map((lx, i) => (
          <mesh key={i} position={[lx, 0, -0.04]}>
            <boxGeometry args={[0.08, 0.12, 0.16]} />
            <meshStandardMaterial color="#ffc46b" metalness={0.9} roughness={0.15} />
          </mesh>
        ))}
        {/* Translucent Laser Scan Sheet */}
        <mesh position={[0, 0, -0.08]}>
          <boxGeometry args={[2.04, 0.16, 0.12]} />
          <meshBasicMaterial color={c.main} transparent opacity={0.18} />
        </mesh>
      </group>
    </group>
  );
};

/* ============================================================================
 * 04. FASHION OPS: Realistic Sculpted 3D Tailored Vice Jacket & Luxury Hanger
 * ============================================================================ */
const FashionHangerModel: React.FC = () => {
  const c = useHolo();
  const groupRef = useRef<THREE.Group>(null);
  const scanRingRef = useRef<THREE.Mesh>(null);

  // Sculpted tailored jacket left & right front/back panels + lapels using ExtrudeGeometry
  const { jacketGeo, lapelGeo, hangerBarGeo, shirtGeo } = useMemo(() => {
    const bodyShape = new THREE.Shape();
    bodyShape.moveTo(-0.24, 0.56);
    bodyShape.lineTo(-0.72, 0.44);
    bodyShape.quadraticCurveTo(-0.66, 0.08, -0.56, -0.18);
    bodyShape.quadraticCurveTo(-0.58, -0.45, -0.62, -0.66);
    bodyShape.lineTo(-0.04, -0.66);
    bodyShape.lineTo(-0.03, 0.06);
    bodyShape.lineTo(-0.24, 0.56);

    const rightShape = new THREE.Shape();
    rightShape.moveTo(0.24, 0.56);
    rightShape.lineTo(0.03, 0.06);
    rightShape.lineTo(0.04, -0.66);
    rightShape.lineTo(0.62, -0.66);
    rightShape.quadraticCurveTo(0.58, -0.45, 0.56, -0.18);
    rightShape.quadraticCurveTo(0.66, 0.08, 0.72, 0.44);
    rightShape.lineTo(0.24, 0.56);

    const jGeo = new THREE.ExtrudeGeometry([bodyShape, rightShape], {
      depth: 0.26,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 2,
      bevelSize: 0.065,
      bevelThickness: 0.085,
    });
    jGeo.translate(0, 0, -0.13);

    const lShape = new THREE.Shape();
    lShape.moveTo(-0.03, 0.06);
    lShape.lineTo(-0.24, 0.54);
    lShape.lineTo(-0.37, 0.45);
    lShape.lineTo(-0.27, 0.28);
    lShape.lineTo(-0.34, 0.22);
    lShape.lineTo(-0.03, 0.0);
    lShape.closePath();

    const lpGeo = new THREE.ExtrudeGeometry(lShape, {
      depth: 0.025,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.012,
      bevelThickness: 0.015,
    });

    const hShape = new THREE.Shape();
    hShape.moveTo(0, 0.76);
    hShape.quadraticCurveTo(-0.38, 0.72, -0.76, 0.47);
    hShape.quadraticCurveTo(-0.8, 0.43, -0.74, 0.4);
    hShape.quadraticCurveTo(-0.36, 0.61, 0, 0.64);
    hShape.quadraticCurveTo(0.36, 0.61, 0.74, 0.4);
    hShape.quadraticCurveTo(0.8, 0.43, 0.76, 0.47);
    hShape.quadraticCurveTo(0.38, 0.72, 0, 0.76);

    const hGeo = new THREE.ExtrudeGeometry(hShape, {
      depth: 0.05,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.015,
      bevelThickness: 0.02,
    });
    hGeo.translate(0, 0, -0.025);

    const sShape = new THREE.Shape();
    sShape.moveTo(-0.26, 0.55);
    sShape.lineTo(0.26, 0.55);
    sShape.lineTo(0.2, -0.62);
    sShape.lineTo(-0.2, -0.62);
    sShape.closePath();
    const shGeo = new THREE.ExtrudeGeometry(sShape, {
      depth: 0.18,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.02,
      bevelThickness: 0.02,
    });
    shGeo.translate(0, 0, -0.09);

    return { jacketGeo: jGeo, lapelGeo: lpGeo, hangerBarGeo: hGeo, shirtGeo: shGeo };
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.45;
    }
    if (scanRingRef.current) {
      scanRingRef.current.position.y = Math.sin(state.clock.elapsedTime * 2.2) * 0.65 - 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.04, 0]}>
      {/* 1. LUXURY CONTOURED COAT HANGER */}
      <mesh position={[0.02, 0.96, 0]} rotation={[0, 0, -0.15]}>
        <torusGeometry args={[0.14, 0.026, 14, 32, Math.PI * 1.45]} />
        <meshStandardMaterial color="#ffd98a" metalness={0.95} roughness={0.1} emissive="#ffc46b" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0, 0.78, 0]}>
        <cylinderGeometry args={[0.045, 0.055, 0.1, 16]} />
        <meshStandardMaterial color="#ffd98a" metalness={0.9} roughness={0.15} />
      </mesh>
      <mesh geometry={hangerBarGeo}>
        <meshStandardMaterial color="#ffc46b" metalness={0.75} roughness={0.22} />
      </mesh>

      {/* 2. INNER VICE TROPICAL BUTTON-UP SHIRT & BACK PANEL */}
      <mesh geometry={shirtGeo} position={[0, 0, -0.01]}>
        <meshStandardMaterial color="#180a2c" roughness={0.45} metalness={0.25} />
      </mesh>
      {[-0.12, -0.04, 0.04, 0.12].map((x, idx) => (
        <mesh key={idx} position={[x, 0.22, 0.11]}>
          <boxGeometry args={[0.022, 0.56, 0.015]} />
          <meshBasicMaterial color={idx % 2 === 0 ? '#ff5fa8' : '#45e3d0'} />
        </mesh>
      ))}
      <mesh position={[0, 0.56, -0.04]} rotation={[0.15, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.27, 0.16, 24, 1, true, Math.PI * 0.65, Math.PI * 1.7]} />
        <meshStandardMaterial color="#2a1249" roughness={0.35} metalness={0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* 3. SCULPTED TAILORED JACKET TORSO */}
      <mesh geometry={jacketGeo}>
        <meshStandardMaterial color="#231040" roughness={0.32} metalness={0.45} />
      </mesh>
      <mesh geometry={lapelGeo} position={[0, 0, 0.2]}>
        <meshStandardMaterial color="#2f1654" roughness={0.28} metalness={0.5} emissive="#ff5fa8" emissiveIntensity={0.08} />
      </mesh>
      <mesh geometry={lapelGeo} position={[0, 0, 0.2]} scale={[-1, 1, 1]}>
        <meshStandardMaterial color="#2f1654" roughness={0.28} metalness={0.5} emissive="#ff5fa8" emissiveIntensity={0.08} />
      </mesh>
      <mesh position={[-0.15, 0.3, 0.235]} rotation={[0, 0, 0.41]}>
        <boxGeometry args={[0.022, 0.52, 0.015]} />
        <meshBasicMaterial color="#ff5fa8" />
      </mesh>
      <mesh position={[0.15, 0.3, 0.235]} rotation={[0, 0, -0.41]}>
        <boxGeometry args={[0.022, 0.52, 0.015]} />
        <meshBasicMaterial color="#ff5fa8" />
      </mesh>

      {/* 4. SARTORIAL DETAILS: POCKETS, GOLD BUTTONS, VARSITY HEM */}
      <group position={[0.32, 0.12, 0.22]}>
        <mesh>
          <boxGeometry args={[0.24, 0.26, 0.025]} />
          <meshStandardMaterial color="#190b2e" roughness={0.35} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0.12, 0.01]}>
          <boxGeometry args={[0.25, 0.035, 0.02]} />
          <meshBasicMaterial color="#45e3d0" />
        </mesh>
        <mesh position={[0, -0.02, 0.02]}>
          <ringGeometry args={[0.045, 0.075, 20]} />
          <meshBasicMaterial color="#ffc46b" side={THREE.DoubleSide} />
        </mesh>
      </group>

      {[-0.36, 0.36].map((px, i) => (
        <group key={i} position={[px, -0.4, 0.215]}>
          <mesh>
            <boxGeometry args={[0.3, 0.09, 0.03]} />
            <meshStandardMaterial color="#190b2e" roughness={0.35} metalness={0.5} />
          </mesh>
          <mesh position={[0, -0.04, 0.01]}>
            <boxGeometry args={[0.3, 0.02, 0.02]} />
            <meshBasicMaterial color="#ffc46b" />
          </mesh>
        </group>
      ))}

      {[-0.04, -0.22, -0.4].map((by, i) => (
        <mesh key={i} position={[0.07, by, 0.225]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.032, 0.032, 0.025, 16]} />
          <meshBasicMaterial color="#ffc46b" />
        </mesh>
      ))}

      <mesh position={[0, -0.68, 0]}>
        <boxGeometry args={[1.28, 0.12, 0.42]} />
        <meshStandardMaterial color="#160929" roughness={0.4} metalness={0.4} />
      </mesh>
      <mesh position={[0, -0.65, 0]}>
        <boxGeometry args={[1.3, 0.025, 0.44]} />
        <meshBasicMaterial color="#ff5fa8" />
      </mesh>
      <mesh position={[0, -0.7, 0]}>
        <boxGeometry args={[1.3, 0.025, 0.44]} />
        <meshBasicMaterial color="#ffc46b" />
      </mesh>

      {/* 5. ARTICULATED MULTI-SEGMENT SLEEVES, SHOULDER CAPS & CUFFS */}
      {[-1, 1].map((dir) => (
        <group key={dir} position={[dir * 0.72, 0.34, 0]}>
          <mesh scale={[0.9, 1.15, 0.85]}>
            <sphereGeometry args={[0.21, 20, 20]} />
            <meshStandardMaterial color="#231040" roughness={0.32} metalness={0.45} />
          </mesh>
          <mesh position={[-dir * 0.02, 0.04, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.19, 0.015, 10, 24]} />
            <meshBasicMaterial color="#ffc46b" />
          </mesh>

          <group rotation={[0.06, 0, -dir * 0.22]}>
            <mesh position={[dir * 0.04, -0.32, 0]} scale={[0.88, 1, 0.82]}>
              <cylinderGeometry args={[0.2, 0.175, 0.58, 20]} />
              <meshStandardMaterial color="#1f0e38" roughness={0.35} metalness={0.42} />
            </mesh>

            <group position={[dir * 0.05, -0.58, 0.02]} rotation={[0.1, 0, dir * 0.07]}>
              <mesh position={[0, -0.22, 0]} scale={[0.86, 1, 0.82]}>
                <cylinderGeometry args={[0.172, 0.148, 0.48, 20]} />
                <meshStandardMaterial color="#1f0e38" roughness={0.35} metalness={0.42} />
              </mesh>
              <mesh position={[dir * 0.14, -0.1, 0]}>
                <boxGeometry args={[0.025, 0.85, 0.04]} />
                <meshBasicMaterial color={c.main} />
              </mesh>

              <mesh position={[0, -0.47, 0]} scale={[0.86, 1, 0.82]}>
                <cylinderGeometry args={[0.152, 0.145, 0.1, 20]} />
                <meshStandardMaterial color="#140724" roughness={0.4} metalness={0.5} />
              </mesh>
              <mesh position={[0, -0.44, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[0.86, 0.82, 1]}>
                <torusGeometry args={[0.154, 0.014, 10, 24]} />
                <meshBasicMaterial color="#ff5fa8" />
              </mesh>
              <mesh position={[0, -0.49, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[0.86, 0.82, 1]}>
                <torusGeometry args={[0.148, 0.014, 10, 24]} />
                <meshBasicMaterial color="#ffc46b" />
              </mesh>
            </group>
          </group>
        </group>
      ))}

      {/* 6. LIVE RFID / SKU INVENTORY LASER SCAN RING */}
      <mesh ref={scanRingRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.18, 0.018, 12, 48]} />
        <meshBasicMaterial color={c.main} />
      </mesh>
    </group>
  );
};

/* ============================================================================
 * 05. DISCOUNT ALERT: Sculpted Double Luxury Hang-Tag, Brass Grommet & Barcode
 * ============================================================================ */
const DiscountTagModel: React.FC = () => {
  const c = useHolo();
  const groupRef = useRef<THREE.Group>(null);
  const laserRef = useRef<THREE.Mesh>(null);

  // Sculpted Chamfered Retail Hang-Tag with Punched Grommet Hole using ExtrudeGeometry
  const { tagGeo, slashGeo } = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.56, -0.82);
    shape.lineTo(0.56, -0.82);
    shape.lineTo(0.56, 0.42);
    shape.lineTo(0.26, 0.82);
    shape.lineTo(-0.26, 0.82);
    shape.lineTo(-0.56, 0.42);
    shape.closePath();

    // Punched eyelet hole at top center
    const hole = new THREE.Path();
    hole.absarc(0, 0.58, 0.1, 0, Math.PI * 2, false);
    shape.holes.push(hole);

    const tGeo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.09,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 0.035,
      bevelThickness: 0.035,
    });
    tGeo.translate(0, 0, -0.045);

    // Sculpted 3D "%" Slash Bar
    const slShape = new THREE.Shape();
    slShape.moveTo(-0.34, -0.28);
    slShape.lineTo(-0.24, -0.34);
    slShape.lineTo(0.34, 0.28);
    slShape.lineTo(0.24, 0.34);
    slShape.closePath();

    const sGeo = new THREE.ExtrudeGeometry(slShape, {
      depth: 0.04,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.012,
      bevelThickness: 0.015,
    });
    sGeo.translate(0, 0, -0.02);

    return { tagGeo: tGeo, slashGeo: sGeo };
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.44;
      groupRef.current.rotation.z = Math.sin(t * 1.6) * 0.07;
    }
    if (laserRef.current) {
      laserRef.current.position.y = -0.52 + Math.sin(t * 3.4) * 0.16;
    }
  });

  const barcodeBars = [-0.36, -0.28, -0.22, -0.14, -0.06, 0.0, 0.08, 0.15, 0.24, 0.31, 0.37];

  return (
    <group ref={groupRef} position={[0, -0.04, 0]}>
      {/* --- 1. BRAIDED GOLD CORD LOOP & METALLIC BRASS EYELET GROMMET --- */}
      <mesh position={[0, 0.88, 0]} rotation={[0.18, 0.3, 0]}>
        <torusGeometry args={[0.26, 0.026, 14, 36]} />
        <meshStandardMaterial color="#ffd98a" metalness={0.92} roughness={0.14} />
      </mesh>
      <mesh position={[0, 0.58, 0]}>
        <torusGeometry args={[0.115, 0.032, 14, 32]} />
        <meshStandardMaterial color="#ffc46b" metalness={0.95} roughness={0.12} emissive="#ffc46b" emissiveIntensity={0.2} />
      </mesh>

      {/* --- 2. FANNED SECONDARY PROMO VOUCHER TAG BEHIND --- */}
      <group position={[0.16, -0.04, -0.14]} rotation={[0, -0.12, -0.22]} scale={0.92}>
        <mesh geometry={tagGeo}>
          <meshStandardMaterial color="#38124a" metalness={0.6} roughness={0.28} emissive="#ff5fa8" emissiveIntensity={0.15} />
        </mesh>
      </group>

      {/* --- 3. PRIMARY SCULPTED CHAMFERED VIP HANG-TAG --- */}
      <mesh geometry={tagGeo}>
        <meshStandardMaterial color="#1e0d36" metalness={0.68} roughness={0.24} />
      </mesh>

      {/* Raised Gold Perimeter Accent Frame */}
      <mesh position={[0, -0.12, 0.085]}>
        <boxGeometry args={[0.92, 0.025, 0.015]} />
        <meshBasicMaterial color="#ffc46b" />
      </mesh>
      <mesh position={[0, 0.36, 0.085]}>
        <boxGeometry args={[0.82, 0.025, 0.015]} />
        <meshBasicMaterial color="#ff5fa8" />
      </mesh>

      {/* --- 4. HIGH-RELIEF 3D "%" DISCOUNT EMBLEM ON FRONT & BACK --- */}
      {[-0.085, 0.085].map((zPos, side) => (
        <group key={side} position={[0, 0.11, zPos]}>
          <mesh geometry={slashGeo}>
            <meshStandardMaterial color="#ffc46b" metalness={0.85} roughness={0.15} emissive="#ffc46b" emissiveIntensity={0.35} />
          </mesh>
          <mesh position={[-0.2, 0.16, 0]}>
            <torusGeometry args={[0.105, 0.038, 14, 28]} />
            <meshStandardMaterial color="#ff5fa8" metalness={0.6} roughness={0.2} emissive="#ff5fa8" emissiveIntensity={0.45} />
          </mesh>
          <mesh position={[0.2, -0.16, 0]}>
            <torusGeometry args={[0.105, 0.038, 14, 28]} />
            <meshStandardMaterial color="#45e3d0" metalness={0.6} roughness={0.2} emissive="#45e3d0" emissiveIntensity={0.45} />
          </mesh>
        </group>
      ))}

      {/* --- 5. 3D RAISED SKU BARCODE LEDGER & AUDIT LASER SCANNER --- */}
      <group position={[0, -0.5, 0.085]}>
        <mesh>
          <boxGeometry args={[0.92, 0.36, 0.012]} />
          <meshStandardMaterial color="#120722" roughness={0.3} metalness={0.4} />
        </mesh>
        {barcodeBars.map((bx, i) => (
          <mesh key={i} position={[bx, 0, 0.012]}>
            <boxGeometry args={[i % 3 === 0 ? 0.04 : 0.02, 0.24, 0.015]} />
            <meshBasicMaterial color={i % 4 === 0 ? '#ffc46b' : '#fff6f2'} />
          </mesh>
        ))}
      </group>
      {/* Animated GraphQL Audit Laser Beam */}
      <mesh ref={laserRef} position={[0, -0.5, 0.12]}>
        <boxGeometry args={[1.18, 0.03, 0.03]} />
        <meshBasicMaterial color={c.main} />
      </mesh>
    </group>
  );
};

/* ============================================================================
 * 06. SHOPIFY STORE PULSE: Sculpted Tapered Shopping Cart, Packages & ECG Pulse
 * ============================================================================ */
const ShoppingCartModel: React.FC = () => {
  const c = useHolo();
  const groupRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  // Sculpted Side Basket Trapezoid Frame Profile using ExtrudeGeometry
  const sideFrameGeo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.68, 0.62); // Rear top
    s.lineTo(0.68, 0.44);  // Front nose top (tapered lower)
    s.lineTo(0.56, -0.14); // Front nose bottom
    s.lineTo(-0.58, -0.22); // Rear bottom
    s.closePath();

    const hole = new THREE.Path();
    hole.moveTo(-0.6, 0.54);
    hole.lineTo(0.59, 0.38);
    hole.lineTo(0.49, -0.07);
    hole.lineTo(-0.51, -0.14);
    hole.closePath();
    s.holes.push(hole);

    const g = new THREE.ExtrudeGeometry(s, {
      depth: 0.035,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.01,
      bevelThickness: 0.01,
    });
    g.translate(0, 0, -0.0175);
    return g;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.42;
    if (pulseRef.current) {
      const s = 1 + Math.sin(t * 3.8) * 0.12;
      pulseRef.current.scale.set(s, s, 1);
    }
  });

  const wheels: [number, number, number][] = [
    [-0.52, -0.58, 0.4],
    [0.48, -0.58, 0.36],
    [-0.52, -0.58, -0.4],
    [0.48, -0.58, -0.36],
  ];

  return (
    <group ref={groupRef} position={[0, -0.02, 0]}>
      {/* --- 1. TAPERED TUBULAR CHROME & NEON BASKET --- */}
      {[-0.44, 0.44].map((z, side) => (
        <group key={side} position={[0, 0, z]}>
          <mesh geometry={sideFrameGeo}>
            <meshStandardMaterial color="#ffd98a" metalness={0.9} roughness={0.16} />
          </mesh>
          {/* Vertical Wire Ribs along Side Basket */}
          {[-0.42, -0.2, 0.02, 0.24, 0.46].map((rx, rIdx) => (
            <mesh key={rIdx} position={[rx, 0.18 - rx * 0.06, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 0.68 - rx * 0.14, 8]} />
              <meshBasicMaterial color={c.main} />
            </mesh>
          ))}
        </group>
      ))}
      {/* Basket Bottom Deck Mesh & Front Nose Grille */}
      <mesh position={[-0.02, -0.18, 0]} rotation={[0, 0, 0.06]}>
        <boxGeometry args={[1.16, 0.04, 0.88]} />
        <meshStandardMaterial color="#210f3a" metalness={0.75} roughness={0.25} />
      </mesh>
      <mesh position={[0.62, 0.15, 0]} rotation={[0, 0, -0.18]}>
        <boxGeometry args={[0.04, 0.58, 0.88]} />
        <meshBasicMaterial color={c.main} wireframe />
      </mesh>
      <mesh position={[-0.63, 0.2, 0]} rotation={[0, 0, 0.14]}>
        <boxGeometry args={[0.04, 0.82, 0.88]} />
        <meshBasicMaterial color="#ff5fa8" wireframe />
      </mesh>

      {/* --- 2. ERGONOMIC PUSH HANDLEBAR & REAR BRACKETS --- */}
      <mesh position={[-0.86, 0.74, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.048, 0.048, 0.96, 16]} />
        <meshStandardMaterial color="#ff5fa8" metalness={0.5} roughness={0.2} emissive="#ff5fa8" emissiveIntensity={0.4} />
      </mesh>
      {[-0.44, 0.44].map((hz, i) => (
        <mesh key={i} position={[-0.76, 0.67, hz]} rotation={[0, 0, -0.55]}>
          <cylinderGeometry args={[0.025, 0.025, 0.26, 12]} />
          <meshStandardMaterial color="#ffd98a" metalness={0.9} roughness={0.15} />
        </mesh>
      ))}

      {/* --- 3. LUXURY E-COMMERCE PACKAGES, RIBBON GIFT BOX & SHOPPING BAG --- */}
      {/* Tall Vice Boutique Shopping Bag with Cord Handles */}
      <group position={[-0.24, 0.22, -0.12]} rotation={[0, 0.15, 0]}>
        <mesh>
          <boxGeometry args={[0.42, 0.66, 0.36]} />
          <meshStandardMaterial color="#ff5fa8" metalness={0.45} roughness={0.28} emissive="#ff5fa8" emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[0, 0.36, 0.1]}>
          <torusGeometry args={[0.09, 0.015, 10, 20, Math.PI]} />
          <meshBasicMaterial color="#ffd98a" />
        </mesh>
        <mesh position={[0, 0.36, -0.1]}>
          <torusGeometry args={[0.09, 0.015, 10, 20, Math.PI]} />
          <meshBasicMaterial color="#ffd98a" />
        </mesh>
      </group>
      {/* Gift Parcel Box with Gold Cross-Ribbon */}
      <group position={[0.22, 0.1, 0.12]} rotation={[0, -0.18, 0]}>
        <mesh>
          <boxGeometry args={[0.48, 0.46, 0.46]} />
          <meshStandardMaterial color="#261142" metalness={0.6} roughness={0.25} />
        </mesh>
        <mesh>
          <boxGeometry args={[0.5, 0.48, 0.08]} />
          <meshBasicMaterial color="#ffc46b" />
        </mesh>
        <mesh>
          <boxGeometry args={[0.08, 0.48, 0.5]} />
          <meshBasicMaterial color="#ffc46b" />
        </mesh>
      </group>

      {/* --- 4. S-CURVED LOWER CHASSIS & 4 CASTER WHEEL ASSEMBLIES --- */}
      {[-0.38, 0.38].map((cz, i) => (
        <mesh key={i} position={[-0.02, -0.44, cz]}>
          <boxGeometry args={[1.12, 0.045, 0.045]} />
          <meshStandardMaterial color="#ffd98a" metalness={0.85} roughness={0.2} />
        </mesh>
      ))}
      {wheels.map(([wx, wy, wz], i) => (
        <group key={i} position={[wx, wy, wz]}>
          {/* Caster Fork */}
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[0.08, 0.12, 0.08]} />
            <meshStandardMaterial color="#ffd98a" metalness={0.9} roughness={0.15} />
          </mesh>
          {/* Rubber Tire */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.105, 0.042, 14, 24]} />
            <meshStandardMaterial color="#160828" roughness={0.4} metalness={0.3} />
          </mesh>
          {/* Gold Alloy Hubcap */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.065, 0.065, 0.09, 16]} />
            <meshBasicMaterial color="#ffc46b" />
          </mesh>
        </group>
      ))}

      {/* --- 5. LIVE WEBHOOK TELEMETRY PULSE HALO --- */}
      <mesh ref={pulseRef} position={[0, 0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.08, 0.018, 12, 48]} />
        <meshBasicMaterial color={c.main} />
      </mesh>
    </group>
  );
};

/* ============================================================================
 * 07. INDOBERTTWEET: Sculpted Rounded Chat Bubble + Heraldic Armor Shield Crest
 * ============================================================================ */
const ChatShieldModel: React.FC = () => {
  const c = useHolo();
  const groupRef = useRef<THREE.Group>(null);
  const shieldRef = useRef<THREE.Group>(null);

  // Sculpted Rounded Chat Bubble + Curved Heraldic Shield using ExtrudeGeometry
  const { bubbleGeo, shieldGeo, checkGeo } = useMemo(() => {
    // 1. Rounded Speech Bubble with Bottom-Left Tail
    const b = new THREE.Shape();
    const w = 0.74;
    const h = 0.48;
    const r = 0.16;
    b.moveTo(-w + r, h);
    b.lineTo(w - r, h);
    b.quadraticCurveTo(w, h, w, h - r);
    b.lineTo(w, -h + r);
    b.quadraticCurveTo(w, -h, w - r, -h);
    b.lineTo(-0.18, -h);
    b.lineTo(-0.52, -h - 0.28); // Speech bubble tail tip
    b.lineTo(-0.42, -h);
    b.lineTo(-w + r, -h);
    b.quadraticCurveTo(-w, -h, -w, -h + r);
    b.lineTo(-w, h - r);
    b.quadraticCurveTo(-w, h, -w + r, h);

    const bGeo = new THREE.ExtrudeGeometry(b, {
      depth: 0.16,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 0.035,
      bevelThickness: 0.04,
    });
    bGeo.translate(0, 0.15, -0.14);

    // 2. Heraldic Cyber-Security Shield Crest
    const sh = new THREE.Shape();
    sh.moveTo(0, 0.52);
    sh.quadraticCurveTo(0.24, 0.46, 0.44, 0.44);
    sh.quadraticCurveTo(0.46, 0.02, 0.28, -0.26);
    sh.quadraticCurveTo(0.14, -0.44, 0, -0.54);
    sh.quadraticCurveTo(-0.14, -0.44, -0.28, -0.26);
    sh.quadraticCurveTo(-0.46, 0.02, -0.44, 0.44);
    sh.quadraticCurveTo(-0.24, 0.46, 0, 0.52);

    const sGeo = new THREE.ExtrudeGeometry(sh, {
      depth: 0.1,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 0.03,
      bevelThickness: 0.035,
    });
    sGeo.translate(0, 0, -0.05);

    // 3. 3D Verification Checkmark inside Shield
    const ck = new THREE.Shape();
    ck.moveTo(-0.18, -0.02);
    ck.lineTo(-0.05, -0.16);
    ck.lineTo(0.22, 0.14);
    ck.lineTo(0.15, 0.21);
    ck.lineTo(-0.05, -0.01);
    ck.lineTo(-0.11, 0.05);
    ck.closePath();

    const cGeo = new THREE.ExtrudeGeometry(ck, {
      depth: 0.04,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.01,
      bevelThickness: 0.01,
    });

    return { bubbleGeo: bGeo, shieldGeo: sGeo, checkGeo: cGeo };
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.42;
    if (shieldRef.current) {
      shieldRef.current.position.y = -0.04 + Math.sin(t * 2.4) * 0.06;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.02, 0]}>
      {/* --- 1. SCULPTED ROUNDED SPEECH BUBBLE CONSOLE --- */}
      <mesh geometry={bubbleGeo}>
        <meshStandardMaterial color="#1f0d38" metalness={0.68} roughness={0.22} />
      </mesh>
      {/* Avatar Badge & Message Lines on Speech Bubble Face */}
      <group position={[0, 0.15, 0.075]}>
        <mesh position={[-0.46, 0.2, 0]}>
          <circleGeometry args={[0.11, 24]} />
          <meshBasicMaterial color="#ff5fa8" />
        </mesh>
        <mesh position={[0.04, 0.25, 0]}>
          <boxGeometry args={[0.64, 0.065, 0.02]} />
          <meshBasicMaterial color="#ffc46b" />
        </mesh>
        <mesh position={[-0.06, 0.12, 0]}>
          <boxGeometry args={[0.44, 0.045, 0.02]} />
          <meshBasicMaterial color="#45e3d0" />
        </mesh>
        <mesh position={[-0.14, -0.06, 0]}>
          <boxGeometry args={[0.76, 0.05, 0.02]} />
          <meshBasicMaterial color="#dfd3ea" />
        </mesh>
        <mesh position={[-0.24, -0.19, 0]}>
          <boxGeometry args={[0.56, 0.05, 0.02]} />
          <meshBasicMaterial color="#ff5fa8" />
        </mesh>
      </group>

      {/* --- 2. SCULPTED HERALDIC MODERATION SHIELD & 3D CHECKMARK --- */}
      <group ref={shieldRef} position={[0.38, -0.04, 0.24]}>
        {/* Outer Gold Shield Armor Plate */}
        <mesh geometry={shieldGeo} scale={1.08}>
          <meshStandardMaterial color="#ffc46b" metalness={0.92} roughness={0.14} />
        </mesh>
        {/* Inner Enamel Shield Face */}
        <mesh geometry={shieldGeo} position={[0, 0, 0.02]} scale={0.93}>
          <meshStandardMaterial color="#150726" metalness={0.7} roughness={0.22} />
        </mesh>
        {/* Glowing 3D Verified Checkmark Emblem */}
        <mesh geometry={checkGeo} position={[0, 0, 0.08]}>
          <meshStandardMaterial color={c.main} metalness={0.5} roughness={0.15} emissive={c.main} emissiveIntensity={0.55} />
        </mesh>
      </group>
    </group>
  );
};

/* ============================================================================
 * 08. EDGE VISION AI: Anatomically Lathed 3D Apple + 8-Corner AI Bounding HUD
 * ============================================================================ */
const VisionAppleModel: React.FC = () => {
  const c = useHolo();
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const boxRef = useRef<THREE.Group>(null);

  // Anatomically Realistic Apple Profile via LatheGeometry + Sculpted Leaf via ExtrudeGeometry
  const { appleGeo, leafGeo } = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    const steps = 28;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * Math.PI; // 0 (bottom dimple) to PI (top stem dimple)
      const sinT = Math.sin(t);
      const cosT = Math.cos(t);
      // Organic apple contour: broader upper shoulder, tapered bottom, indented top & bottom dimples
      const r = 0.58 * sinT * (0.94 - 0.16 * cosT) + 0.03 * Math.sin(3 * t);
      const y = -0.56 * cosT - 0.12 * Math.pow(sinT, 0.5) * cosT;
      pts.push(new THREE.Vector2(Math.max(0.001, r), y));
    }
    const aGeo = new THREE.LatheGeometry(pts, 36);
    aGeo.computeVertexNormals();

    // Sculpted Curved Leaf
    const lf = new THREE.Shape();
    lf.moveTo(0, 0);
    lf.quadraticCurveTo(0.18, 0.16, 0.42, 0.06);
    lf.quadraticCurveTo(0.22, -0.12, 0, 0);
    const lGeo = new THREE.ExtrudeGeometry(lf, {
      depth: 0.02,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.008,
      bevelThickness: 0.008,
    });

    return { appleGeo: aGeo, leafGeo: lGeo };
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.42;
    if (ringRef.current) {
      ringRef.current.rotation.x = t * 1.1;
      ringRef.current.rotation.y = t * 0.7;
    }
    if (boxRef.current) {
      const s = 1 + Math.sin(t * 2.8) * 0.035;
      boxRef.current.scale.set(s, s, s);
    }
  });

  // 8 Corners of the 3D Object Detection Bounding Volume
  const corners: [number, number, number][] = [
    [-1, -1, -1], [1, -1, -1], [-1, 1, -1], [1, 1, -1],
    [-1, -1, 1], [1, -1, 1], [-1, 1, 1], [1, 1, 1],
  ];
  const bSize = 0.84;
  const armLen = 0.24;
  const armThick = 0.028;

  return (
    <group ref={groupRef} position={[0, -0.02, 0]}>
      {/* --- 1. ANATOMICALLY LATHED 3D GLOSSY APPLE, STEM & SCULPTED LEAF --- */}
      <mesh geometry={appleGeo} position={[0, -0.04, 0]}>
        <meshStandardMaterial
          color="#ff4d94"
          metalness={0.55}
          roughness={0.18}
          emissive="#ff5fa8"
          emissiveIntensity={0.22}
        />
      </mesh>
      {/* Curved Woody Gold Stem */}
      <mesh position={[0.02, 0.56, 0]} rotation={[0, 0, -0.22]}>
        <cylinderGeometry args={[0.024, 0.036, 0.28, 12]} />
        <meshStandardMaterial color="#ffc46b" metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Sculpted Tropical Teal Leaf */}
      <mesh geometry={leafGeo} position={[0.03, 0.58, -0.01]} rotation={[0.35, 0.2, 0.15]}>
        <meshStandardMaterial
          color="#45e3d0"
          metalness={0.5}
          roughness={0.22}
          emissive="#45e3d0"
          emissiveIntensity={0.35}
        />
      </mesh>

      {/* --- 2. ORBITING TFLITE QUANTIZATION GYRO RING --- */}
      <mesh ref={ringRef}>
        <torusGeometry args={[0.98, 0.018, 12, 48]} />
        <meshBasicMaterial color="#ffc46b" />
      </mesh>

      {/* --- 3. 8-CORNER 3D YOLO / MOBILENETV2 BOUNDING BOX L-BRACKETS --- */}
      <group ref={boxRef}>
        {corners.map(([cx, cy, cz], idx) => (
          <group key={idx} position={[cx * bSize, cy * bSize, cz * bSize]}>
            <mesh position={[-cx * (armLen / 2), 0, 0]}>
              <boxGeometry args={[armLen, armThick, armThick]} />
              <meshBasicMaterial color={c.main} />
            </mesh>
            <mesh position={[0, -cy * (armLen / 2), 0]}>
              <boxGeometry args={[armThick, armLen, armThick]} />
              <meshBasicMaterial color={c.main} />
            </mesh>
            <mesh position={[0, 0, -cz * (armLen / 2)]}>
              <boxGeometry args={[armThick, armThick, armLen]} />
              <meshBasicMaterial color={c.main} />
            </mesh>
          </group>
        ))}
        {/* Top Detection Confidence Badge Bar (96.8% INT8) */}
        <mesh position={[-0.36, bSize + 0.08, bSize]}>
          <boxGeometry args={[0.56, 0.11, 0.025]} />
          <meshBasicMaterial color="#45e3d0" />
        </mesh>
      </group>
    </group>
  );
};

export const HoloModel: React.FC<{ shape: Project['wireframeShape'] }> = ({ shape }) => {
  switch (shape) {
    case 'boxing':
      return <BoxingModel />;
    case 'ufc-octagon':
      return <UfcOctagonModel />;
    case 'newspaper':
      return <NewspaperModel />;
    case 'fashion-hanger':
      return <FashionHangerModel />;
    case 'discount-tag':
      return <DiscountTagModel />;
    case 'shopping-cart':
      return <ShoppingCartModel />;
    case 'chat-shield':
      return <ChatShieldModel />;
    case 'vision-apple':
      return <VisionAppleModel />;
    default:
      return null;
  }
};
