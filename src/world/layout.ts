/** Shared world measurements so every element agrees on where things are. */

/** Height of the land the city stands on */
export const GROUND_Y = 1.2;

/** Waterfront line: everything further back than this is on land */
export const SHORE_Z = -168;

/** Compass bearing of the setting sun, in radians right of straight ahead */
export const SUN_AZIMUTH = 0.188;

/** The sun sets down this corridor of the skyline, so tall buildings keep out of it */
export const SUN_CORRIDOR: [number, number] = [50, 66];

/** Causeway running in front of the city */
export const CAUSEWAY_Z = -146;

/** Sand bars: [cx, cy, cz, rx, ry, rz] */
export const MOUNDS: Array<[number, number, number, number, number, number]> = [
  [-31, -1.3, 18, 17, 2.5, 24],
  [33, -1.3, 12, 16, 2.5, 26],
  [-58, -1.1, 10, 10, 1.9, 13],
  [60, -1.1, 4, 10, 1.9, 13],
  [-88, -1.4, -74, 32, 2.7, 13],
  [92, -1.5, -58, 36, 2.9, 17],
  [10, -1.2, -98, 20, 2.0, 9],
];

/** Height of the sand at a point (0 = open water) */
export function groundY(x: number, z: number) {
  let best = 0;
  for (const [cx, cy, cz, rx, ry, rz] of MOUNDS) {
    const k = 1 - ((x - cx) / rx) ** 2 - ((z - cz) / rz) ** 2;
    if (k > 0) best = Math.max(best, cy + ry * Math.sqrt(k));
  }
  return best;
}

/** Deck height of the causeway at x — a low road with one raised span for boats */
export function causewayY(x: number) {
  return 4.4 + 7.5 * Math.exp(-(((x + 112) / 46) ** 2));
}
