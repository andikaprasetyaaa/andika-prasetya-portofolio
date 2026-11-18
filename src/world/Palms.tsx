import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { mulberry32 } from '../lib/math';
import { GLSL_COMMON, worldUniforms } from './glsl';
import { MOUNDS, SHORE_Z, groundY } from './layout';
import { NEON, createPropMaterial } from './materials';

/* ----------------------------- geometry builder ----------------------------- */

class PalmBuilder {
  pos: number[] = [];
  uv: number[] = [];
  sway: number[] = [];
  phase: number[] = [];
  part: number[] = [];
  tint: number[] = [];
  along: number[] = [];
  idx: number[] = [];

  vertex(
    p: THREE.Vector3,
    u: number,
    v: number,
    sway: number,
    phase: number,
    part: number,
    tint: [number, number, number],
    along: number,
  ) {
    this.pos.push(p.x, p.y, p.z);
    this.uv.push(u, v);
    this.sway.push(sway);
    this.phase.push(phase);
    this.part.push(part);
    this.tint.push(tint[0], tint[1], tint[2]);
    this.along.push(along);
    return this.pos.length / 3 - 1;
  }

  quad(a: number, b: number, c: number, d: number) {
    this.idx.push(a, b, c, a, c, d);
  }

  build() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(this.uv, 2));
    g.setAttribute('aSway', new THREE.Float32BufferAttribute(this.sway, 1));
    g.setAttribute('aPhase', new THREE.Float32BufferAttribute(this.phase, 1));
    g.setAttribute('aPart', new THREE.Float32BufferAttribute(this.part, 1));
    g.setAttribute('aTint', new THREE.Float32BufferAttribute(this.tint, 3));
    g.setAttribute('aAlong', new THREE.Float32BufferAttribute(this.along, 1));
    g.setIndex(this.idx);
    return g;
  }
}

interface PalmSpec {
  x: number;
  y: number;
  z: number;
  height: number;
  leanX: number;
  leanZ: number;
  fronds: number;
  frondLength: number;
  seed: number;
  tint: [number, number, number];
}

const Y = new THREE.Vector3(0, 1, 0);

