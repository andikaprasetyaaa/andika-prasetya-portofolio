import { useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mulberry32 } from '../lib/math';
import { GLSL_COMMON, worldUniforms } from './glsl';

const COUNT = 11;

const vertexShader = /* glsl */ `
attribute float aWing;
attribute float aPhase;
varying vec3 vWorld;
${GLSL_COMMON}
void main() {
  vec3 p = position;
  float flap = sin(uTime * 6.2 + aPhase);
  // glide a little between wing beats
  float beat = flap * (0.65 + 0.35 * sin(uTime * 0.7 + aPhase * 0.3));
  p.y += aWing * beat * 0.55;
  p.x *= 1.0 - aWing * 0.12 * abs(beat);
  vec4 wp = modelMatrix * instanceMatrix * vec4(p, 1.0);
  vWorld = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

const fragmentShader = /* glsl */ `
varying vec3 vWorld;
${GLSL_COMMON}
void main() {
  vec3 toFrag = vWorld - cameraPosition;
  float dist = length(toFrag);
  vec3 V = toFrag / dist;
  // birds head home once the sun is down
  float vis = 1.0 - smoothstep(0.30, 0.62, uTod);
  if (vis < 0.02) discard;
  vec3 col = vec3(0.075, 0.045, 0.095);
  float fog = clamp(1.0 - exp(-dist * 0.0022), 0.0, 1.0);
  col = mix(col, hazeColor(V), fog * 0.85);
  gl_FragColor = vec4(col, vis);
}
`;

/** A loose V of gulls crossing the bay at golden hour. */
export function Birds() {
  const { mesh, offsets } = useMemo(() => {
    const rnd = mulberry32(555);
    // two triangles: wings spread along x, body along z
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array([
      0, 0, 0.32, 0, 0, -0.34, -1.45, 0, -0.1,
      0, 0, -0.34, 0, 0, 0.32, 1.45, 0, -0.1,
    ]);
    const wing = new Float32Array([0, 0, 1, 0, 0, 1]);
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aWing', new THREE.BufferAttribute(wing, 1));
    const phase = new Float32Array(COUNT);
    const off: Array<[number, number, number]> = [];
    for (let i = 0; i < COUNT; i++) {
      phase[i] = rnd() * 6.283;
      const rank = Math.ceil(i / 2);
      const sideSign = i % 2 === 0 ? 1 : -1;
      // V formation behind the leader, with a little scatter
      off.push([sideSign * rank * 3.4 + (rnd() - 0.5) * 2, (rnd() - 0.5) * 3 + rank * 0.5, rank * 4.2 + (rnd() - 0.5) * 2]);
    }
    g.setAttribute('aPhase', new THREE.InstancedBufferAttribute(phase, 1));
    const material = new THREE.ShaderMaterial({
      uniforms: { ...worldUniforms },
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
    });
    const inst = new THREE.InstancedMesh(g, material, COUNT);
    inst.frustumCulled = false;
    inst.renderOrder = 10;
    return { mesh: inst, offsets: off };
  }, []);

  useEffect(
    () => () => {
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
    },
    [mesh],
  );

  const tmp = useMemo(
    () => ({
      m: new THREE.Matrix4(),
      q: new THREE.Quaternion(),
      s: new THREE.Vector3(1, 1, 1),
      p: new THREE.Vector3(),
      start: new THREE.Vector3(250, 66, -250),
      end: new THREE.Vector3(-270, 44, -30),
      dir: new THREE.Vector3(),
      right: new THREE.Vector3(),
      look: new THREE.Matrix4(),
      up: new THREE.Vector3(0, 1, 0),
      zero: new THREE.Vector3(0, 0, 0),
    }),
    [],
  );

  useFrame(() => {
    const t = worldUniforms.uTime.value;
    const period = 44;
    const k = ((t + 9) % period) / period;
    tmp.dir.subVectors(tmp.end, tmp.start).normalize();
    tmp.right.crossVectors(tmp.dir, tmp.up).normalize();
    // orient so local -z points along the direction of travel
    tmp.look.lookAt(tmp.zero, tmp.dir, tmp.up);
    tmp.q.setFromRotationMatrix(tmp.look);
    for (let i = 0; i < COUNT; i++) {
      const [ox, oy, oz] = offsets[i];
      tmp.p
        .lerpVectors(tmp.start, tmp.end, k)
        .addScaledVector(tmp.right, ox)
        .addScaledVector(tmp.dir, -oz);
      tmp.p.y += oy + Math.sin(t * 0.6 + i) * 0.8;
      const scale = 1.25;
      tmp.s.setScalar(scale);
      tmp.m.compose(tmp.p, tmp.q, tmp.s);
      mesh.setMatrixAt(i, tmp.m);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return <primitive object={mesh} />;
}
