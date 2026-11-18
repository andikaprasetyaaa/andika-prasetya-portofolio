import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { PROFILE } from '../data/content';
import { GLSL_COMMON, worldUniforms } from './glsl';
import { createPropMaterial } from './materials';

const BANNER_W = 30;
const BANNER_H = 5.2;

function drawBanner(canvas: HTMLCanvasElement, text: string) {
  const ctx = canvas.getContext('2d')!;
  const { width: w, height: h } = canvas;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#fff3e4';
  ctx.fillRect(0, 0, w, h);
  // sunset stripe top and bottom
  const grad = ctx.createLinearGradient(0, 0, w, 0);
  grad.addColorStop(0, '#ff8a5c');
  grad.addColorStop(0.5, '#ff5fa8');
  grad.addColorStop(1, '#9d6bff');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h * 0.09);
  ctx.fillRect(0, h * 0.91, w, h * 0.09);

  ctx.fillStyle = '#2a1038';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  let size = h * 0.62;
  ctx.font = `${size}px Anton, Impact, "Arial Narrow", sans-serif`;
  const max = w * 0.9;
  const measured = ctx.measureText(text).width;
  if (measured > max) {
    size *= max / measured;
    ctx.font = `${size}px Anton, Impact, "Arial Narrow", sans-serif`;
  }
  ctx.fillText(text, w / 2, h / 2 + size * 0.04);
}

const bannerVertex = /* glsl */ `
uniform float uWidth;
varying vec2 vUv;
varying vec3 vWorld;
${GLSL_COMMON}
void main() {
  vUv = uv;
  vec3 p = position;
  // the trailing end flutters more than the towed end
  float k = uv.x;
  p.y += sin(k * 9.0 - uTime * 4.6) * 0.34 * k;
  p.z += cos(k * 7.0 - uTime * 4.0) * 0.55 * k;
  vec4 wp = modelMatrix * vec4(p, 1.0);
  vWorld = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

const bannerFragment = /* glsl */ `
uniform sampler2D uMap;
varying vec2 vUv;
varying vec3 vWorld;
${GLSL_COMMON}
void main() {
  vec3 toFrag = vWorld - cameraPosition;
  float dist = length(toFrag);
  vec3 V = toFrag / dist;
  float night = smoothstep(0.12, 0.85, uTod);
  vec3 tex = texture2D(uMap, vUv).rgb;
  // cloth shading from the flutter
  float shade = 0.9 + 0.1 * sin(vUv.x * 9.0 - uTime * 4.6);
  vec3 light = mix(vec3(1.0, 0.86, 0.84), vec3(0.24, 0.20, 0.42), night);
  vec3 col = tex * light * shade;
  float fog = clamp(1.0 - exp(-dist * 0.0016), 0.0, 1.0);
  col = mix(col, hazeColor(V), fog * 0.8);
  gl_FragColor = vec4(col, 1.0);
}
`;

function makePlaneGeometry() {
  // nose points towards -x
  const fuselage = new THREE.CylinderGeometry(0.62, 0.3, 6.4, 8);
  fuselage.rotateZ(-Math.PI / 2);
  const nose = new THREE.ConeGeometry(0.62, 1.2, 8);
  nose.rotateZ(Math.PI / 2);
  nose.translate(-3.8, 0, 0);
  const wing = new THREE.BoxGeometry(1.5, 0.14, 9.4);
  wing.translate(-0.9, 0.55, 0);
  const stab = new THREE.BoxGeometry(0.9, 0.1, 3.4);
  stab.translate(2.8, 0.1, 0);
  const fin = new THREE.BoxGeometry(1.0, 1.25, 0.1);
  fin.translate(2.8, 0.7, 0);
  const parts = [fuselage, nose, wing, stab, fin].map((g) => {
    const n = g.index ? g.toNonIndexed() : g;
    n.deleteAttribute('uv');
    return n;
  });
  const merged = mergeGeometries(parts, false)!;
  [fuselage, nose, wing, stab, fin, ...parts].forEach((g) => g !== merged && g.dispose());
  return merged;
}

/** A light aircraft towing a banner across the bay — a beach-town classic. */
export function BannerPlane() {
  const group = useRef<THREE.Group>(null);

  const assets = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 224;
    const text = PROFILE.availability;
    drawBanner(canvas, text);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.NoColorSpace;
    texture.anisotropy = 4;

    const bannerGeo = new THREE.PlaneGeometry(BANNER_W, BANNER_H, 40, 1);
    const bannerMat = new THREE.ShaderMaterial({
      uniforms: { ...worldUniforms, uMap: { value: texture }, uWidth: { value: BANNER_W } },
      vertexShader: bannerVertex,
      fragmentShader: bannerFragment,
      side: THREE.DoubleSide,
    });

    return {
      canvas,
      text,
      texture,
      bannerGeo,
      bannerMat,
      planeGeo: makePlaneGeometry(),
      planeMat: createPropMaterial({ color: 0xf6ece8, fogScale: 0.7 }),
      ropeGeo: new THREE.BoxGeometry(8.4, 0.06, 0.06),
      ropeMat: createPropMaterial({ color: 0x3a2a40, fogScale: 0.7 }),
    };
  }, []);

  // redraw once the display font is available
  useEffect(() => {
    let alive = true;
    document.fonts
      ?.load('120px Anton')
      .then(() => {
        if (!alive) return;
        drawBanner(assets.canvas, assets.text);
        assets.texture.needsUpdate = true;
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [assets]);

  useEffect(
    () => () => {
      assets.texture.dispose();
      assets.bannerGeo.dispose();
      assets.bannerMat.dispose();
      assets.planeGeo.dispose();
      assets.planeMat.dispose();
      assets.ropeGeo.dispose();
      assets.ropeMat.dispose();
    },
    [assets],
  );

  useFrame(() => {
    if (!group.current) return;
    const t = worldUniforms.uTime.value;
    const period = 78;
    const k = ((t + 16) % period) / period;
    group.current.position.set(380 - k * 860, 66 + Math.sin(t * 0.35) * 1.6, -176);
    group.current.rotation.z = Math.sin(t * 0.5) * 0.025;
  });

  return (
    <group ref={group} position={[380, 66, -176]}>
      <mesh geometry={assets.planeGeo} material={assets.planeMat} />
      <mesh geometry={assets.ropeGeo} material={assets.ropeMat} position={[7.4, -0.1, 0]} />
      <mesh geometry={assets.bannerGeo} material={assets.bannerMat} position={[11.6 + BANNER_W / 2, -0.1, 0]} />
    </group>
  );
}