function addPalm(b: PalmBuilder, spec: PalmSpec, detail: 'high' | 'low') {
  const rnd = mulberry32(Math.floor(spec.seed * 9973) + 17);
  const phase = rnd() * 6.283;
  const base = new THREE.Vector3(spec.x, spec.y, spec.z);
  const p1 = base.clone().add(new THREE.Vector3(spec.leanX * 0.8, spec.height * 0.35, spec.leanZ * 0.8));
  const top = base.clone().add(new THREE.Vector3(spec.leanX, spec.height, spec.leanZ));
  const curve = new THREE.QuadraticBezierCurve3(base, p1, top);

  /* trunk */
  const rings = detail === 'high' ? 10 : 4;
  const radial = detail === 'high' ? 7 : 4;
  const r0 = spec.height * 0.024 + 0.12;
  const ringStart: number[] = [];
  const tmpT = new THREE.Vector3();
  const tmpB = new THREE.Vector3();
  const tmpN = new THREE.Vector3();
  for (let i = 0; i <= rings; i++) {
    const t = i / rings;
    const c = curve.getPoint(t);
    curve.getTangent(t, tmpT);
    tmpB.crossVectors(tmpT, new THREE.Vector3(1, 0, 0.3)).normalize();
    tmpN.crossVectors(tmpB, tmpT).normalize();
    const r = r0 * (1 - 0.42 * t) + r0 * 0.55 * Math.exp(-t * 13);
    ringStart.push(b.pos.length / 3);
    for (let j = 0; j <= radial; j++) {
      const a = (j / radial) * Math.PI * 2;
      const p = c
        .clone()
        .addScaledVector(tmpN, Math.cos(a) * r)
        .addScaledVector(tmpB, Math.sin(a) * r);
      b.vertex(p, j / radial, t, t * t * 0.2, phase, 0, spec.tint, t);
    }
  }
  for (let i = 0; i < rings; i++) {
    for (let j = 0; j < radial; j++) {
      const a = ringStart[i] + j;
      const c = ringStart[i + 1] + j;
      b.quad(a, a + 1, c + 1, c);
    }
  }

  /* fronds */
  const segs = detail === 'high' ? 8 : 3;
  for (let k = 0; k < spec.fronds; k++) {
    const phi = (k / spec.fronds) * Math.PI * 2 + (rnd() - 0.5) * 0.55;
    const layer = k % 3;
    const rise = layer === 0 ? 0.74 + rnd() * 0.2 : layer === 1 ? 0.4 + rnd() * 0.2 : 0.08 + rnd() * 0.22;
    const L = spec.frondLength * (0.84 + rnd() * 0.3) * (layer === 0 ? 0.88 : 1);
    const dir = new THREE.Vector3(Math.cos(phi), 0, Math.sin(phi));
    const side = new THREE.Vector3(-Math.sin(phi), 0, Math.cos(phi));
    const hw = L * 0.135;
    const fPhase = phase + k * 0.9;

    const point = (u: number) =>
      top
        .clone()
        .addScaledVector(dir, L * u * (1 - 0.12 * u))
        .addScaledVector(Y, L * (rise * 0.95 * u - (0.5 + 0.38 * (1 - rise)) * u * u));

    let prevRow: number[] | null = null;
    for (let i = 0; i <= segs; i++) {
      const u = i / segs;
      const c = point(u);
      const tan = point(Math.min(1, u + 0.02))
        .sub(point(Math.max(0, u - 0.02)))
        .normalize();
      const nrm = new THREE.Vector3().crossVectors(side, tan).normalize();
      if (nrm.y < 0) nrm.negate();
      const sway = 0.22 + 0.95 * u * u;
      let row: number[];
      if (detail === 'high') {
        const left = c.clone().addScaledVector(side, -hw * 0.85).addScaledVector(nrm, -hw * 0.5);
        const right = c.clone().addScaledVector(side, hw * 0.85).addScaledVector(nrm, -hw * 0.5);
        row = [
          b.vertex(left, u, 0, sway, fPhase, 1, spec.tint, u),
          b.vertex(c, u, 0.5, sway, fPhase, 1, spec.tint, u),
          b.vertex(right, u, 1, sway, fPhase, 1, spec.tint, u),
        ];
      } else {
        const taper = Math.sin(Math.PI * (0.1 + 0.9 * u)) * 0.9 + 0.05;
        const left = c.clone().addScaledVector(side, -hw * taper);
        const right = c.clone().addScaledVector(side, hw * taper);
        row = [b.vertex(left, u, 0, sway, fPhase, 1, spec.tint, u), b.vertex(right, u, 1, sway, fPhase, 1, spec.tint, u)];
      }
      if (prevRow) {
        for (let j = 0; j < row.length - 1; j++) b.quad(prevRow[j], prevRow[j + 1], row[j + 1], row[j]);
      }
      prevRow = row;
    }
  }

  /* crown heart + a few coconuts tucked underneath */
  if (detail === 'high') {
    const rTop = r0 * 0.58;
    const appendSolid = (geo: THREE.BufferGeometry, centre: THREE.Vector3) => {
      const g = geo.index ? geo.toNonIndexed() : geo;
      const gp = g.getAttribute('position');
      const start = b.pos.length / 3;
      for (let v = 0; v < gp.count; v++) {
        b.vertex(new THREE.Vector3(gp.getX(v), gp.getY(v), gp.getZ(v)).add(centre), 0, 0, 0.2, phase, 2, spec.tint, 1);
      }
      for (let v = 0; v < gp.count; v += 3) b.idx.push(start + v, start + v + 1, start + v + 2);
      if (g !== geo) g.dispose();
    };
    const heart = new THREE.SphereGeometry(rTop * 1.9, 8, 6);
    heart.scale(1, 1.5, 1);
    appendSolid(heart, top.clone().add(new THREE.Vector3(0, rTop * 0.6, 0)));
    heart.dispose();
    const nut = new THREE.IcosahedronGeometry(rTop * 0.95, 1);
    for (let n = 0; n < 3; n++) {
      const a = (n / 3) * Math.PI * 2 + rnd() * 2;
      appendSolid(nut, top.clone().add(new THREE.Vector3(Math.cos(a) * rTop * 1.5, -rTop * 1.9, Math.sin(a) * rTop * 1.5)));
    }
    nut.dispose();
  }
}

/* ----------------------------- frond alpha texture ----------------------------- */

