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
  laptop: "it hums quietly.",
  book: "there's nothing written inside.",
  ticket: "it feels half-remembered.",
  door: "you're not ready yet.",
  education: "old notes still remember the answers.",
  piano: "a familiar melody lingers.",
  watch: "time has stopped here.",
  tag: "someone forgot to pick this up.",
  phone: "there's only static.",
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
  return object.object_id !== "cat" && object.interaction_type !== "dialogue";
}