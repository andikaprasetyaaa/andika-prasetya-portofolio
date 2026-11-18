import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GLSL_COMMON, worldUniforms } from './glsl';
import { MOUNDS, SHORE_Z } from './layout';

const vertexShader = /* glsl */ `
varying vec3 vWorld;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorld = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

const fragmentShader = /* glsl */ `
#define MOUND_COUNT ${MOUNDS.length}
uniform vec4 uMounds[MOUND_COUNT];
uniform float uShoreZ;
varying vec3 vWorld;
${GLSL_COMMON}

const mat2 ROT1 = mat2(0.8, -0.6, 0.6, 0.8);
const mat2 ROT2 = mat2(0.28, 0.96, -0.96, 0.28);

float waveH(vec2 p, float t) {
  float h = 0.0;
  h += vnoise(p * 0.105 + vec2(t * 0.15, t * 0.085)) * 1.0;
  h += vnoise(ROT1 * p * 0.31 - vec2(t * 0.21, -t * 0.14)) * 0.42;
  h += vnoise(ROT2 * p * 0.92 + vec2(-t * 0.29, t * 0.25)) * 0.15;
  return h;
}

/* Same silhouette the city generator uses, so reflections follow the real skyline */
float skylineHeight(float x) {
  float a = (x - 96.0) / 74.0;
  float b = (x + 196.0) / 62.0;
  float c = (x - 318.0) / 56.0;
  float d = (x + 28.0) / 44.0;
  float e = (x + 400.0) / 60.0;
  float k = exp(-a * a) + 0.72 * exp(-b * b) + 0.5 * exp(-c * c) + 0.34 * exp(-d * d) + 0.3 * exp(-e * e);
  return 13.0 + k * 50.0;
}

/* Trace the mirrored ray to the waterfront and light it where it meets the buildings */
vec3 cityLights(vec3 P, vec3 r) {
  if (r.z > -0.02) return vec3(0.0);
  float s = (uShoreZ - 10.0 - P.z) / r.z;
  if (s <= 0.0) return vec3(0.0);
  vec3 hit = P + r * s;
  float top = skylineHeight(hit.x);
  float inside = smoothstep(top, top * 0.5, hit.y) * smoothstep(-1.0, 1.5, hit.y);
  if (inside <= 0.0) return vec3(0.0);
  float cells = hit.x / 2.5;
  float id = floor(cells);
  float f = fract(cells);
  float h = hash11(id + 3.7);
  float on = step(0.40, h);
  float shape = smoothstep(0.0, 0.3, f) * smoothstep(1.0, 0.7, f);
  float pick = hash11(id * 1.37 + 11.0);
  vec3 c = vec3(1.0, 0.76, 0.46);
  c = mix(c, vec3(1.0, 0.36, 0.66), step(0.56, pick));
  c = mix(c, vec3(0.28, 0.9, 0.84), step(0.78, pick));
  c = mix(c, vec3(0.92, 0.9, 1.0), step(0.92, pick));
  // street level (promenade lamps, neon) throws the strongest reflection
  float low = 0.42 + 0.95 * smoothstep(18.0, 0.0, hit.y);
  float reach = 1.0 - smoothstep(520.0, 900.0, s);
  return c * on * shape * inside * low * reach;
}

