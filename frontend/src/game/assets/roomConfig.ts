import { generatedAssetManifest } from "./generatedAssetManifest";

export interface RoomAssetConfig {
  key: string;
  label: string;
  backgroundAssetKey?: string;
  tilesetAssetKey?: string;
  width: number;
  height: number;
  bounds: { x: number; y: number; width: number; height: number };
  wrapMargin: number;
  playerStart: { x: number; y: number };
  fallbackStyle: "whiteDream";
  assumptions: string[];
}

const hasWhiteScreen = generatedAssetManifest.images.some((asset) => asset.key === "rooms_white_screen");
const hasTileset = generatedAssetManifest.images.some((asset) => asset.key === "rooms_whitespace_tileset");

export const mainRoomConfig: RoomAssetConfig = {
  key: "main-room",
  label: "White Room",
  backgroundAssetKey: hasWhiteScreen ? "rooms_white_screen" : undefined,
  tilesetAssetKey: hasTileset ? "rooms_whitespace_tileset" : undefined,
  width: 800,
  height: 450,
  bounds: { x: 74, y: 88, width: 652, height: 316 },
  wrapMargin: 34,
  playerStart: { x: 394, y: 352 },
  fallbackStyle: "whiteDream",
  assumptions: [
    "Full-room background is preferred when available.",
    "Tilesets are not required for the MVP room; fallback graphics stay active for readability.",
    "The player wraps around a margin outside the drawn room instead of colliding with the room outline.",
    "The lightbulb uses a downloaded crop when available; the cord is drawn so the room remains usable without external assets.",
  ],
};
