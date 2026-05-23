export interface ObjectDialogueConfig {
  objectId: string;
  line: string;
}

export const objectDialogues: ObjectDialogueConfig[] = [
  { objectId: "laptop", line: "it hums quietly." },
  { objectId: "book", line: "there's nothing written inside." },
  { objectId: "ticket", line: "it feels half-remembered." },
  { objectId: "door", line: "you're not ready yet." },
  { objectId: "remote", line: "the signal never arrives." },
  { objectId: "piano", line: "a familiar melody lingers." },
  { objectId: "watch", line: "time has stopped here." },
  { objectId: "tag", line: "someone forgot to pick this up." },
  { objectId: "phone", line: "there's only static." },
  { objectId: "cat", line: "waiting for something to happen?" },
];

const dialogueMap = new Map(objectDialogues.map((entry) => [entry.objectId, entry.line]));

export function getObjectDialogue(objectId: string, displayName: string) {
  return dialogueMap.get(objectId) ?? `${displayName.toLowerCase()}...`;
}