void main() {
  vec3 toFrag = vWorld - cameraPosition;
  float dist = length(toFrag);
  vec3 V = toFrag / dist;
  float night = smoothstep(0.15, 0.85, uTod);

  // wave normal from a small finite difference; gentle near the eye, flatter far away
  vec2 p = vWorld.xz;
  float t = uTime;
  float e = 0.45;
  float h0 = waveH(p, t);
  float hx = waveH(p + vec2(e, 0.0), t);
  float hz = waveH(p + vec2(0.0, e), t);
  float strength = 0.66 / (1.0 + dist * 0.0062);
  vec3 n = normalize(vec3(-(hx - h0) / e * strength, 1.0, -(hz - h0) / e * strength));

  vec3 r = reflect(V, n);
  r.y = abs(r.y) + 0.002;
  r = normalize(r);

  vec3 refl = skyBase(r) + sunGlow(r) * 0.78;
  float sunVis = 1.0 - smoothstep(0.30, 0.78, uTod);
  float glit = pow(max(dot(r, uSunDir), 0.0), 420.0);
  refl += vec3(1.0, 0.80, 0.56) * glit * 0.85 * sunVis;
  float mg = pow(max(dot(r, uMoonDir), 0.0), 800.0);
  refl += vec3(0.8, 0.82, 1.0) * mg * 0.7 * night;

  // city light columns: use a calmer normal so they read as streaks, and keep them off the near water
  vec3 nc = normalize(mix(n, vec3(0.0, 1.0, 0.0), 0.5));
  vec3 rc = reflect(V, nc);
  rc.y = abs(rc.y) + 0.002;
  refl += cityLights(vWorld, normalize(rc)) * mix(0.10, 0.70, night);

  float fres = 0.10 + 0.90 * pow(1.0 - max(dot(-V, n), 0.0), 3.4);
  vec3 deep = mix(vec3(0.17, 0.085, 0.29), vec3(0.016, 0.012, 0.050), uTod);
  vec3 col = mix(deep, refl, fres);

  // soft foam where the water meets the sand bars and the seawall
  float foam = 0.0;
  float wob = vnoise(p * 0.45 + t * 0.1) * 4.0;
  for (int i = 0; i < MOUND_COUNT; i++) {
    vec4 m = uMounds[i];
    vec2 q = (p - m.xy) / m.zw;
    float dw = (length(q) - 1.0) * min(m.z, m.w);
    float ring = smoothstep(2.8, 0.0, dw) * step(-0.4, dw);
    float lap = 0.5 + 0.5 * sin(dw * 2.9 - t * 1.25 + wob);
    foam = max(foam, ring * (0.3 + 0.7 * lap * lap));
  }
  float dwall = p.y - uShoreZ;
  float wallRing = smoothstep(3.0, 0.0, dwall) * step(0.0, dwall);
  foam = max(foam, wallRing * (0.25 + 0.5 * (0.5 + 0.5 * sin(dwall * 2.6 - t * 1.1 + wob))));
  vec3 foamCol = mix(vec3(1.0, 0.80, 0.80), vec3(0.26, 0.22, 0.40), night);
  col = mix(col, foamCol, foam * 0.5);

  // distance haze so the water melts into the horizon
  float fog = smoothstep(120.0, 900.0, dist) * 0.92 + smoothstep(1400.0, 3200.0, dist) * 0.08;
  col = mix(col, hazeColor(V), fog);

  col += (hash12(gl_FragCoord.xy) - 0.5) / 255.0 * 1.5;
  gl_FragColor = vec4(col, 1.0);
}
`;

export function Ocean() {
  const ref = useRef<THREE.Mesh>(null);
  const material = useMemo(() => {
    const mounds = MOUNDS.map(([cx, cy, cz, rx, ry, rz]) => {
      // radius of each sand bar where it crosses the waterline
      const k = Math.sqrt(Math.max(0.05, 1 - (cy / ry) ** 2));
      return new THREE.Vector4(cx, cz, rx * k, rz * k);
    });
    return new THREE.ShaderMaterial({
      uniforms: {
        ...worldUniforms,
        uMounds: { value: mounds },
        uShoreZ: { value: SHORE_Z + 2.2 },
      },
      vertexShader,
      fragmentShader,
    });
  }, []);

  // The plane follows the camera so the sea is effectively endless; waves stay world-anchored.
  useFrame(({ camera }) => {
    if (ref.current) {
      ref.current.position.x = camera.position.x;
      ref.current.position.z = camera.position.z;
    }
  });

  return (
    <mesh ref={ref} material={material} rotation-x={-Math.PI / 2} frustumCulled={false} renderOrder={-50}>
      <planeGeometry args={[9000, 9000, 1, 1]} />
    </mesh>
  );
}
