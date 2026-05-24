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
    ...roomObjectLayout.find((item) => item.id === "laptop")!,
    id: "laptop",
    displayName: "About Me",
    label: "ABOUT ME",
    assetKey: "laptopSprite",
    interactionPrompt: "About Me - press E.",
    actionType: "menu",
    targetSection: "about",
    color: 0xffffff,
    accent: 0x111111,
  },
  {
    ...roomObjectLayout.find((item) => item.id === "phone")!,
    id: "phone",
    displayName: "Contact",
    label: "CONTACT",
    assetKey: "phoneSprite",
    interactionPrompt: "Contact - press E.",
    actionType: "menu",
    targetSection: "contact",
    color: 0xffffff,
    accent: 0x111111,
  },
  {
    ...roomObjectLayout.find((item) => item.id === "tag")!,
    id: "tag",
    displayName: "Resume",
    label: "RESUME",
    assetKey: "tagSprite",
    interactionPrompt: "Resume - press E.",
    actionType: "menu",
    targetSection: "resume",
    color: 0xffffff,
    accent: 0x111111,
  },
  {
    ...roomObjectLayout.find((item) => item.id === "education")!,
    id: "education",
    displayName: "Education",
    label: "EDUCATION",
    assetKey: "bookSprite",
    interactionPrompt: "Education - press E.",
    actionType: "menu",
    targetSection: "education",
    color: 0xffffff,
    accent: 0x111111,
  },
  {
    ...roomObjectLayout.find((item) => item.id === "watch")!,
    id: "watch",
    displayName: "Experience",
    label: "EXPERIENCE",
    assetKey: "watchSprite",
    interactionPrompt: "Experience - press E.",
    actionType: "menu",
    targetSection: "experience",
    color: 0xffffff,
    accent: 0x111111,
  },
  {
    ...roomObjectLayout.find((item) => item.id === "ticket")!,
    id: "ticket",
    displayName: "Featured Projects",
    label: "FEATURED PROJECTS",
    assetKey: "ticketSprite",
    interactionPrompt: "Featured Projects - press E.",
    actionType: "menu",
    targetSection: "featured",
    color: 0xffffff,
    accent: 0x111111,
  },
  {
    ...roomObjectLayout.find((item) => item.id === "book")!,
    id: "book",
    displayName: "Skills",
    label: "SKILLS",
    assetKey: "educationSprite",
    interactionPrompt: "Skills - press E.",
    actionType: "menu",
    targetSection: "skills",
    color: 0xffffff,
    accent: 0x111111,
  },
  {
    ...roomObjectLayout.find((item) => item.id === "door")!,
    id: "door",
    displayName: "All Projects",
    label: "ALL PROJECTS",
    assetKey: "doorSprite",
    interactionPrompt: "All Projects - press E.",
    actionType: "menu",
    targetSection: "projects",
    color: 0xffffff,
    accent: 0x111111,
  },
  {
    ...roomObjectLayout.find((item) => item.id === "piano")!,
    id: "piano",
    displayName: "Leadership and Honors",
    label: "LEADERSHIP AND HONORS",
    assetKey: "honorsSprite",
    interactionRadius: 34,
    interactionPrompt: "Leadership and Honors - press E.",
    actionType: "menu",
    targetSection: "media",
    color: 0xffffff,
    accent: 0x111111,
  },
  {
    ...roomObjectLayout.find((item) => item.id === "cat")!,
    id: "cat",
    displayName: "Fluff",
    label: "FLUFF",
    assetKey: "catSprite",
    interactionPrompt: "Fluff - press E.",
    actionType: "dialogue",
    targetSection: "fluff",
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
