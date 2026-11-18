import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { mulberry32 } from '../lib/math';
import { GLSL_COMMON, worldUniforms } from './glsl';
import { GROUND_Y, SHORE_Z, SUN_CORRIDOR } from './layout';
import { NEON, createLightPoints, createPropMaterial, type LightSpec } from './materials';

/* ----------------------------- layout ----------------------------- */

interface Building {
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
  y: number;
  rot: number;
  seed: number;
  /** 0 concrete · 1 glass · 2 pastel deco · 3 LED tower · 4 plain (spires, plant rooms) */
  style: number;
}

function generateCity() {
  const rnd = mulberry32(20260711);
  const buildings: Building[] = [];
  const beacons: LightSpec[] = [];

  // Skyline silhouette: a main downtown cluster to the right, a second one to the left.
  const cluster = (x: number) =>
    1.0 * Math.exp(-(((x - 96) / 74) ** 2)) +
    0.72 * Math.exp(-(((x + 196) / 62) ** 2)) +
    0.5 * Math.exp(-(((x - 318) / 56) ** 2)) +
    0.34 * Math.exp(-(((x + 28) / 44) ** 2)) +
    0.3 * Math.exp(-(((x + 400) / 60) ** 2));

  /** Keep the sunset corridor open: anything standing in it stays low. */
  const capForSun = (x: number, w: number, h: number, max: number) =>
    x + w > SUN_CORRIDOR[0] - 2 && x < SUN_CORRIDOR[1] + 2 ? Math.min(h, max) : h;

  const add = (b: Omit<Building, 'seed' | 'y'> & { y?: number }) => {
    buildings.push({ ...b, y: b.y ?? GROUND_Y, seed: rnd() * 100 });
    return buildings[buildings.length - 1];
  };

  const crown = (b: Building) => {
    // Stepped art-deco setbacks + a spire on the tall ones.
    if (b.h > 46 && rnd() > 0.25) {
      const h2 = b.h * (0.12 + rnd() * 0.1);
      add({ x: b.x, z: b.z, w: b.w * 0.7, d: b.d * 0.7, h: h2, y: b.y + b.h, rot: b.rot, style: b.style });
      if (rnd() > 0.45) {
        const h3 = b.h * (0.1 + rnd() * 0.16);
        add({ x: b.x, z: b.z, w: 0.9, d: 0.9, h: h3, y: b.y + b.h + h2, rot: b.rot, style: 4 });
        beacons.push({
          x: b.x,
          y: b.y + b.h + h2 + h3 + 0.6,
          z: b.z,
          color: NEON.red,
          size: 2.6,
          blink: 0.85,
          phase: rnd() * 6.28,
        });
      } else {
        add({ x: b.x, z: b.z, w: b.w * 0.42, d: b.d * 0.42, h: h2 * 0.7, y: b.y + b.h + h2, rot: b.rot, style: b.style });
      }
    } else if (b.h > 30 && rnd() > 0.5) {
      // rooftop plant room
      add({
        x: b.x + (rnd() - 0.5) * b.w * 0.3,
        z: b.z,
        w: b.w * 0.4,
        d: b.d * 0.5,
        h: 2.4 + rnd() * 2.5,
        y: b.y + b.h,
        rot: b.rot,
        style: 4,
      });
    }
  };

  // Far layer — low, wide, almost lost in the haze
  for (let x = -640; x < 640; ) {
    const w = 16 + rnd() * 20;
    const h = capForSun(x, w, 12 + cluster(x) * 36 * (0.5 + rnd() * 0.8) + rnd() * 8, 13);
    add({ x: x + w / 2, z: -352 - rnd() * 60, w, d: 16 + rnd() * 12, h, rot: 0, style: rnd() > 0.5 ? 1 : 0 });
    x += w + 2 + rnd() * 14;
  }

  // Middle layer — the body of the skyline
  for (let x = -600; x < 600; ) {
    const w = 13 + rnd() * 15;
    const c = cluster(x);
    const h = capForSun(x, w, 14 + c * 54 * (0.42 + rnd() * 0.85) + rnd() * 6, 15);
    const b = add({
      x: x + w / 2,
      z: -262 - rnd() * 46,
      w,
      d: 13 + rnd() * 10,
      h,
      rot: (rnd() - 0.5) * 0.12,
      style: rnd() > 0.42 ? 1 : 0,
    });
    crown(b);
    x += w + 3 + rnd() * (c > 0.4 ? 7 : 16);
  }

  // Waterfront high-rises
  for (let x = -560; x < 560; ) {
    const w = 11 + rnd() * 12;
    const c = cluster(x);
    const h = capForSun(x, w, 11 + c * 40 * (0.35 + rnd() * 0.95) + rnd() * 7, 12);
    const b = add({
      x: x + w / 2,
      z: -208 - rnd() * 26,
      w,
      d: 11 + rnd() * 8,
      h,
      rot: (rnd() - 0.5) * 0.16,
      style: rnd() > 0.35 ? 1 : 0,
    });
    crown(b);
    x += w + 4 + rnd() * (c > 0.4 ? 9 : 22);
  }

  // Landmark towers, hand-placed for the hero composition
  const landmarks: Array<[number, number, number, number, number, number]> = [
    // x, z, w, d, h, style
    [114, -246, 21, 21, 90, 3],
    [76, -234, 18, 18, 76, 1],
    [148, -238, 19, 17, 68, 1],
    [40, -244, 17, 17, 60, 1],
    [184, -252, 20, 18, 56, 0],
    [-188, -240, 19, 19, 68, 3],
    [-152, -232, 16, 16, 52, 1],
    [-224, -248, 18, 16, 47, 1],
    [316, -250, 19, 18, 58, 1],
    [-30, -236, 15, 15, 40, 1],
  ];
  landmarks.forEach(([x, z, w, d, h, style]) => {
    const b = add({ x, z, w, d, h, rot: 0, style });
    const h2 = h * 0.14;
    add({ x, z, w: w * 0.72, d: d * 0.72, h: h2, y: b.y + h, rot: 0, style });
    const h3 = h * 0.2;
    add({ x, z, w: 1.0, d: 1.0, h: h3, y: b.y + h + h2, rot: 0, style: 4 });
    beacons.push({ x, y: b.y + h + h2 + h3 + 0.8, z, color: NEON.red, size: 3.2, blink: 0.85, phase: rnd() * 6.28 });
  });

  // Ocean-drive strip of pastel art-deco hotels right on the water
  for (let x = -520; x < 520; ) {
    const w = 11 + rnd() * 13;
    const h = 6.5 + rnd() * 9;
    add({ x: x + w / 2, z: SHORE_Z - 9 - rnd() * 5, w, d: 9 + rnd() * 4, h, rot: 0, style: 2 });
    x += w + 1.2 + rnd() * 5;
  }

  // Promenade lamps along the seawall
  const lamps: LightSpec[] = [];
  for (let x = -540; x <= 540; x += 8.5) {
    lamps.push({ x: x + (rnd() - 0.5), y: GROUND_Y + 3.4, z: SHORE_Z - 1.6, color: NEON.warm, size: 1.9 });
  }
  // Scattered street-level neon between the hotels
  for (let i = 0; i < 90; i++) {
    const pick = rnd();
    const color = pick < 0.4 ? NEON.pink : pick < 0.7 ? NEON.teal : pick < 0.9 ? NEON.amber : NEON.violet;
    lamps.push({
      x: -520 + rnd() * 1040,
      y: GROUND_Y + 1.5 + rnd() * 5,
      z: SHORE_Z - 3.5 - rnd() * 2,
      color,
      size: 1.6 + rnd() * 1.6,
      blink: rnd() > 0.8 ? 0.25 : 0,
      phase: rnd() * 6.28,
    });
  }

  // Suburbs behind the skyline: only seen from the high vistas, where they stretch to the horizon
  for (let i = 0; i < 520; i++) {
    const depth = rnd();
    const pick = rnd();
    const color = pick < 0.72 ? NEON.warm : pick < 0.86 ? NEON.white : pick < 0.94 ? NEON.pink : NEON.teal;
    lamps.push({
      x: (rnd() - 0.5) * (1300 + depth * 1500),
      y: GROUND_Y + 1.5 + rnd() * 3,
      z: -420 - depth * depth * 1500,
      color,
      size: 2.2 + rnd() * 2.6,
      blink: rnd() > 0.9 ? 0.3 : 0,
      phase: rnd() * 6.28,
    });
  }

  return { buildings, beacons, lamps };
}

