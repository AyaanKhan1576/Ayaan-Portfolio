import type { ObjectSpriteKey } from "./spriteConfig";

export interface AmbientParticleConfig {
  id: string;
  x: number;
  y: number;
  size: number;
  alpha: number;
  driftX: number;
  driftY: number;
  duration: number;
  delay: number;
}

export interface AmbientSpriteConfig {
  id: string;
  assetKey: ObjectSpriteKey;
  x: number;
  y: number;
  displayWidth: number;
  displayHeight: number;
  originX?: number;
  originY?: number;
  bobAmplitude: number;
  bobDuration: number;
}

export const ambientParticles: AmbientParticleConfig[] = [
  { id: "drift-1", x: 156, y: 104, size: 1.2, alpha: 0.08, driftX: 10, driftY: -4, duration: 6800, delay: 0 },
  { id: "drift-2", x: 640, y: 114, size: 1.4, alpha: 0.06, driftX: -8, driftY: 5, duration: 7600, delay: 900 },
  { id: "drift-3", x: 214, y: 356, size: 1.1, alpha: 0.07, driftX: 8, driftY: -5, duration: 8200, delay: 1200 },
  { id: "drift-4", x: 606, y: 360, size: 1.3, alpha: 0.06, driftX: -7, driftY: 4, duration: 7400, delay: 400 },
  { id: "drift-5", x: 398, y: 94, size: 1.1, alpha: 0.08, driftX: 0, driftY: 4, duration: 9000, delay: 1800 },
];

export const bulbMotion = {
  swayAmplitude: 0.3,
  swayDuration: 6000,
  bobAmplitude: 1.5,
};