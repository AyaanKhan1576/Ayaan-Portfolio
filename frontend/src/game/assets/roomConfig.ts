import { generatedAssetManifest } from "./generatedAssetManifest";

export interface RoomAssetConfig {
  key: string;
  label: string;
  backgroundAssetKey?: string;
  tilesetAssetKey?: string;
  width: number;
  height: number;
  bounds: { x: number; y: number; width: number; height: number };
  wrapBounds: { x: number; y: number; width: number; height: number };
  wrapPadding: number;
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
  bounds: { x: 34, y: 72, width: 732, height: 338 },
  wrapBounds: { x: 0, y: 0, width: 800, height: 450 },
  wrapPadding: 18,
  playerStart: { x: 404, y: 255 },
  fallbackStyle: "whiteDream",
  assumptions: [
    "Full-room background is preferred when available.",
    "Tilesets are not required for the MVP room; fallback graphics stay active for readability.",
    "The player wraps at the full 800x450 canvas edges instead of the decorative room outline.",
    "The lightbulb uses a downloaded crop when available; the cord is drawn so the room remains usable without external assets.",
  ],
};
