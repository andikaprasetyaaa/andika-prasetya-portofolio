import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { GLSL_COMMON, worldUniforms } from './glsl';
import { createPropMaterial } from './materials';

function makeYachtGeometry() {
  // hull outline seen from above (x = forward)
  const shape = new THREE.Shape();
  shape.moveTo(-5, -1.55);
  shape.lineTo(2.2, -1.65);
  shape.quadraticCurveTo(5.4, -1.1, 6.6, 0);
  shape.quadraticCurveTo(5.4, 1.1, 2.2, 1.65);
  shape.lineTo(-5, 1.55);
  shape.closePath();
  const hull = new THREE.ExtrudeGeometry(shape, { depth: 1.5, bevelEnabled: false, curveSegments: 6 });
  hull.rotateX(-Math.PI / 2);
  hull.translate(0, -0.35, 0);

  const cabin = new THREE.BoxGeometry(5.2, 1.25, 2.5);
  cabin.translate(-0.7, 1.78, 0);
  const upper = new THREE.BoxGeometry(2.8, 0.95, 2.0);
  upper.translate(-1.3, 2.88, 0);
  const mast = new THREE.BoxGeometry(0.12, 1.6, 0.12);
  mast.translate(-1.6, 4.15, 0);

  const parts = [hull, cabin, upper, mast].map((g) => {
    const n = g.index ? g.toNonIndexed() : g;
    n.deleteAttribute('uv');
    return n;
  });
  const merged = mergeGeometries(parts, false)!;
  [hull, cabin, upper, mast, ...parts].forEach((g) => g !== merged && g.dispose());

  const glass = new THREE.BoxGeometry(5.26, 0.42, 2.56);
  glass.translate(-0.7, 1.9, 0);
  return { body: merged, glass };
}

function makeSailGeometry() {
  const hullShape = new THREE.Shape();
  hullShape.moveTo(-3.6, -0.9);
  hullShape.quadraticCurveTo(2.6, -1.0, 4.4, 0);
  hullShape.quadraticCurveTo(2.6, 1.0, -3.6, 0.9);
  hullShape.closePath();
  const hull = new THREE.ExtrudeGeometry(hullShape, { depth: 1.0, bevelEnabled: false, curveSegments: 5 });
  hull.rotateX(-Math.PI / 2);
  hull.translate(0, -0.3, 0);
  const mast = new THREE.BoxGeometry(0.12, 11, 0.12);
  mast.translate(0.4, 6.1, 0);
  const parts = [hull, mast].map((g) => {
    const n = g.index ? g.toNonIndexed() : g;
    n.deleteAttribute('uv');
    return n;
  });
  const body = mergeGeometries(parts, false)!;
  [hull, mast, ...parts].forEach((g) => g !== body && g.dispose());

  // main sail + jib as two flat triangles
  const sail = new THREE.BufferGeometry();
  const v = new Float32Array([
    0.3, 1.2, 0.05, -3.4, 1.2, 0.05, 0.3, 11.2, 0.05,
    0.6, 1.0, -0.05, 4.0, 1.0, -0.05, 0.6, 9.4, -0.05,
  ]);
  sail.setAttribute('position', new THREE.BufferAttribute(v, 3));
  sail.computeVertexNormals();
  return { body, sail };
}

