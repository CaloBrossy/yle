import { FlowerMeaning } from '../types';

export interface FlowerPlacement {
  id: string;
  name: string;
  botanicalName: string;
  meaning: string;
  quote: string;
  type: 'peony' | 'jasmine' | 'lavender' | 'daisy' | 'tulip' | 'gypsophila';
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  bloomOrder: number; // Order in narrative
  stemCurve: [number, number, number][];
  colors: FlowerMeaning['colorPalette'];
}

export const FLOWERS_DATA: Record<string, FlowerMeaning> = {
  peony: {
    id: 'peony',
    name: 'Peonía',
    botanicalName: 'Paeonia suffruticosa',
    meaning: 'Valentía',
    quote: 'Porque hay una forma de valentía que no hace ruido: la de seguir siendo sensible después de todo.',
    colorPalette: {
      primary: '#fcdada',      // Soft blush pink
      secondary: '#f7c5cb',    // Rose quartz
      deep: '#e58c9f',         // Deep crimson blush inner shadow
      subsurface: '#ffccd4',   // Translucent petal glow
      center: '#ffd54f',       // Golden pollen core
      stem: '#2d3b2f',         // Dark organic stem green
      leaf: '#263428',         // Deep nocturnal leaf
    },
  },
  jasmine: {
    id: 'jasmine',
    name: 'Jazmín',
    botanicalName: 'Jasminum officinale',
    meaning: 'Ternura',
    quote: 'La delicadeza que aromatiza sin pedir permiso, suave en el aire de la existencia.',
    colorPalette: {
      primary: '#fcfbf7',
      secondary: '#f3ece1',
      deep: '#ded3c2',
      subsurface: '#fff9e6',
      center: '#f6d365',
      stem: '#2e3a2c',
      leaf: '#243224',
    },
  },
  lavender: {
    id: 'lavender',
    name: 'Lavanda',
    botanicalName: 'Lavandula angustifolia',
    meaning: 'Calma',
    quote: 'El sosiego de encontrar un refugio quieto en medio de todo el movimiento.',
    colorPalette: {
      primary: '#b8a9c9',
      secondary: '#9f8bb8',
      deep: '#6e528a',
      subsurface: '#d5cbe2',
      center: '#7d6199',
      stem: '#353e2e',
      leaf: '#3a4435',
    },
  },
  daisy: {
    id: 'daisy',
    name: 'Margarita',
    botanicalName: 'Bellis perennis',
    meaning: 'Alegría',
    quote: 'La pureza de una sonrisa limpia, luminosa como la primera luz en tus ojos.',
    colorPalette: {
      primary: '#ffffff',
      secondary: '#f4f3ec',
      deep: '#dcd8cb',
      subsurface: '#fffbee',
      center: '#fbb034',
      stem: '#2a3b2b',
      leaf: '#273827',
    },
  },
  tulip: {
    id: 'tulip',
    name: 'Tulipán',
    botanicalName: 'Tulipa gesneriana',
    meaning: 'Amor Sincero',
    quote: 'La certeza de entregarse sin máscaras, entero y transparente.',
    colorPalette: {
      primary: '#f68e9e',
      secondary: '#ea6982',
      deep: '#c43354',
      subsurface: '#ff9ebb',
      center: '#3b1c2b',
      stem: '#2c3c2f',
      leaf: '#293a2c',
    },
  },
  gypsophila: {
    id: 'gypsophila',
    name: 'Gipsófila',
    botanicalName: 'Gypsophila paniculata',
    meaning: 'Cariño',
    quote: 'Una constelación de pequeños detalles que abrazan y sostienen todo.',
    colorPalette: {
      primary: '#ffffff',
      secondary: '#f8f8f8',
      deep: '#e2e2e2',
      subsurface: '#ffffff',
      center: '#e5e2c5',
      stem: '#394635',
      leaf: '#334030',
    },
  },
};

