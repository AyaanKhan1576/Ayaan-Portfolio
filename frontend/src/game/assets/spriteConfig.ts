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
  frameKey: string;
  displayWidth: number;
  displayHeight: number;
  originX?: number;
  originY?: number;
  blendMode?: "normal" | "difference";
  notes: string;
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

// The walk section is arranged by row: up/back, right, left, down/front.
// Only three walk frames are used because the fourth column in the raw sheet belongs to the run set.
export const playerSprite = {
  sourceKey: playerSource,
  width: 32,
  height: 34,
  scale: 1.55,
  originX: 0.5,
  originY: 1,
  fallbackAssumption: "If the sheet changes, preserve row-based directional crops so movement never uses the wrong facing direction.",
  animations: {
    idleUp: ["player_idle_up"],
    idleRight: ["player_idle_right"],
    idleLeft: ["player_idle_left"],
    idleDown: ["player_idle_down"],
    walkUp: ["player_walk_up_0", "player_walk_up_1", "player_walk_up_2"],
    walkRight: ["player_walk_right_0", "player_walk_right_1", "player_walk_right_2"],
    walkLeft: ["player_walk_left_0", "player_walk_left_1", "player_walk_left_2"],
    walkDown: ["player_walk_down_0", "player_walk_down_1", "player_walk_down_2"],
  } satisfies PlayerAnimationFrames,
};

export const croppedFrames: CroppedFrameConfig[] = [
  { key: "player_idle_up", sourceKey: playerSource, x: 0, y: 16, width: 32, height: 34 },
  { key: "player_walk_up_0", sourceKey: playerSource, x: 0, y: 16, width: 32, height: 34 },
  { key: "player_walk_up_1", sourceKey: playerSource, x: 33, y: 16, width: 32, height: 34 },
  { key: "player_walk_up_2", sourceKey: playerSource, x: 66, y: 16, width: 32, height: 34 },

  { key: "player_idle_right", sourceKey: playerSource, x: 0, y: 49, width: 32, height: 34 },
  { key: "player_walk_right_0", sourceKey: playerSource, x: 0, y: 49, width: 32, height: 34 },
  { key: "player_walk_right_1", sourceKey: playerSource, x: 33, y: 49, width: 32, height: 34 },
  { key: "player_walk_right_2", sourceKey: playerSource, x: 66, y: 49, width: 32, height: 34 },

  { key: "player_idle_left", sourceKey: playerSource, x: 0, y: 82, width: 32, height: 34 },
  { key: "player_walk_left_0", sourceKey: playerSource, x: 0, y: 82, width: 32, height: 34 },
  { key: "player_walk_left_1", sourceKey: playerSource, x: 33, y: 82, width: 32, height: 34 },
  { key: "player_walk_left_2", sourceKey: playerSource, x: 66, y: 82, width: 32, height: 34 },

  { key: "player_idle_down", sourceKey: playerSource, x: 0, y: 115, width: 32, height: 34 },
  { key: "player_walk_down_0", sourceKey: playerSource, x: 0, y: 115, width: 32, height: 34 },
  { key: "player_walk_down_1", sourceKey: playerSource, x: 33, y: 115, width: 32, height: 34 },
  { key: "player_walk_down_2", sourceKey: playerSource, x: 66, y: 115, width: 32, height: 34 },

  { key: "obj_cat_0", sourceKey: whitespaceSource, x: 96, y: 8, width: 32, height: 24 },
  { key: "obj_cat_1", sourceKey: whitespaceSource, x: 128, y: 8, width: 32, height: 24 },
  { key: "obj_lightbulb", sourceKey: whitespaceSource, x: 286, y: 124, width: 28, height: 36 },

  // White-on-black charm crops are rendered with difference blending so they become black sketches on the white room.
  { key: "obj_about_laptop", sourceKey: charmSource, x: 548, y: 305, width: 108, height: 80 },
  { key: "obj_skills_book", sourceKey: charmSource, x: 0, y: 385, width: 88, height: 86 },
  { key: "obj_featured_ticket", sourceKey: charmSource, x: 92, y: 195, width: 112, height: 72 },
  { key: "obj_sim_remote", sourceKey: charmSource, x: 664, y: 4, width: 84, height: 86 },
  { key: "obj_media_headphones", sourceKey: charmSource, x: 0, y: 670, width: 84, height: 84 },
  { key: "obj_experience_watch", sourceKey: charmSource, x: 8, y: 8, width: 74, height: 82 },
  { key: "obj_resume_tag", sourceKey: charmSource, x: 560, y: 386, width: 92, height: 78 },
  { key: "obj_contact_phone", sourceKey: charmSource, x: 92, y: 388, width: 86, height: 82 },

  { key: "obj_projects_door", sourceKey: blackspaceSource, x: 604, y: 916, width: 64, height: 94 },
  { key: "obj_media_piano", sourceKey: blackspaceSource, x: 0, y: 824, width: 150, height: 70 },
  { key: "obj_picture_frame", sourceKey: blackspaceSource, x: 686, y: 1352, width: 86, height: 74 },

  { key: "ui_prompt_box", sourceKey: hudSource, x: 18, y: 1186, width: 394, height: 96 },
];

