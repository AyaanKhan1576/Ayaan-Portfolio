import { generatedAssetManifest } from "./generatedAssetManifest";
import type { GeneratedImageAsset } from "./assetManifest";

export interface SourceImageConfig {
  key: string;
  path: string;
}

export interface CroppedFrameConfig {
  key: string;
  sourceKey: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PlayerAnimationFrames {
  idleDown: string[];
  idleUp: string[];
  idleLeft: string[];
  idleRight: string[];
  walkDown: string[];
  walkUp: string[];
  walkLeft: string[];
  walkRight: string[];
}

export interface ObjectSpriteConfig {
  id: string;
  sourceKey: string;
  frameKey?: string;
  displayWidth: number;
  displayHeight: number;
  hitboxWidth?: number;
  hitboxHeight?: number;
  originX?: number;
  originY?: number;
  blendMode?: "normal" | "difference";
  directImage?: boolean;
  sourceCrop?: { x: number; y: number; width: number; height: number };
  notes: string;
}

export interface PlayerSpriteConfig {
  sourceKey: string;
  width: number;
  height: number;
  scale: number;
  originX: number;
  originY: number;
  fallbackAssumption: string;
  animations: PlayerAnimationFrames;
}

function findImage(key: string): GeneratedImageAsset | undefined {
  return generatedAssetManifest.images.find((asset) => asset.key === key);
}

const characterSheet = findImage("sprites_character_omori");
const whitespaceSheet = findImage("sprites_whitespace_misc");
const roomTiles = findImage("rooms_whitespace_tileset");
const charmSheet = findImage("sprites_items_charms");
const blackspaceSheet = findImage("sprites_tileset_blackspace");
const hudSheet = findImage("sprites_hud_battleui");

export const sourceImages: SourceImageConfig[] = [
  characterSheet && { key: "sprites_character_omori", path: characterSheet.path },
  whitespaceSheet && { key: "sprites_whitespace_misc", path: whitespaceSheet.path },
  roomTiles && { key: "rooms_whitespace_tileset", path: roomTiles.path },
  charmSheet && { key: "sprites_items_charms", path: charmSheet.path },
  blackspaceSheet && { key: "sprites_tileset_blackspace", path: blackspaceSheet.path },
  hudSheet && { key: "sprites_hud_battleui", path: hudSheet.path },
].filter(Boolean) as SourceImageConfig[];

const playerSource = "sprites_character_omori";
const whitespaceSource = "sprites_whitespace_misc";
const charmSource = "sprites_items_charms";
const blackspaceSource = "sprites_tileset_blackspace";
const hudSource = "sprites_hud_battleui";

// The walk section is arranged by row: down/front, left, right, up/back.
// Only three walk frames are used because the fourth column in the raw sheet belongs to the run set.
export const playerSprite = {
  sourceKey: playerSource,
  width: 24,
  height: 29,
  scale: 1.62,
  originX: 0.5,
  originY: 1,
  fallbackAssumption: "The downloaded player sheet is mixed, so movement uses tight manual crops around complete walk sprites instead of grid slicing.",
  animations: {
    idleUp: ["player_idle_up"],
    idleRight: ["player_idle_right"],
    idleLeft: ["player_idle_left"],
    idleDown: ["player_idle_down"],
    walkUp: ["player_walk_up_0", "player_walk_up_1", "player_walk_up_2"],
    walkRight: ["player_walk_right_0", "player_walk_right_1", "player_walk_right_2"],
    walkLeft: ["player_walk_left_0", "player_walk_left_1", "player_walk_left_2"],
    walkDown: ["player_walk_down_0", "player_walk_down_1", "player_walk_down_2"],
  },
} satisfies PlayerSpriteConfig;

export const croppedFrames: CroppedFrameConfig[] = [
  { key: "player_idle_up", sourceKey: playerSource, x: 4, y: 116, width: 24, height: 29 },
  { key: "player_walk_up_0", sourceKey: playerSource, x: 4, y: 116, width: 24, height: 29 },
  { key: "player_walk_up_1", sourceKey: playerSource, x: 37, y: 116, width: 24, height: 29 },
  { key: "player_walk_up_2", sourceKey: playerSource, x: 70, y: 116, width: 24, height: 29 },

  { key: "player_idle_left", sourceKey: playerSource, x: 4, y: 50, width: 24, height: 29 },
  { key: "player_walk_left_0", sourceKey: playerSource, x: 4, y: 50, width: 24, height: 29 },
  { key: "player_walk_left_1", sourceKey: playerSource, x: 37, y: 50, width: 24, height: 29 },
  { key: "player_walk_left_2", sourceKey: playerSource, x: 70, y: 50, width: 24, height: 29 },

  { key: "player_idle_right", sourceKey: playerSource, x: 4, y: 83, width: 24, height: 29 },
  { key: "player_walk_right_0", sourceKey: playerSource, x: 4, y: 83, width: 24, height: 29 },
  { key: "player_walk_right_1", sourceKey: playerSource, x: 37, y: 83, width: 24, height: 29 },
  { key: "player_walk_right_2", sourceKey: playerSource, x: 70, y: 83, width: 24, height: 29 },

  { key: "player_idle_down", sourceKey: playerSource, x: 4, y: 17, width: 24, height: 29 },
  { key: "player_walk_down_0", sourceKey: playerSource, x: 4, y: 17, width: 24, height: 29 },
  { key: "player_walk_down_1", sourceKey: playerSource, x: 37, y: 17, width: 24, height: 29 },
  { key: "player_walk_down_2", sourceKey: playerSource, x: 70, y: 17, width: 24, height: 29 },

  { key: "obj_cat_0", sourceKey: whitespaceSource, x: 96, y: 8, width: 32, height: 24 },
  { key: "obj_cat_1", sourceKey: whitespaceSource, x: 128, y: 8, width: 32, height: 24 },
  { key: "obj_lightbulb", sourceKey: whitespaceSource, x: 134, y: 161, width: 21, height: 30 },

  // White-on-black charm crops are manually tightened to whole connected objects.
  { key: "obj_about_laptop", sourceKey: charmSource, x: 555, y: 342, width: 80, height: 73 },
  { key: "obj_skills_book", sourceKey: charmSource, x: 22, y: 448, width: 64, height: 72 },
  { key: "obj_featured_ticket", sourceKey: charmSource, x: 112, y: 238, width: 100, height: 61 },
  { key: "obj_sim_remote", sourceKey: charmSource, x: 670, y: 16, width: 68, height: 75 },
  { key: "obj_media_headphones", sourceKey: charmSource, x: 11, y: 676, width: 79, height: 45 },
  { key: "obj_experience_watch", sourceKey: charmSource, x: 28, y: 15, width: 46, height: 76 },
  { key: "obj_resume_tag", sourceKey: charmSource, x: 564, y: 449, width: 54, height: 74 },
  { key: "obj_contact_phone", sourceKey: charmSource, x: 139, y: 449, width: 47, height: 72 },

  { key: "obj_projects_door", sourceKey: blackspaceSource, x: 610, y: 916, width: 44, height: 52 },
  { key: "obj_media_piano", sourceKey: blackspaceSource, x: 0, y: 842, width: 126, height: 58 },
  { key: "obj_picture_frame", sourceKey: blackspaceSource, x: 686, y: 1352, width: 86, height: 74 },

  { key: "ui_prompt_box", sourceKey: hudSource, x: 18, y: 1186, width: 360, height: 96 },
];

export const objectSpriteMap: Record<string, ObjectSpriteConfig> = {
  laptopSprite: {
    id: "laptopSprite",
    sourceKey: charmSource,
    frameKey: "obj_about_laptop",
    displayWidth: 48,
    displayHeight: 44,
    blendMode: "difference",
    notes: "Uses the laptop charm from /assets/sprites/items_charms.png with difference blend for black-on-white line art.",
  },
  bookSprite: {
    id: "bookSprite",
    sourceKey: charmSource,
    frameKey: "obj_skills_book",
    displayWidth: 34,
    displayHeight: 38,
    blendMode: "difference",
    notes: "Uses the closed book charm from /assets/sprites/items_charms.png.",
  },
  ticketSprite: {
    id: "ticketSprite",
    sourceKey: charmSource,
    frameKey: "obj_featured_ticket",
    displayWidth: 58,
    displayHeight: 36,
    blendMode: "difference",
    notes: "Uses the ticket/coupon charm as a featured-project memory marker.",
  },
  watchSprite: {
    id: "watchSprite",
    sourceKey: charmSource,
    frameKey: "obj_experience_watch",
    displayWidth: 30,
    displayHeight: 48,
    blendMode: "difference",
    notes: "Uses the watch charm for the experience timeline.",
  },
  tagSprite: {
    id: "tagSprite",
    sourceKey: charmSource,
    frameKey: "obj_resume_tag",
    displayWidth: 36,
    displayHeight: 48,
    blendMode: "difference",
    notes: "Uses the tag charm as the resume marker.",
  },
  phoneSprite: {
    id: "phoneSprite",
    sourceKey: charmSource,
    frameKey: "obj_contact_phone",
    displayWidth: 30,
    displayHeight: 46,
    blendMode: "difference",
    notes: "Uses the phone charm for contact.",
  },
  doorSprite: {
    id: "doorSprite",
    sourceKey: blackspaceSource,
    frameKey: "obj_projects_door",
    displayWidth: 36,
    displayHeight: 44,
    notes: "Uses the monochrome arched door crop from /assets/sprites/tileset_blackspace.png.",
  },
  honorsSprite: {
    id: "honorsSprite",
    sourceKey: "honors",
    displayWidth: 30,
    displayHeight: 31,
    hitboxWidth: 30,
    hitboxHeight: 31,
    directImage: true,
    sourceCrop: { x: 5, y: 7, width: 18, height: 19 },
    notes: "Uses the standalone honors.png image directly for the Leadership and Honors object.",
  },
  educationSprite: {
    id: "educationSprite",
    sourceKey: "education",
    displayWidth: 34,
    displayHeight: 34,
    hitboxWidth: 34,
    hitboxHeight: 34,
    directImage: true,
    notes: "Uses the standalone education.png image directly for the Education object.",
  },
  frameSprite: {
    id: "frameSprite",
    sourceKey: blackspaceSource,
    frameKey: "obj_picture_frame",
    displayWidth: 62,
    displayHeight: 54,
    notes: "Uses a monochrome picture-frame crop from /assets/sprites/tileset_blackspace.png.",
  },
  catSprite: {
    id: "catSprite",
    sourceKey: whitespaceSource,
    frameKey: "obj_cat_0",
    displayWidth: 58,
    displayHeight: 44,
    notes: "Uses the black cat frames from /assets/sprites/whitespace_misc.png for optional ambient use.",
  },
  lightbulbSprite: {
    id: "lightbulbSprite",
    sourceKey: whitespaceSource,
    frameKey: "obj_lightbulb",
    displayWidth: 22,
    displayHeight: 31,
    originX: 0.5,
    originY: 0,
    notes: "Uses the hanging bulb crop from /assets/sprites/whitespace_misc.png as one connected monochrome object.",
  },
  promptBoxSprite: {
    id: "promptBoxSprite",
    sourceKey: hudSource,
    frameKey: "ui_prompt_box",
    displayWidth: 430,
    displayHeight: 76,
    notes: "Uses the dialog-box crop from /assets/sprites/HUD_battleUI.png for nearby interaction prompts.",
  },
};

export type ObjectSpriteKey = keyof typeof objectSpriteMap;