function makeFrondTexture() {
  const w = 512;
  const h = 160;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#fff';
  const rnd = mulberry32(4242);
  const mid = h / 2;

  // rachis
  ctx.beginPath();
  ctx.moveTo(0, mid - 4);
  ctx.lineTo(w - 6, mid - 1);
  ctx.lineTo(w - 6, mid + 1);
  ctx.lineTo(0, mid + 4);
  ctx.closePath();
  ctx.fill();

  // leaflets, swept towards the tip
  const count = 44;
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const x = 10 + t * (w - 40);
    const envelope = Math.pow(Math.sin(Math.PI * (0.07 + 0.9 * t)), 0.55);
    for (const dirSign of [-1, 1]) {
      if (rnd() < 0.06) continue; // a few gaps, like wind-torn leaves
      const len = (mid - 5) * envelope * (0.78 + rnd() * 0.22);
      const sweep = len * (0.45 + t * 0.35);
      const baseHalf = 3.6 - t * 1.4;
      ctx.beginPath();
      ctx.moveTo(x - baseHalf, mid);
      ctx.lineTo(x + baseHalf, mid);
      ctx.lineTo(x + sweep + (rnd() - 0.5) * 4, mid + dirSign * len);
      ctx.closePath();
      ctx.fill();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.NoColorSpace;
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = 4;
  return tex;
}

/* ----------------------------- material ----------------------------- */

const vertexShader = /* glsl */ `
attribute float aSway;
attribute float aPhase;
attribute float aPart;
attribute vec3 aTint;
attribute float aAlong;
uniform float uTime;
varying vec2 vUv;
varying float vPart;
varying float vAlong;
varying vec3 vWorld;
varying vec3 vTint;
void main() {
  vUv = uv;
  vPart = aPart;
  vAlong = aAlong;
  vTint = aTint;
  #ifdef USE_INSTANCING
    mat4 m = modelMatrix * instanceMatrix;
    float ph = aPhase + instanceMatrix[3].x * 0.37;
  #else
    mat4 m = modelMatrix;
    float ph = aPhase;
  #endif
  vec3 p = position;
  float t = uTime * 1.05 + ph;
  float gust = 0.62 + 0.38 * sin(uTime * 0.29 + ph * 0.7);
  p.x += (sin(t) * 0.5 + sin(t * 2.3 + 1.7) * 0.16) * aSway * gust;
  p.z += cos(t * 0.83) * 0.38 * aSway * gust;
  p.y += sin(t * 1.7 + 0.6) * 0.2 * aSway * aSway;
  vec4 wp = m * vec4(p, 1.0);
  vWorld = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

const fragmentShader = /* glsl */ `
uniform sampler2D uFrondMap;
uniform float uUseMap;
varying vec2 vUv;
varying float vPart;
varying float vAlong;
varying vec3 vWorld;
varying vec3 vTint;
${GLSL_COMMON}
void main() {
  bool frond = vPart > 0.5 && vPart < 1.5;
  if (frond && uUseMap > 0.5) {
    float a = texture2D(uFrondMap, vUv).a;
    if (a < 0.4) discard;
  }
  vec3 toFrag = vWorld - cameraPosition;
  float dist = length(toFrag);
  vec3 V = toFrag / dist;
  float night = smoothstep(0.12, 0.85, uTod);
  // looking towards the sun → the palm is back-lit
  float back = pow(max(dot(V, uSunDir), 0.0), 3.0) * (1.0 - night);

  vec3 col;
  if (vPart < 0.5) {
    float rings = 0.8 + 0.2 * sin(vAlong * 52.0);
    col = mix(vec3(0.10, 0.062, 0.085), vec3(0.030, 0.022, 0.046), night) * rings;
    col += vec3(1.0, 0.5, 0.3) * back * 0.12;
    // coloured up-lighting from the ground once the sun is gone
    col += vTint * (1.0 - smoothstep(0.0, 0.9, vAlong)) * 0.46 * night;
  } else if (frond) {
    vec3 dayC = mix(vec3(0.040, 0.082, 0.074), vec3(0.10, 0.145, 0.085), vAlong * 0.6);
    col = mix(dayC, vec3(0.016, 0.026, 0.040), night);
    col += vec3(0.95, 0.55, 0.2) * back * 0.36 * (0.35 + 0.65 * abs(vUv.y - 0.5) * 2.0);
    col += vTint * 0.15 * night * (1.0 - vAlong * 0.6);
  } else {
    col = mix(vec3(0.11, 0.075, 0.055), vec3(0.03, 0.022, 0.03), night);
  }

  float fog = clamp(1.0 - exp(-dist * 0.0024), 0.0, 1.0);
  col = mix(col, hazeColor(V), fog);
  gl_FragColor = vec4(col, 1.0);
}
`;

/* ----------------------------- placement ----------------------------- */

type PalmPlacement = [number, number, number, number, number, number, number];
// x, z, height, leanX, leanZ, fronds, frondLength
const FOREGROUND: PalmPlacement[] = [
  // left of the hero frame
  [-26, 30, 20, 5.5, -2.0, 13, 8.8],
  [-35, 17, 25, 3.0, -3.0, 14, 9.4],
  [-21, 7, 15, -2.4, -1.0, 12, 7.4],
  [-41, 26, 16, -3.5, 1.0, 12, 7.8],
  // right of the hero frame
  [29, 26, 22, -5.5, -2.0, 13, 9.2],
  [38, 9, 18, -2.0, -2.5, 13, 8.2],
  [24, -3, 14, 3.0, 0.0, 12, 7.0],
  [44, 20, 15, 4.0, 1.5, 12, 7.6],
  // wide-screen flanks
  [-57, 12, 19, -3.0, -1.0, 13, 8.4],
  [-62, 4, 13, 2.5, 0.5, 11, 6.8],
  [58, 6, 20, 3.5, -1.5, 13, 8.6],
  [64, -2, 14, -2.0, 0.0, 11, 6.8],
  // left island
  [-104, -74, 15, -3.0, 0.5, 12, 7.2],
  [-92, -72, 19, 2.0, -1.0, 13, 8.0],
  [-80, -76, 13, 3.5, 1.0, 11, 6.6],
  [-68, -73, 16, -2.0, 0.0, 12, 7.2],
  // right island (the camera drifts past it later in the page)
  [70, -56, 16, -3.5, 1.0, 12, 7.4],
  [82, -60, 21, 2.5, -1.0, 13, 8.6],
  [94, -55, 14, -2.0, 1.5, 12, 6.8],
  [106, -60, 18, 4.0, 0.0, 13, 7.8],
  [116, -57, 13, 2.0, 1.0, 11, 6.4],
  // small central sandbar
  [4, -98, 12, 2.5, 0.0, 11, 6.0],
  [16, -98, 15, -2.0, 0.5, 12, 6.6],
];

const TINTS: Array<[number, number, number]> = [NEON.pink, NEON.teal, NEON.amber, NEON.violet];

/* ----------------------------- component ----------------------------- */

export function Palms() {
  const { foreground, promenade, mounds, texture } = useMemo(() => {
    const tex = makeFrondTexture();
    const rnd = mulberry32(31337);

    // unique foreground palms, merged into one draw call
    const b = new PalmBuilder();
    FOREGROUND.forEach(([x, z, height, leanX, leanZ, fronds, frondLength], i) => {
      addPalm(
        b,
        { x, y: groundY(x, z) - 0.25, z, height, leanX, leanZ, fronds, frondLength, seed: i + 1, tint: TINTS[i % TINTS.length] },
        'high',
      );
    });
    const fgMaterial = new THREE.ShaderMaterial({
      uniforms: { ...worldUniforms, uFrondMap: { value: tex }, uUseMap: { value: 1 } },
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
    });
    const fg = new THREE.Mesh(b.build(), fgMaterial);
    fg.frustumCulled = false;

    // a low-poly palm repeated along the city promenade
    const lb = new PalmBuilder();
    addPalm(
      lb,
      { x: 0, y: 0, z: 0, height: 9, leanX: 0.8, leanZ: 0, fronds: 8, frondLength: 3.6, seed: 77, tint: NEON.pink },
      'low',
    );
    const promMaterial = new THREE.ShaderMaterial({
      uniforms: { ...worldUniforms, uFrondMap: { value: tex }, uUseMap: { value: 0 } },
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
    });
    const count = 96;
    const prom = new THREE.InstancedMesh(lb.build(), promMaterial, count);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const s = new THREE.Vector3();
    const p = new THREE.Vector3();
    for (let i = 0; i < count; i++) {
      const x = -528 + (i / (count - 1)) * 1056 + (rnd() - 0.5) * 5;
      const scale = 0.85 + rnd() * 0.5;
      p.set(x, 1.2, SHORE_Z - 2.6 - rnd() * 1.2);
      q.setFromAxisAngle(Y, rnd() * Math.PI * 2);
      s.setScalar(scale);
      m.compose(p, q, s);
      prom.setMatrixAt(i, m);
    }
    prom.instanceMatrix.needsUpdate = true;
    prom.frustumCulled = false;

    // sand bars
    const moundGeo = new THREE.SphereGeometry(1, 24, 12);
    const moundMat = createPropMaterial({ color: 0x8a6064 });
    const moundMesh = new THREE.InstancedMesh(moundGeo, moundMat, MOUNDS.length);
    MOUNDS.forEach(([cx, cy, cz, rx, ry, rz], i) => {
      p.set(cx, cy, cz);
      q.identity();
      s.set(rx, ry, rz);
      m.compose(p, q, s);
      moundMesh.setMatrixAt(i, m);
    });
    moundMesh.instanceMatrix.needsUpdate = true;
    moundMesh.frustumCulled = false;

    return { foreground: fg, promenade: prom, mounds: moundMesh, texture: tex };
  }, []);

  useEffect(
    () => () => {
      [foreground, promenade, mounds].forEach((o) => {
        o.geometry.dispose();
        (o.material as THREE.Material).dispose();
      });
      texture.dispose();
    },
    [foreground, promenade, mounds, texture],
  );

  return (
    <group>
      <primitive object={mounds} />
      <primitive object={foreground} />
      <primitive object={promenade} />
    </group>
  );
}
