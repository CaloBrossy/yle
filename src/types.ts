export type ExperienceStage = 
  | 'darkness'            // 1. Oscuridad inicial
  | 'seed'                // 2. Semilla descendente
  | 'stem_growth'         // 3. Nacimiento del tallo de la peonía
  | 'peony_blooming'      // 3. Florecimiento de la peonía
  | 'peony_revealed'      // 4. Peonía → valentía
  | 'bouquet_reveal'      // 5 & 6. Aparición progresiva de flores y revelación del ramo completo
  | 'spring_transition'   // 7 & 8. Transición cinematográfica hacia atmósfera cálida
  | 'yellow_blooming'     // 9 & 10. Aparición de flores amarillas y formación del segundo ramo
  | 'yellow_revealed'     // 11. Reveal del ramo amarillo
  | 'final_spring_letter' // 12, 13, 14. Versos: "Feliz primavera, Yle.", "Te quiero.", "Algún día voy a poder dártelas en persona."
  | 'contemplative_end';  // 15. Final contemplativo sin interfaz

export interface FlowerMeaning {
  id: string;
  name: string;
  botanicalName?: string;
  meaning: string;
  quote: string;
  colorPalette: {
    primary: string;
    secondary: string;
    deep: string;
    subsurface: string;
    center: string;
    stem: string;
    leaf: string;
  };
}

export interface PetalGeometryParams {
  length: number;           // Distance from base to tip
  width: number;            // Maximum transverse span
  curvature: number;        // Longitudinal arching (0 to 0.6, strictly positive)
  cupDepth: number;         // Transverse concavity / bowl depth (0 to 0.4)
  ruffleIntensity?: number; // Edge waviness (0 to 0.15 max, strictly clamped)
  ruffleFrequency?: number; // Edge ripple frequency (typically 2 to 5)
  tipNotch?: number;        // Subtle apical notch (0 to 0.1)
  segmentsU?: number;       // Grid width resolution
  segmentsV?: number;       // Grid height resolution
  randomSeed?: number;      // Deterministic variation
}
