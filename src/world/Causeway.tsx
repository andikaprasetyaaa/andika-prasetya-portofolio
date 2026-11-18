import { useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mulberry32 } from '../lib/math';
import { worldUniforms } from './glsl';
import { CAUSEWAY_Z, causewayY } from './layout';
import { NEON, createLightPoints, createPropMaterial, type LightSpec } from './materials';

const X_MIN = -624;
const X_MAX = 624;
const SEG = 12;
const SPAN = X_MAX - X_MIN;

interface Car {
  x0: number;
  dir: 1 | -1;
  speed: number;
}

/** A low road bridge in front of the skyline, with traffic streaming both ways. */
export function Causeway() {
  const { deck, pillars, glowPink, glowTeal, lamps, traffic, cars } = useMemo(() => {
    const rnd = mulberry32(8811);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const s = new THREE.Vector3();
    const p = new THREE.Vector3();
    const zAxis = new THREE.Vector3(0, 0, 1);

    const segCount = Math.round(SPAN / SEG);
    const box = new THREE.BoxGeometry(1, 1, 1);

    const deckMesh = new THREE.InstancedMesh(box, createPropMaterial({ color: 0x5a4660 }), segCount);
    const pinkIdx: number[] = [];
    const tealIdx: number[] = [];
    const mats: THREE.Matrix4[] = [];
    for (let i = 0; i < segCount; i++) {
      const x = X_MIN + SEG * (i + 0.5);
      const y = causewayY(x);
      const slope = (causewayY(x + SEG / 2) - causewayY(x - SEG / 2)) / SEG;
      q.setFromAxisAngle(zAxis, Math.atan(slope));
      p.set(x, y - 0.4, CAUSEWAY_Z);
      s.set(SEG + 0.5, 0.8, 5.4);
      m.compose(p, q, s);
      deckMesh.setMatrixAt(i, m);

      // light strip under the camera-side edge
      const g = new THREE.Matrix4();
      p.set(x, y - 0.95, CAUSEWAY_Z + 2.65);
      s.set(SEG + 0.5, 0.24, 0.22);
      g.compose(p, q, s);
      mats.push(g);
      (Math.abs(x + 112) < 78 ? tealIdx : pinkIdx).push(i);
    }
    deckMesh.instanceMatrix.needsUpdate = true;
    deckMesh.frustumCulled = false;

    const makeGlow = (indices: number[], emissive: number) => {
      const mesh = new THREE.InstancedMesh(
        box,
        createPropMaterial({ color: 0x1c1024, emissive, emissiveDay: 0.14 }),
        indices.length,
      );
      indices.forEach((src, i) => mesh.setMatrixAt(i, mats[src]));
      mesh.instanceMatrix.needsUpdate = true;
      mesh.frustumCulled = false;
      return mesh;
    };

    // piers
    const pierXs: number[] = [];
    for (let x = X_MIN + 12; x < X_MAX; x += 24) pierXs.push(x);
    const pierMesh = new THREE.InstancedMesh(box, createPropMaterial({ color: 0x4a3a52 }), pierXs.length);
    q.identity();
    pierXs.forEach((x, i) => {
      const top = causewayY(x) - 0.8;
      const bottom = -1.5;
      p.set(x, (top + bottom) / 2, CAUSEWAY_Z);
      s.set(1.7, top - bottom, 3.6);
      m.compose(p, q, s);
      pierMesh.setMatrixAt(i, m);
    });
    pierMesh.instanceMatrix.needsUpdate = true;
    pierMesh.frustumCulled = false;

    // street lamps
    const lampSpecs: LightSpec[] = pierXs.map((x) => ({
      x,
      y: causewayY(x) + 3.3,
      z: CAUSEWAY_Z - 2.3,
      color: NEON.warm,
      size: 1.8,
    }));

    // cars: one white head light and one red tail light each
    const carList: Car[] = [];
    const carSpecs: LightSpec[] = [];
    for (let i = 0; i < 62; i++) {
      const dir: 1 | -1 = i % 2 === 0 ? 1 : -1;
      carList.push({ x0: X_MIN + rnd() * SPAN, dir, speed: 15 + rnd() * 11 });
      carSpecs.push({ x: 0, y: 0, z: 0, color: [1.0, 0.94, 0.8], size: 1.5 });
      carSpecs.push({ x: 0, y: 0, z: 0, color: NEON.red, size: 1.25 });
    }

    return {
      deck: deckMesh,
      pillars: pierMesh,
      glowPink: makeGlow(pinkIdx, 0xff5fa8),
      glowTeal: makeGlow(tealIdx, 0x45e3d0),
      lamps: createLightPoints(lampSpecs, { day: 0.22, minPx: 1.6 }),
      traffic: createLightPoints(carSpecs, { day: 0.5, minPx: 1.8 }),
      cars: carList,
    };
  }, []);

  useFrame(() => {
    const t = worldUniforms.uTime.value;
    const attr = traffic.geometry.getAttribute('position') as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < cars.length; i++) {
      const c = cars[i];
      let x = c.x0 + c.dir * c.speed * t;
      x = ((((x - X_MIN) % SPAN) + SPAN) % SPAN) + X_MIN;
      const y = causewayY(x) + 0.75;
      const z = CAUSEWAY_Z + c.dir * 1.25;
      const o = i * 6;
      arr[o] = x + c.dir * 1.1;
      arr[o + 1] = y;
      arr[o + 2] = z;
      arr[o + 3] = x - c.dir * 1.1;
      arr[o + 4] = y;
      arr[o + 5] = z;
    }
    attr.needsUpdate = true;
  });

  useEffect(
    () => () => {
      deck.geometry.dispose();
      [deck, pillars, glowPink, glowTeal].forEach((o) => (o.material as THREE.Material).dispose());
      [lamps, traffic].forEach((o) => {
        o.geometry.dispose();
        (o.material as THREE.Material).dispose();
      });
    },
    [deck, pillars, glowPink, glowTeal, lamps, traffic],
  );

  return (
    <group>
      <primitive object={pillars} />
      <primitive object={deck} />
      <primitive object={glowPink} />
      <primitive object={glowTeal} />
      <primitive object={lamps} />
      <primitive object={traffic} />
    </group>
  );
}