// Procedural placement in the grand nocturnal bouquet
export const BOUQUET_FLOWERS: FlowerPlacement[] = [
  // The central protagonist
  {
    id: 'peony-main',
    name: 'Peonía',
    botanicalName: 'Paeonia',
    meaning: 'Valentía',
    quote: 'Porque hay una forma de valentía que no hace ruido: la de seguir siendo sensible después de todo.',
    type: 'peony',
    position: [0, 0.15, 0.22],
    rotation: [0.18, 0.0, 0.0],
    scale: 1.15,
    bloomOrder: 1,
    stemCurve: [
      [0, -2.4, -0.06],
      [0.02, -1.4, 0.0],
      [-0.01, -0.45, 0.10],
      [0, 0.12, 0.22],
    ],
    colors: FLOWERS_DATA.peony.colorPalette,
  },
  // Jasmine (mid-left flank, star petals facing front-left)
  {
    id: 'jasmine-1',
    name: 'Jazmín',
    botanicalName: 'Jasminum',
    meaning: 'Ternura',
    quote: 'La delicadeza que aromatiza sin pedir permiso, suave en el aire de la noche.',
    type: 'jasmine',
    position: [0, 0, 0],
    rotation: [0.40, -0.30, 0.40],
    scale: 0.90,
    bloomOrder: 2,
    stemCurve: [
      [-0.04, -2.4, 0.02],
      [-0.12, -1.4, 0.06],
      [-0.32, -0.45, 0.18],
      [-0.68, -0.25, 0.28],
      [-0.95, -0.05, 0.35],
    ],
    colors: FLOWERS_DATA.jasmine.colorPalette,
  },
  // Lavender (tall right balance, vertical calming sprigs)
  {
    id: 'lavender-1',
    name: 'Lavanda',
    botanicalName: 'Lavandula',
    meaning: 'Calma',
    quote: 'El sosiego de encontrar un refugio quieto en medio de todo el movimiento.',
    type: 'lavender',
    position: [0, 0, 0],
    rotation: [-0.10, -0.25, -0.22],
    scale: 1.0,
    bloomOrder: 3,
    stemCurve: [
      [0.03, -2.4, -0.03],
      [0.10, -1.4, -0.06],
      [0.26, -0.45, -0.10],
      [0.58, 0.40, -0.16],
      [0.85, 1.15, -0.20],
    ],
    colors: FLOWERS_DATA.lavender.colorPalette,
  },
  // Daisy (lower frontal right, cheerful open face)
  {
    id: 'daisy-1',
    name: 'Margarita',
    botanicalName: 'Bellis',
    meaning: 'Alegría',
    quote: 'La pureza de una sonrisa limpia, luminosa como el primer rayo de sol.',
    type: 'daisy',
    position: [0, 0, 0],
    rotation: [0.45, 0.25, -0.35],
    scale: 0.85,
    bloomOrder: 4,
    stemCurve: [
      [0.03, -2.4, 0.04],
      [0.10, -1.4, 0.08],
      [0.30, -0.45, 0.22],
      [0.60, -0.32, 0.34],
      [0.85, -0.22, 0.42],
    ],
    colors: FLOWERS_DATA.daisy.colorPalette,
  },
  // Tulip (top left romantic arch, chalice tilted towards viewer)
  {
    id: 'tulip-1',
    name: 'Tulipán',
    botanicalName: 'Tulipa',
    meaning: 'Amor Sincero',
    quote: 'La certeza de entregarse sin máscaras, entero y transparente.',
    type: 'tulip',
    position: [0, 0, 0],
    rotation: [-0.15, 0.35, 0.30],
    scale: 0.95,
    bloomOrder: 5,
    stemCurve: [
      [-0.03, -2.4, -0.04],
      [-0.10, -1.4, -0.06],
      [-0.26, -0.45, -0.10],
      [-0.60, 0.35, -0.14],
      [-0.88, 1.05, -0.15],
    ],
    colors: FLOWERS_DATA.tulip.colorPalette,
  },
  // Gypsophila sprays (clouds of tiny stars framing the bouquet crown)
  {
    id: 'gypsophila-1',
    name: 'Gipsófila',
    botanicalName: 'Gypsophila',
    meaning: 'Cariño',
    quote: 'Una constelación de pequeños detalles que abrazan y sostienen todo.',
    type: 'gypsophila',
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: 1.05,
    bloomOrder: 6,
    stemCurve: [
      [0.0, -2.4, -0.02],
      [0.0, -1.4, -0.06],
      [0.0, -0.45, -0.14],
      [0.0, 0.45, -0.25],
      [0.0, 1.25, -0.35],
    ],
    colors: FLOWERS_DATA.gypsophila.colorPalette,
  },
];

export const POETIC_VERSES = {
  scene1: {
    whisper1: "Quería regalarte flores... pero no encontré la forma de hacerlas llegar hasta vos. Así que hice un pequeño lugar para vos",
  },
  scene2: {
    flowerName: "Peonía",
    meaning: "Valentía.",
    quote: "Porque hay una forma de valentía que no hace ruido: la de seguir siendo sensible después de todo.",
  },
  sceneFinal: [
    "Quería regalarte flores.",
    "No encontré la forma de hacerlas llegar hasta vos.",
    "Así que hice algo que pudiera.",
    "No es un ramo de flores.",
    "Es un pequeño lugar que hice para vos.",
    "Porque hay cosas hermosas que merecen ser creadas, incluso cuando no podemos tenerlas entre las manos.",
    "Para vos.",
  ],
};
