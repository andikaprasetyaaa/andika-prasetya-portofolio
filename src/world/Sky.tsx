import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GLSL_COMMON, worldUniforms } from './glsl';

const vertexShader = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = position;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  // keep the dome at the far plane
  gl_Position.z = gl_Position.w * 0.99999;
}
`;

const fragmentShader = /* glsl */ `
varying vec3 vDir;
${GLSL_COMMON}

float starField(vec3 d) {
  vec3 p = d * 190.0;
  vec3 ip = floor(p);
  vec3 fp = fract(p) - 0.5;
  float h = hash13(ip);
  float size = smoothstep(0.986, 1.0, h);
  float core = smoothstep(0.42, 0.0, length(fp));
  float twinkle = 0.72 + 0.28 * sin(uTime * (0.6 + h * 1.4) + h * 60.0);
  return size * core * twinkle;
}

void main() {
  vec3 d = normalize(vDir);
  vec3 col = skyBase(d);
  col += sunGlow(d);

  float night = smoothstep(0.25, 0.9, uTod);
  float sunVis = 1.0 - smoothstep(0.30, 0.78, uTod);

  // soft sun disc
  float sd = dot(d, uSunDir);
  float disc = smoothstep(0.99905, 0.99948, sd);
  // low sun: gold at the top of the disc sinking to a deep orange at its base
  float discY = clamp((d.y - uSunDir.y) / 0.04 * 0.5 + 0.5, 0.0, 1.0);
  vec3 discCol = mix(vec3(1.0, 0.50, 0.34), vec3(1.0, 0.86, 0.56), discY);
  discCol = mix(discCol, vec3(1.0, 0.46, 0.36), smoothstep(0.0, 0.6, uTod));
  col = mix(col, discCol, disc * sunVis);

  // stars + crescent moon
  float starMask = smoothstep(0.03, 0.3, d.y);
  float stars = starField(d) * night * starMask;

  float md = dot(d, uMoonDir);
  float moon = smoothstep(0.99955, 0.99972, md);
  vec3 cut = normalize(uMoonDir + vec3(0.011, 0.006, 0.0));
  float moonCut = smoothstep(0.99950, 0.99968, dot(d, cut));
  float crescent = clamp(moon - moonCut, 0.0, 1.0);
  float moonHalo = pow(max(md, 0.0), 900.0) * 0.20 + pow(max(md, 0.0), 60.0) * 0.045;

  // layered clouds, lit from the sun side
  float cloud = 0.0;
  vec3 cloudCol = vec3(0.0);
  if (d.y > -0.01) {
    vec2 uv = d.xz / (d.y + 0.2);
    uv *= vec2(0.42, 1.05);
    float t = uTime * 0.0055;
    float n1 = fbm4(uv * 0.95 + vec2(t, t * 0.35));
    float n2 = fbm3(uv * 2.5 - vec2(t * 1.6, 0.0) + 7.7);
    float c = n1 * 0.76 + n2 * 0.24;
    float cover = smoothstep(0.50, 0.74, c);
    float fade = smoothstep(0.005, 0.075, d.y) * (1.0 - smoothstep(0.5, 0.95, d.y));
    cloud = cover * fade * 0.9;

    vec2 toSun = normalize(uSunDir.xz) * 0.13;
    float nl = fbm3((uv + toSun) * 0.95 + vec2(t, t * 0.35));
    float lit = clamp((n1 - nl) * 4.2 + 0.46, 0.0, 1.0);
    float facing = max(dot(normalize(d.xz + vec2(1e-5)), normalize(uSunDir.xz)), 0.0);
    float nearSun = pow(facing, 5.0);

    // under-lit by the low sun: hot edges, cool violet bodies
    vec3 dayLit = mix(vec3(0.98, 0.44, 0.52), vec3(1.0, 0.62, 0.36), nearSun);
    vec3 dayShade = mix(vec3(0.27, 0.13, 0.44), vec3(0.50, 0.19, 0.46), nearSun);
    vec3 nightLit = vec3(0.19, 0.11, 0.30);
    vec3 nightShade = vec3(0.045, 0.03, 0.10);
    vec3 litC = mix(dayLit, nightLit, uTod);
    vec3 shadeC = mix(dayShade, nightShade, uTod);
    cloudCol = mix(shadeC, litC, lit);
    // thin edges catch more light
    cloudCol += litC * (1.0 - cover) * 0.14 * (1.0 - uTod);
  }

  col += vec3(0.85, 0.88, 1.0) * stars * (1.0 - cloud);
  col += vec3(0.95, 0.9, 1.0) * (crescent * 0.95 + moonHalo) * night * (1.0 - cloud * 0.7);
  col = mix(col, cloudCol, cloud);

  // low haze band hugging the horizon
  float haze = exp(-abs(d.y) * 38.0);
  col += mix(vec3(1.0, 0.62, 0.42), vec3(0.42, 0.14, 0.44), uTod) * haze * mix(0.10, 0.07, uTod);

  // below the horizon the dome matches the distance haze, so the far edge of the sea never shows a seam
  col = mix(col, hazeColor(d), smoothstep(0.0, -0.03, d.y));

  // dither away gradient banding
  col += (hash12(gl_FragCoord.xy + fract(uTime)) - 0.5) / 255.0 * 1.6;

  gl_FragColor = vec4(col, 1.0);
}
`;

export function Sky() {
  const ref = useRef<THREE.Mesh>(null);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { ...worldUniforms },
        vertexShader,
        fragmentShader,
        side: THREE.BackSide,
        depthWrite: false,
        depthTest: false,
      }),
    [],
  );

  useFrame(({ camera }) => {
    if (ref.current) ref.current.position.copy(camera.position);
  });

  return (
    <mesh ref={ref} material={material} frustumCulled={false} renderOrder={-100}>
      <sphereGeometry args={[100, 48, 32]} />
    </mesh>
  );
}
