import type { RoomObject } from "../../types";

export type InteractionSource = "nearby" | "hover";
export type InteractionMode = "portfolio" | "dialogue";

export interface InteractionPreview {
  objectId: string;
  title: string;
  text: string;
  prompt: string;
  mode: InteractionMode;
}

const dialogueLines: Record<string, string> = {
  laptop: "some parts are harder to explain than others.",
  book: "your hands remember before your mind does.",
  ticket: "there’s a story behind each one.",
  door: "you kept everything anyway.",
  education: "the pages still smell like sleepless nights.",
  piano: "old memories still linger here.",
  watch: "time passed differently here.",
  tag: "there’s more between the lines than on them.",
  phone: "the line is still open.",
  cat: "waiting for something to happen?",
};

export function getInteractionPreview(object: RoomObject, source: InteractionSource): InteractionPreview {
  const isDialogueOnly = object.object_id === "cat" || object.interaction_type === "dialogue";
  return {
    objectId: object.object_id,
    title: object.display_name,
    text: dialogueLines[object.object_id] ?? `${object.display_name.toLowerCase()}...`,
    prompt: isDialogueOnly ? "Press E" : source === "hover" ? "Click to open" : "Press E",
    mode: isDialogueOnly ? "dialogue" : "portfolio",
  };
}

export function opensPortfolio(object: RoomObject) {
  return object.object_id === "cat" || object.interaction_type !== "dialogue";
}
