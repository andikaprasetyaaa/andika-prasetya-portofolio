import * as THREE from 'three';

/**
 * Uniforms shared by every material in the world. Materials spread this object into
 * their own uniform map, so each `{ value }` holder is the same instance everywhere and
 * a single per-frame update drives the whole scene.
 */
export const worldUniforms = {
  uTime: { value: 0 },
  /** Time of day: 0 = golden hour, 1 = deep night */
  uTod: { value: 0 },
  uSunDir: { value: new THREE.Vector3(0.24, 0.085, -0.967).normalize() },
  uMoonDir: { value: new THREE.Vector3(-0.36, 0.25, -0.9).normalize() },
};

export const GLSL_COMMON = /* glsl */ `
uniform float uTime;
uniform float uTod;
uniform vec3 uSunDir;
uniform vec3 uMoonDir;

float hash11(float p) {
  p = fract(p * 0.1031);
  p *= p + 33.33;
  p *= p + p;
  return fract(p);
}
float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float hash13(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.zyx + 31.32);
  return fract((p3.x + p3.y) * p3.z);
}
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  // quintic fade: no visible lattice in derived normals
  f = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float a = hash12(i);
  float b = hash12(i + vec2(1.0, 0.0));
  float c = hash12(i + vec2(0.0, 1.0));
  float d = hash12(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
float fbm4(vec2 p) {
  float s = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    s += a * vnoise(p);
    p = p * 2.03 + vec2(17.1, 9.2);
    a *= 0.5;
  }
  return s;
}
float fbm3(vec2 p) {
  float s = 0.0;
  float a = 0.5;
  for (int i = 0; i < 3; i++) {
    s += a * vnoise(p);
    p = p * 2.03 + vec2(17.1, 9.2);
    a *= 0.5;
  }
  return s;
}

/* ---- Sky colour model (shared by the dome, the water reflection and the haze) ---- */
vec3 skyBase(vec3 d) {
  float h = d.y;
  vec2 dh = normalize(d.xz + vec2(1e-5));
  vec2 sh = normalize(uSunDir.xz);
  float facing = clamp(dot(dh, sh) * 0.5 + 0.5, 0.0, 1.0);
  // wide warm side of the sky, plus a tight golden core around the sun's bearing
  float nearSun = pow(facing, 7.0);
  float core = pow(facing, 60.0);

  // golden hour
  vec3 sHor = mix(vec3(0.62, 0.30, 0.56), vec3(1.00, 0.56, 0.40), nearSun);
  sHor = mix(sHor, vec3(1.00, 0.76, 0.42), core);
  vec3 sLow = mix(vec3(0.50, 0.22, 0.58), vec3(0.96, 0.36, 0.50), nearSun);
  sLow = mix(sLow, vec3(1.00, 0.50, 0.40), core * 0.7);
  vec3 sMid = mix(vec3(0.27, 0.13, 0.50), vec3(0.56, 0.18, 0.58), nearSun);
  vec3 sZen = vec3(0.090, 0.065, 0.30);

  // night, with the city's magenta glow on the horizon
  vec3 nHor = mix(vec3(0.15, 0.07, 0.28), vec3(0.33, 0.12, 0.40), nearSun);
  vec3 nLow = mix(vec3(0.075, 0.040, 0.19), vec3(0.14, 0.06, 0.25), nearSun);
  vec3 nMid = vec3(0.038, 0.026, 0.110);
  vec3 nZen = vec3(0.016, 0.013, 0.055);

  float t1 = smoothstep(-0.02, 0.07, h);
  float t2 = smoothstep(0.04, 0.21, h);
  float t3 = smoothstep(0.15, 0.56, h);

  vec3 s = mix(mix(mix(sHor, sLow, t1), sMid, t2), sZen, t3);
  vec3 n = mix(mix(mix(nHor, nLow, t1), nMid, t2), nZen, t3);
  return mix(s, n, uTod);
}

vec3 sunGlow(vec3 d) {
  float sd = max(dot(d, uSunDir), 0.0);
  float vis = 1.0 - smoothstep(0.30, 0.80, uTod);
  vec3 c = vec3(1.00, 0.72, 0.46) * pow(sd, 5.0) * 0.26;
  c += vec3(1.00, 0.84, 0.62) * pow(sd, 48.0) * 0.40;
  c += vec3(1.00, 0.86, 0.64) * pow(sd, 420.0) * 0.30;
  return c * vis;
}

/* Horizon colour in a given world direction — used as distance haze. */
vec3 hazeColor(vec3 viewDir) {
  vec3 d = normalize(vec3(viewDir.x, 0.035, viewDir.z));
  return skyBase(d) + sunGlow(d) * 0.55;
}
`;
