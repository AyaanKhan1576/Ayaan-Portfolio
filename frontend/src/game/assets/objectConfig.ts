import type { RoomObject } from "../../types";
import { roomObjectLayout } from "./roomLayoutConfig";
import type { ObjectSpriteKey } from "./spriteConfig";

export interface InteractableObjectConfig {
  id: string;
  displayName: string;
  label: string;
  assetKey: ObjectSpriteKey;
  x: number;
  y: number;
  width: number;
  height: number;
  interactionRadius: number;
  interactionPrompt: string;
  actionType: RoomObject["interaction_type"];
  targetSection: RoomObject["linked_portfolio_section"];
  color: number;
  accent: number;
}

export const interactableObjects: InteractableObjectConfig[] = [
  {
    id: "laptop",
    displayName: "Laptop",
    label: "ABOUT",
    assetKey: "laptopSprite",
    ...roomObjectLayout.find((item) => item.id === "laptop")!,
    interactionPrompt: "Laptop - press E.",
    actionType: "dialogue",
    targetSection: "about",
    color: 0xffffff,
    accent: 0x111111,
  },
  {
    id: "book",
    displayName: "Book",
    label: "SKILLS",
    assetKey: "bookSprite",
    ...roomObjectLayout.find((item) => item.id === "book")!,
    interactionPrompt: "Book - press E.",
    actionType: "menu",
    targetSection: "skills",
    color: 0xffffff,
    accent: 0x111111,
  },
  {
    id: "ticket",
    displayName: "Ticket",
    label: "FEATURED",
    assetKey: "ticketSprite",
    ...roomObjectLayout.find((item) => item.id === "ticket")!,
    interactionPrompt: "Ticket - press E.",
    actionType: "menu",
    targetSection: "featured",
    color: 0xffffff,
    accent: 0x111111,
  },
  {
    id: "door",
    displayName: "Door",
    label: "PROJECTS",
    assetKey: "doorSprite",
    ...roomObjectLayout.find((item) => item.id === "door")!,
    interactionPrompt: "Door - press E.",
    actionType: "menu",
    targetSection: "projects",
    color: 0xffffff,
    accent: 0x111111,
  },
  {
    id: "remote",
    displayName: "Remote",
    label: "SIM",
    assetKey: "remoteSprite",
    ...roomObjectLayout.find((item) => item.id === "remote")!,
    interactionPrompt: "Remote - press E.",
    actionType: "menu",
    targetSection: "simulations",
    color: 0xffffff,
    accent: 0x111111,
  },
  {
    id: "piano",
    displayName: "Piano",
    label: "MEDIA",
    assetKey: "pianoSprite",
    ...roomObjectLayout.find((item) => item.id === "piano")!,
    interactionPrompt: "Piano - press E.",
    actionType: "menu",
    targetSection: "media",
    color: 0xffffff,
    accent: 0x111111,
  },
  {
    id: "watch",
    displayName: "Watch",
    label: "LOGS",
    assetKey: "watchSprite",
    ...roomObjectLayout.find((item) => item.id === "watch")!,
    interactionPrompt: "Watch - press E.",
    actionType: "menu",
    targetSection: "experience",
    color: 0xffffff,
    accent: 0x111111,
  },
  {
    id: "tag",
    displayName: "Tag",
    label: "RESUME",
    assetKey: "tagSprite",
    ...roomObjectLayout.find((item) => item.id === "tag")!,
    interactionPrompt: "Tag - press E.",
    actionType: "menu",
    targetSection: "resume",
    color: 0xffffff,
    accent: 0x111111,
  },
  {
    id: "phone",
    displayName: "Phone",
    label: "CONTACT",
    assetKey: "phoneSprite",
    ...roomObjectLayout.find((item) => item.id === "phone")!,
    interactionPrompt: "Phone - press E.",
    actionType: "menu",
    targetSection: "contact",
    color: 0xffffff,
    accent: 0x111111,
  },
  {
    id: "cat",
    displayName: "Fluff",
    label: "FLUFF",
    assetKey: "catSprite",
    ...roomObjectLayout.find((item) => item.id === "cat")!,
    interactionPrompt: "Fluff - press E.",
    actionType: "dialogue",
    targetSection: "intro",
    color: 0xffffff,
    accent: 0x111111,
  },
];

export const roomObjects: RoomObject[] = interactableObjects.map((object) => ({
  object_id: object.id,
  display_name: object.displayName,
  position: { x: object.x, y: object.y },
  size: { width: object.width, height: object.height },
  interaction_radius: object.interactionRadius,
  interaction_type: object.actionType,
  linked_portfolio_section: object.targetSection,
  color: object.color,
  accent: object.accent,
  label: object.label,
  assetKey: object.assetKey,
  interactionPrompt: object.interactionPrompt,
}));
