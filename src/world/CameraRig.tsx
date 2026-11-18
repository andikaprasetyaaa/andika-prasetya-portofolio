import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { clamp, damp, lerp, smoothstep } from '../lib/math';
import { scrollState } from '../lib/scroll';
import { worldUniforms } from './glsl';
import { SUN_AZIMUTH } from './layout';
import { pointScale } from './materials';

/**
 * Camera keyframes, one per section. As the page scrolls the camera glides along the
 * shoreline and climbs, ending on a high vista over the bay.
 */
const KEYS: Array<{ pos: [number, number, number]; look: [number, number, number] }> = [
  { pos: [0, 6.0, 62], look: [16, 23, -220] }, // hero — wide establishing shot
  { pos: [2, 8.5, 48], look: [22, 22, -220] }, // about
  { pos: [5, 12.5, 33], look: [34, 20, -220] }, // projects
  { pos: [7, 18, 18], look: [20, 17, -220] }, // stack
  { pos: [9, 26, 4], look: [4, 12, -220] }, // timeline
  { pos: [11, 36, -8], look: [18, 6, -220] }, // contact — looking down on the lights
  { pos: [12, 40, -12], look: [20, 4, -220] },
];

const tmpPos = new THREE.Vector3();
const tmpLook = new THREE.Vector3();
const a = new THREE.Vector3();
const b = new THREE.Vector3();

function sample(journey: number, outPos: THREE.Vector3, outLook: THREE.Vector3) {
  const j = clamp(journey, 0, KEYS.length - 1.0001);
  const i = Math.floor(j);
  // ease inside each segment so the camera settles while a section is being read
  const f = j - i;
  const t = f * f * (3 - 2 * f);
  outPos.copy(a.fromArray(KEYS[i].pos)).lerp(b.fromArray(KEYS[i + 1].pos), t);
  outLook.copy(a.fromArray(KEYS[i].look)).lerp(b.fromArray(KEYS[i + 1].look), t);
}

export function CameraRig({ animate }: { animate: boolean }) {
  const { camera, size, gl } = useThree();
  const state = useRef({
    journey: 0,
    px: 0,
    py: 0,
    look: new THREE.Vector3(16, 24, -220),
    time: 0,
    init: false,
  });

  useFrame((_, rawDelta) => {
    const s = state.current;
    const dt = Math.min(rawDelta, 0.05);
    const cam = camera as THREE.PerspectiveCamera;

    // Portrait screens get a wider lens so the skyline still reads.
    const aspect = size.width / Math.max(1, size.height);
    const fov = aspect < 0.8 ? 56 : aspect < 1.2 ? 46 : 38;
    if (cam.fov !== fov) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }
    pointScale.value = gl.domElement.height / (2 * Math.tan((fov * Math.PI) / 360));

    if (!s.init || !animate) {
      s.journey = scrollState.journey;
      s.init = true;
    } else {
      s.journey = damp(s.journey, scrollState.journey, 3.2, dt);
    }
    if (animate) {
      s.time += dt;
      s.px = damp(s.px, scrollState.pointerX, 2.2, dt);
      s.py = damp(s.py, scrollState.pointerY, 2.2, dt);
    }

    sample(s.journey, tmpPos, tmpLook);

    // gentle handheld drift + pointer parallax
    const driftX = Math.sin(s.time * 0.21) * 0.5;
    const driftY = Math.sin(s.time * 0.17 + 1.3) * 0.28;
    cam.position.set(tmpPos.x + driftX + s.px * 1.7, tmpPos.y + driftY + s.py * 0.7, tmpPos.z);
    s.look.set(tmpLook.x + s.px * 5.0, tmpLook.y + s.py * 3.0, tmpLook.z);
    cam.lookAt(s.look);

    // time of day follows the journey: golden hour → dusk → neon night
    const tod = smoothstep(0.12, 1.9, s.journey);
    worldUniforms.uTod.value = tod;
    worldUniforms.uTime.value = s.time;
    const elevation = lerp(0.082, -0.3, smoothstep(0, 1, tod));
    worldUniforms.uSunDir.value
      .set(Math.sin(SUN_AZIMUTH) * Math.cos(elevation), Math.sin(elevation), -Math.cos(SUN_AZIMUTH) * Math.cos(elevation))
      .normalize();
  }, -10);

  return null;
}
