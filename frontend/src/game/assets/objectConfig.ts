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
    displayName: "About Me",
    label: "ABOUT ME",
    assetKey: "laptopSprite",
    ...roomObjectLayout.find((item) => item.id === "laptop")!,
    interactionPrompt: "About Me - press E.",
    actionType: "menu",
    targetSection: "about",
    color: 0xffffff,
    accent: 0x111111,
  },
  {
    id: "book",
    displayName: "Skills",
    label: "SKILLS",
    assetKey: "educationSprite",
    ...roomObjectLayout.find((item) => item.id === "book")!,
    interactionPrompt: "Skills - press E.",
    actionType: "menu",
    targetSection: "skills",
    color: 0xffffff,
    accent: 0x111111,
  },
  {
    id: "ticket",
    displayName: "Featured Projects",
    label: "FEATURED PROJECTS",
    assetKey: "ticketSprite",
    ...roomObjectLayout.find((item) => item.id === "ticket")!,
    interactionPrompt: "Featured Projects - press E.",
    actionType: "menu",
    targetSection: "featured",
    color: 0xffffff,
    accent: 0x111111,
  },
  {
    id: "door",
    displayName: "All Projects",
    label: "ALL PROJECTS",
    assetKey: "doorSprite",
    ...roomObjectLayout.find((item) => item.id === "door")!,
    interactionPrompt: "All Projects - press E.",
    actionType: "menu",
    targetSection: "projects",
    color: 0xffffff,
    accent: 0x111111,
  },
  {
    id: "piano",
    displayName: "Leadership and Honors",
    label: "LEADERSHIP AND HONORS",
    assetKey: "honorsSprite",
    ...roomObjectLayout.find((item) => item.id === "piano")!,
    interactionRadius: 34,
    interactionPrompt: "Leadership and Honors - press E.",
    actionType: "menu",
    targetSection: "media",
    color: 0xffffff,
    accent: 0x111111,
  },
  {
    id: "education",
    displayName: "Education",
    label: "EDUCATION",
    assetKey: "bookSprite",
    ...roomObjectLayout.find((item) => item.id === "education")!,
    interactionPrompt: "Education - press E.",
    actionType: "menu",
    targetSection: "education",
    color: 0xffffff,
    accent: 0x111111,
  },
  {
    id: "watch",
    displayName: "Experience",
    label: "EXPERIENCE",
    assetKey: "watchSprite",
    ...roomObjectLayout.find((item) => item.id === "watch")!,
    interactionPrompt: "Experience - press E.",
    actionType: "menu",
    targetSection: "experience",
    color: 0xffffff,
    accent: 0x111111,
  },
  {
    id: "tag",
    displayName: "Resume",
    label: "RESUME",
    assetKey: "tagSprite",
    ...roomObjectLayout.find((item) => item.id === "tag")!,
    interactionPrompt: "Resume - press E.",
    actionType: "menu",
    targetSection: "resume",
    color: 0xffffff,
    accent: 0x111111,
  },
  {
    id: "phone",
    displayName: "Contact",
    label: "CONTACT",
    assetKey: "phoneSprite",
    ...roomObjectLayout.find((item) => item.id === "phone")!,
    interactionPrompt: "Contact - press E.",
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