/* ----------------------------- shader ----------------------------- */

const vertexShader = /* glsl */ `
attribute vec3 aSize;
attribute float aSeed;
attribute float aStyle;
varying vec3 vLocal;
varying vec3 vLocalN;
varying vec3 vWorldN;
varying vec3 vWorld;
varying vec3 vSize;
varying float vSeed;
varying float vStyle;
void main() {
  vLocal = position * aSize;
  vLocalN = normal;
  vSize = aSize;
  vSeed = aSeed;
  vStyle = aStyle;
  vWorldN = normalize(mat3(instanceMatrix) * normal);
  vec4 wp = modelMatrix * instanceMatrix * vec4(position, 1.0);
  vWorld = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

const fragmentShader = /* glsl */ `
varying vec3 vLocal;
varying vec3 vLocalN;
varying vec3 vWorldN;
varying vec3 vWorld;
varying vec3 vSize;
varying float vSeed;
varying float vStyle;
${GLSL_COMMON}

vec3 neonPalette(float h) {
  vec3 c = vec3(1.0, 0.37, 0.66);
  c = mix(c, vec3(0.27, 0.89, 0.82), step(0.36, h));
  c = mix(c, vec3(1.0, 0.77, 0.42), step(0.62, h));
  c = mix(c, vec3(0.62, 0.42, 1.0), step(0.82, h));
  return c;
}
vec3 pastelPalette(float h) {
  vec3 c = vec3(0.96, 0.65, 0.76);
  c = mix(c, vec3(0.66, 0.90, 0.81), step(0.2, h));
  c = mix(c, vec3(1.0, 0.91, 0.68), step(0.4, h));
  c = mix(c, vec3(0.66, 0.84, 0.96), step(0.6, h));
  c = mix(c, vec3(1.0, 0.77, 0.64), step(0.8, h));
  return c;
}

