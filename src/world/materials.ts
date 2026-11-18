import * as THREE from 'three';
import { GLSL_COMMON, worldUniforms } from './glsl';

/* ------------------------------------------------------------------ */
/* Generic unlit-but-shaded prop material (land, bridge, boats, plane) */
/* ------------------------------------------------------------------ */

const propVertex = /* glsl */ `
varying vec3 vWorld;
varying vec3 vN;
varying vec3 vLocal;
void main() {
  vLocal = position;
  #ifdef USE_INSTANCING
    mat4 m = modelMatrix * instanceMatrix;
  #else
    mat4 m = modelMatrix;
  #endif
  vec4 wp = m * vec4(position, 1.0);
  vWorld = wp.xyz;
  vN = normalize(mat3(m) * normal);
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

const propFragment = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uEmissive;
uniform float uEmissiveDay;
uniform float uFogScale;
varying vec3 vWorld;
varying vec3 vN;
varying vec3 vLocal;
${GLSL_COMMON}
void main() {
  vec3 N = normalize(vN);
  vec3 toFrag = vWorld - cameraPosition;
  float dist = length(toFrag);
  vec3 V = toFrag / dist;
  float night = smoothstep(0.12, 0.85, uTod);

  vec3 skyAmb = mix(vec3(0.78, 0.50, 0.70), vec3(0.15, 0.11, 0.30), night);
  float up = N.y * 0.5 + 0.5;
  float sun = max(dot(N, uSunDir), 0.0) * (1.0 - night);
  vec3 col = uColor * (skyAmb * (0.42 + 0.58 * up) + vec3(1.0, 0.68, 0.42) * sun * 1.1);

  float fog = clamp(1.0 - exp(-dist * 0.0024 * uFogScale), 0.0, 1.0);
  col = mix(col, hazeColor(V), fog);
  col += uEmissive * mix(uEmissiveDay, 1.0, night) * (1.0 - fog * 0.5);
  gl_FragColor = vec4(col, 1.0);
}
`;

export function createPropMaterial(opts: {
  color: THREE.ColorRepresentation;
  emissive?: THREE.ColorRepresentation;
  emissiveDay?: number;
  fogScale?: number;
  side?: THREE.Side;
}) {
  return new THREE.ShaderMaterial({
    uniforms: {
      ...worldUniforms,
      uColor: { value: colorToVec3(opts.color) },
      uEmissive: { value: colorToVec3(opts.emissive ?? 0x000000) },
      uEmissiveDay: { value: opts.emissiveDay ?? 0.2 },
      uFogScale: { value: opts.fogScale ?? 1 },
    },
    vertexShader: propVertex,
    fragmentShader: propFragment,
    side: opts.side ?? THREE.FrontSide,
  });
}

/** Colours are authored as display (sRGB) values and written straight to the framebuffer. */
export function colorToVec3(c: THREE.ColorRepresentation): THREE.Vector3 {
  const col = new THREE.Color();
  col.set(c);
  // THREE.Color converts hex input to linear; convert back so shaders work in display space.
  col.convertLinearToSRGB();
  return new THREE.Vector3(col.r, col.g, col.b);
}

/* ------------------------------------------------------------------ */
/* Soft glowing light points (street lamps, cars, beacons, fireflies)  */
/* ------------------------------------------------------------------ */

export interface LightSpec {
  x: number;
  y: number;
  z: number;
  /** Display-space colour 0..1 */
  color: [number, number, number];
  /** World-space radius of the glow */
  size: number;
  /** 0 = steady, 1 = fully breathing */
  blink?: number;
  phase?: number;
}

const lightVertex = /* glsl */ `
attribute vec3 aColor;
attribute float aSize;
attribute float aBlink;
attribute float aPhase;
uniform float uScale;
uniform float uDay;
uniform float uMinPx;
varying vec3 vColor;
varying float vAlpha;
${GLSL_COMMON}
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  float dist = -mv.z;
  float px = aSize * uScale / max(dist, 0.001);
  float breathe = 1.0 - aBlink * (0.5 + 0.5 * sin(uTime * 1.3 + aPhase));
  float night = smoothstep(0.10, 0.80, uTod);
  float intensity = mix(uDay, 1.0, night) * breathe;
  // tiny far lights keep a minimum footprint but lose brightness instead
  float clampPx = max(px, uMinPx);
  vAlpha = intensity * min(1.0, (px / clampPx) * 1.6 + 0.25);
  float fog = clamp(1.0 - exp(-dist * 0.0018), 0.0, 1.0);
  vAlpha *= 1.0 - fog * 0.55;
  vColor = aColor;
  gl_PointSize = clampPx;
}
`;

const lightFragment = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float halo = pow(max(1.0 - d, 0.0), 2.4);
  float core = smoothstep(0.34, 0.0, d);
  vec3 col = vColor * (halo * 0.55 + core * 0.9) + vec3(1.0) * core * 0.25;
  gl_FragColor = vec4(col * vAlpha, 1.0);
}
`;

export function createLightPoints(lights: LightSpec[], opts: { day?: number; minPx?: number } = {}) {
  const n = lights.length;
  const pos = new Float32Array(n * 3);
  const col = new Float32Array(n * 3);
  const size = new Float32Array(n);
  const blink = new Float32Array(n);
  const phase = new Float32Array(n);
  lights.forEach((l, i) => {
    pos.set([l.x, l.y, l.z], i * 3);
    col.set(l.color, i * 3);
    size[i] = l.size;
    blink[i] = l.blink ?? 0;
    phase[i] = l.phase ?? i * 1.618;
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geometry.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
  geometry.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
  geometry.setAttribute('aBlink', new THREE.BufferAttribute(blink, 1));
  geometry.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
  const material = new THREE.ShaderMaterial({
    uniforms: {
      ...worldUniforms,
      uScale: pointScale,
      uDay: { value: opts.day ?? 0.25 },
      uMinPx: { value: opts.minPx ?? 2.0 },
    },
    vertexShader: lightVertex,
    fragmentShader: lightFragment,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  points.renderOrder = 20;
  return points;
}

/** Pixels per world unit at distance 1 — kept in sync with the viewport by the camera rig. */
export const pointScale = { value: 1000 };

export const NEON = {
  pink: [1.0, 0.37, 0.66] as [number, number, number],
  teal: [0.27, 0.89, 0.82] as [number, number, number],
  amber: [1.0, 0.77, 0.42] as [number, number, number],
  violet: [0.62, 0.42, 1.0] as [number, number, number],
  warm: [1.0, 0.82, 0.56] as [number, number, number],
  white: [0.95, 0.94, 1.0] as [number, number, number],
  red: [1.0, 0.2, 0.22] as [number, number, number],
};
