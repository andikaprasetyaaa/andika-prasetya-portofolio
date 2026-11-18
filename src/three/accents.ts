/** Accent hue per project. Kept free of three.js so it can be imported without pulling in the 3D bundle. */
export const PROJECT_ACCENTS: Record<string, string> = {
  summarization: '#ffc46b',
  'ufc-graphrag': '#ff5fa8',
  'fashion-ops': '#45e3d0',
  'boxing-coach': '#ff8a5c',
  'discount-alert': '#9d6bff',
  'shopify-pulse': '#8ff0c8',
  'indoberttweet-hate-speech': '#72c6ff',
  'fruits-vegetables-tflite': '#ffd98a',
};

export const accentFor = (id: string) => PROJECT_ACCENTS[id] ?? '#ff5fa8';