void main() {
  vec3 N = normalize(vWorldN);
  vec3 toFrag = vWorld - cameraPosition;
  float dist = length(toFrag);
  vec3 V = toFrag / dist;
  float night = smoothstep(0.12, 0.85, uTod);

  bool isTop = vLocalN.y > 0.5;
  bool sideX = abs(vLocalN.x) > 0.5;
  float faceW = sideX ? vSize.z : vSize.x;
  vec2 uv = sideX ? vec2(vLocal.z, vLocal.y) : vec2(vLocal.x, vLocal.y);
  float faceId = sideX ? (vLocalN.x > 0.0 ? 1.0 : 2.0) : (vLocalN.z > 0.0 ? 3.0 : 4.0);

  float r1 = hash11(vSeed * 7.31 + 1.3);
  float r2 = hash11(vSeed * 3.17 + 9.1);
  float r3 = hash11(vSeed * 5.77 + 4.4);

  bool isGlass = vStyle > 0.5 && vStyle < 1.5;
  bool isDeco = vStyle > 1.5 && vStyle < 2.5;
  bool isLed = vStyle > 2.5 && vStyle < 3.5;
  bool isPlain = vStyle > 3.5;

  // ---- body ----
  vec3 base = mix(vec3(0.120, 0.070, 0.200), vec3(0.062, 0.074, 0.190), r1);
  float reflectivity = (isGlass || isLed) ? mix(0.42, 0.66, r2) : 0.14;
  vec3 skyAmb = mix(vec3(0.66, 0.40, 0.66), vec3(0.15, 0.11, 0.30), night);
  if (isDeco) {
    base = pastelPalette(r1) * mix(0.70, 0.17, night);
    float brow = smoothstep(0.84, 0.92, fract(uv.y / 3.1));
    base *= 1.0 - brow * 0.3;
    reflectivity = 0.05;
  }

  vec3 R = reflect(V, N);
  R.y = abs(R.y);
  vec3 refl = skyBase(R) + sunGlow(R) * 0.8;
  vec3 col = mix(base * skyAmb * 1.2, refl * vec3(0.80, 0.78, 0.94), reflectivity);
  // warm grazing light on faces turned to the sun
  float sunFace = max(dot(N, normalize(vec3(uSunDir.x, 0.0, uSunDir.z))), 0.0);
  col += vec3(1.0, 0.56, 0.34) * sunFace * 0.34 * (1.0 - night);
  // how strongly this fragment mirrors the sun (drives window glints)
  float sunMirror = pow(max(dot(R, uSunDir), 0.0), 5.0) * (1.0 - night);
  // darker towards street level
  col *= mix(0.72, 1.0, smoothstep(0.0, 26.0, vLocal.y));

  vec3 emissive = vec3(0.0);

  if (!isTop && !isPlain) {
    // ---- windows ----
    vec2 cell = isDeco ? vec2(2.0, 3.0) : mix(vec2(2.0, 2.9), vec2(2.9, 3.7), r2);
    vec2 g = vec2(uv.x + faceW * 0.5, uv.y) / cell;
    vec2 id = floor(g);
    vec2 f = fract(g);
    float wx = smoothstep(0.13, 0.2, f.x) * (1.0 - smoothstep(0.8, 0.87, f.x));
    float wy = smoothstep(0.22, 0.31, f.y) * (1.0 - smoothstep(0.71, 0.8, f.y));
    float win = wx * wy;
    float vmask = smoothstep(1.2, 2.4, uv.y) * (1.0 - smoothstep(vSize.y - 2.4, vSize.y - 1.1, uv.y));
    win *= vmask;

    float rnd = hash12(id + vec2(vSeed * 13.7, faceId * 5.3));
    float litFrac = mix(0.09, 0.50, night) * mix(0.55, 1.25, r3);
    float lit = step(1.0 - litFrac, rnd);
    // whole office floors left on
    float floorRnd = hash11(id.y * 1.7 + vSeed * 3.3);
    lit = max(lit, step(0.94, floorRnd) * step(0.25, rnd) * night);

    float pick = hash12(id * 1.9 + vSeed);
    vec3 wc = vec3(1.0, 0.80, 0.52);
    wc = mix(wc, vec3(0.80, 0.90, 1.0), step(0.72, pick));
    wc = mix(wc, vec3(1.0, 0.45, 0.70), step(0.955, pick));
    wc = mix(wc, vec3(0.35, 0.95, 0.88), step(0.98, pick));

    // when a window is smaller than a pixel, blend to its average instead of shimmering
    float fw = max(fwidth(g.x), fwidth(g.y));
    float detail = 1.0 - smoothstep(0.32, 0.85, fw);
    float avg = litFrac * 0.29 * vmask;
    float glow = mix(avg, win * lit, detail);
    emissive += wc * glow * mix(0.75, 1.0, night);
    // unlit glass reads darker than the wall; a few panes flash back the sunset
    col *= 1.0 - win * (1.0 - lit) * detail * 0.34;
    float glint = step(0.62, hash12(id * 2.3 + vSeed * 1.1));
    emissive += vec3(1.0, 0.60, 0.30) * win * glint * sunMirror * 0.85 * detail;

    // ---- crown lighting on tall towers ----
    float crownOn = step(0.5, r2) * step(36.0, vSize.y);
    float crownBand = smoothstep(vSize.y - 2.7, vSize.y - 2.1, uv.y) * (1.0 - smoothstep(vSize.y - 0.9, vSize.y - 0.4, uv.y));
    emissive += neonPalette(r1) * crownBand * crownOn * mix(0.22, 1.0, night);

    if (isLed) {
      // slow colour wash travelling up the mullions
      float mull = 1.0 - smoothstep(0.0, 0.14, abs(f.x - 0.5) - 0.36);
      float flow = 0.5 + 0.5 * sin(uv.y * 0.10 - uTime * 0.5 + vSeed * 10.0);
      vec3 led = mix(vec3(1.0, 0.36, 0.66), vec3(0.30, 0.90, 0.86), flow);
      emissive += led * mull * mix(0.10, 0.62, night) * mix(0.4, 1.0, detail);
    }
    if (isDeco) {
      float roof = smoothstep(vSize.y - 1.0, vSize.y - 0.55, uv.y);
      float fin = (1.0 - smoothstep(0.22, 0.5, abs(uv.x))) * step(0.45, r3) * smoothstep(2.0, 3.0, uv.y);
      emissive += neonPalette(r2) * (roof + fin) * mix(0.12, 1.0, night);
    }
  } else if (isTop) {
    col *= 0.62;
  }

  // ---- atmosphere ----
  float fog = clamp(1.0 - exp(-dist * mix(0.00155, 0.0021, night)), 0.0, 1.0);
  col = mix(col, hazeColor(V), fog);
  col += emissive * (1.0 - fog * 0.5);

  gl_FragColor = vec4(col, 1.0);
}
`;

/* ----------------------------- component ----------------------------- */

export function City() {
  const { mesh, beacons, lamps, land, seawall } = useMemo(() => {
    const data = generateCity();
    const count = data.buildings.length;

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    geometry.translate(0, 0.5, 0);
    const aSize = new Float32Array(count * 3);
    const aSeed = new Float32Array(count);
    const aStyle = new Float32Array(count);

    const material = new THREE.ShaderMaterial({
      uniforms: { ...worldUniforms },
      vertexShader,
      fragmentShader,
    });

    const inst = new THREE.InstancedMesh(geometry, material, count);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const s = new THREE.Vector3();
    const p = new THREE.Vector3();
    const up = new THREE.Vector3(0, 1, 0);
    data.buildings.forEach((b, i) => {
      p.set(b.x, b.y, b.z);
      q.setFromAxisAngle(up, b.rot);
      s.set(b.w, b.h, b.d);
      m.compose(p, q, s);
      inst.setMatrixAt(i, m);
      aSize.set([b.w, b.h, b.d], i * 3);
      aSeed[i] = b.seed;
      aStyle[i] = b.style;
    });
    geometry.setAttribute('aSize', new THREE.InstancedBufferAttribute(aSize, 3));
    geometry.setAttribute('aSeed', new THREE.InstancedBufferAttribute(aSeed, 1));
    geometry.setAttribute('aStyle', new THREE.InstancedBufferAttribute(aStyle, 1));
    inst.instanceMatrix.needsUpdate = true;
    inst.frustumCulled = false;

    // Land the city stands on + a pale seawall that catches the last light
    const landMesh = new THREE.Mesh(
      new THREE.BoxGeometry(6000, 4, 3600),
      createPropMaterial({ color: 0x1a1226 }),
    );
    landMesh.position.set(0, GROUND_Y - 2, SHORE_Z - 1800);
    landMesh.frustumCulled = false;

    const wall = new THREE.Mesh(
      new THREE.BoxGeometry(6000, 1.5, 2.4),
      createPropMaterial({ color: 0xcdb7b0 }),
    );
    wall.position.set(0, GROUND_Y - 0.55, SHORE_Z + 1.0);
    wall.frustumCulled = false;

    return {
      mesh: inst,
      beacons: createLightPoints(data.beacons, { day: 0.5, minPx: 2.2 }),
      lamps: createLightPoints(data.lamps, { day: 0.22, minPx: 1.6 }),
      land: landMesh,
      seawall: wall,
    };
  }, []);

  useEffect(
    () => () => {
      [mesh, land, seawall].forEach((o) => {
        o.geometry.dispose();
        (o.material as THREE.Material).dispose();
      });
      [beacons, lamps].forEach((o) => {
        o.geometry.dispose();
        (o.material as THREE.Material).dispose();
      });
    },
    [mesh, land, seawall, beacons, lamps],
  );

  return (
    <group>
      <primitive object={land} />
      <primitive object={seawall} />
      <primitive object={mesh} />
      <primitive object={lamps} />
      <primitive object={beacons} />
    </group>
  );
}
