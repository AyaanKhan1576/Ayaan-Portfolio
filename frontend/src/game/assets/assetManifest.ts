export type ImageAssetUsage = "singleSprite" | "spriteSheet" | "tileset" | "background" | "objectSheet" | "ui";
export type AudioAssetCategory = "music" | "ambience" | "ui" | "interaction" | "transition" | "movement";

export interface GeneratedImageAsset {
  key: string;
  path: string;
  filename: string;
  extension: string;
  inferredType: ImageAssetUsage;
  width: number;
  height: number;
  suggestedFrameWidth: number;
  suggestedFrameHeight: number;
  frameCount: number;
}

export interface GeneratedAudioAsset {
  key: string;
  path: string;
  filename: string;
  extension: string;
  inferredCategory: AudioAssetCategory;
}

export interface GeneratedAssetManifest {
  images: readonly GeneratedImageAsset[];
  audio: readonly GeneratedAudioAsset[];
}

export { generatedAssetManifest } from "./generatedAssetManifest";