const wakeVertex = /* glsl */ `
attribute float aAlpha;
varying float vAlpha;
varying vec3 vWorld;
void main() {
  vAlpha = aAlpha;
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorld = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;
const wakeFragment = /* glsl */ `
varying float vAlpha;
varying vec3 vWorld;
${GLSL_COMMON}
void main() {
  float night = smoothstep(0.12, 0.85, uTod);
  float ripple = 0.75 + 0.25 * vnoise(vWorld.xz * 0.9 + uTime * 0.6);
  vec3 c = mix(vec3(1.0, 0.84, 0.82), vec3(0.34, 0.30, 0.52), night);
  gl_FragColor = vec4(c * vAlpha * ripple, 1.0);
}
`;

function makeWake() {
  // long narrow triangle trailing behind a boat that travels towards -x
  const g = new THREE.BufferGeometry();
  const len = 58;
  const half = 4.2;
  const pos = new Float32Array([0, 0, 0, len, 0, -half, len, 0, half]);
  const alpha = new Float32Array([0.5, 0, 0]);
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('aAlpha', new THREE.BufferAttribute(alpha, 1));
  const mat = new THREE.ShaderMaterial({
    uniforms: { ...worldUniforms },
    vertexShader: wakeVertex,
    fragmentShader: wakeFragment,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(g, mat);
  mesh.position.y = 0.08;
  mesh.renderOrder = 5;
  return mesh;
}

export function Boats() {
  const anchored = useRef<THREE.Group>(null);
  const farYacht = useRef<THREE.Group>(null);
  const runner = useRef<THREE.Group>(null);
  const sailboat = useRef<THREE.Group>(null);

  const assets = useMemo(() => {
    const yacht = makeYachtGeometry();
    const sail = makeSailGeometry();
    return {
      yacht,
      sail,
      hullMat: createPropMaterial({ color: 0xf2e8e6 }),
      glassMat: createPropMaterial({ color: 0x2a2038, emissive: 0xffc98a, emissiveDay: 0.12 }),
      sailMat: createPropMaterial({ color: 0xfff1e0, side: THREE.DoubleSide }),
      wake: makeWake(),
    };
  }, []);

  useEffect(
    () => () => {
      assets.yacht.body.dispose();
      assets.yacht.glass.dispose();
      assets.sail.body.dispose();
      assets.sail.sail.dispose();
      assets.hullMat.dispose();
      assets.glassMat.dispose();
      assets.sailMat.dispose();
      assets.wake.geometry.dispose();
      (assets.wake.material as THREE.Material).dispose();
    },
    [assets],
  );

  useFrame(() => {
    const t = worldUniforms.uTime.value;
    const bob = (g: THREE.Group | null, phase: number, amount = 1) => {
      if (!g) return;
      g.position.y = Math.sin(t * 0.9 + phase) * 0.13 * amount;
      g.rotation.z = Math.sin(t * 0.7 + phase) * 0.028 * amount;
      g.rotation.x = Math.sin(t * 0.55 + phase * 1.7) * 0.02 * amount;
    };
    bob(anchored.current, 0.4);
    bob(farYacht.current, 2.1, 0.7);
    bob(sailboat.current, 4.0, 1.3);
    if (sailboat.current) sailboat.current.position.x = 96 - ((t * 1.1) % 260);
    if (runner.current) {
      // crosses the bay right-to-left, then loops
      const span = 640;
      runner.current.position.x = 330 - ((t * 9.5) % span);
      runner.current.position.y = Math.sin(t * 2.6) * 0.07;
    }
  });

  const Yacht = () => (
    <>
      <mesh geometry={assets.yacht.body} material={assets.hullMat} />
      <mesh geometry={assets.yacht.glass} material={assets.glassMat} />
    </>
  );

  return (
    <group>
      <group position={[-54, 0, -104]} rotation-y={0.5}>
        <group ref={anchored} scale={1.15}>
          <Yacht />
        </group>
      </group>
      <group position={[168, 0, -124]} rotation-y={2.7}>
        <group ref={farYacht} scale={1.5}>
          <Yacht />
        </group>
      </group>
      {/* speedboat: nose towards -x */}
      <group ref={runner} position={[330, 0, -118]}>
        <group rotation-y={Math.PI} scale={0.62}>
          <Yacht />
        </group>
        <primitive object={assets.wake} />
      </group>
      <group ref={sailboat} position={[96, 0, -84]} rotation-y={Math.PI}>
        <mesh geometry={assets.sail.body} material={assets.hullMat} />
        <mesh geometry={assets.sail.sail} material={assets.sailMat} />
      </group>
    </group>
  );
}