export const objectSpriteMap = {
  laptopSprite: {
    id: "laptopSprite",
    sourceKey: charmSource,
    frameKey: "obj_about_laptop",
    displayWidth: 80,
    displayHeight: 58,
    blendMode: "difference",
    notes: "Uses the laptop charm from /assets/sprites/items_charms.png with difference blend for black-on-white line art.",
  },
  bookSprite: {
    id: "bookSprite",
    sourceKey: charmSource,
    frameKey: "obj_skills_book",
    displayWidth: 54,
    displayHeight: 58,
    blendMode: "difference",
    notes: "Uses the closed book charm from /assets/sprites/items_charms.png.",
  },
  ticketSprite: {
    id: "ticketSprite",
    sourceKey: charmSource,
    frameKey: "obj_featured_ticket",
    displayWidth: 86,
    displayHeight: 56,
    blendMode: "difference",
    notes: "Uses the ticket/coupon charm as a featured-project memory marker.",
  },
  remoteSprite: {
    id: "remoteSprite",
    sourceKey: charmSource,
    frameKey: "obj_sim_remote",
    displayWidth: 42,
    displayHeight: 72,
    blendMode: "difference",
    notes: "Uses the remote charm as the Simulation Bay launcher.",
  },
  headphonesSprite: {
    id: "headphonesSprite",
    sourceKey: charmSource,
    frameKey: "obj_media_headphones",
    displayWidth: 62,
    displayHeight: 62,
    blendMode: "difference",
    notes: "Uses the headphones charm for media/demo content.",
  },
  watchSprite: {
    id: "watchSprite",
    sourceKey: charmSource,
    frameKey: "obj_experience_watch",
    displayWidth: 48,
    displayHeight: 62,
    blendMode: "difference",
    notes: "Uses the watch charm for the experience timeline.",
  },
  tagSprite: {
    id: "tagSprite",
    sourceKey: charmSource,
    frameKey: "obj_resume_tag",
    displayWidth: 54,
    displayHeight: 58,
    blendMode: "difference",
    notes: "Uses the tag charm as the resume marker.",
  },
  phoneSprite: {
    id: "phoneSprite",
    sourceKey: charmSource,
    frameKey: "obj_contact_phone",
    displayWidth: 48,
    displayHeight: 62,
    blendMode: "difference",
    notes: "Uses the phone charm for contact.",
  },
  doorSprite: {
    id: "doorSprite",
    sourceKey: blackspaceSource,
    frameKey: "obj_projects_door",
    displayWidth: 58,
    displayHeight: 86,
    notes: "Uses the monochrome arched door crop from /assets/sprites/tileset_blackspace.png.",
  },
  pianoSprite: {
    id: "pianoSprite",
    sourceKey: blackspaceSource,
    frameKey: "obj_media_piano",
    displayWidth: 110,
    displayHeight: 52,
    notes: "Uses the monochrome piano crop from /assets/sprites/tileset_blackspace.png.",
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
    displayWidth: 30,
    displayHeight: 45,
    originX: 0.5,
    originY: 0.1,
    notes: "Uses the downloaded hanging bulb crop from /assets/sprites/whitespace_misc.png.",
  },
  promptBoxSprite: {
    id: "promptBoxSprite",
    sourceKey: hudSource,
    frameKey: "ui_prompt_box",
    displayWidth: 260,
    displayHeight: 64,
    notes: "Uses the dialog-box crop from /assets/sprites/HUD_battleUI.png for nearby interaction prompts.",
  },
} satisfies Record<string, ObjectSpriteConfig>;

export type ObjectSpriteKey = keyof typeof objectSpriteMap;
