export const roomLayout = {
  bounds: { x: 248, y: 132, width: 304, height: 190 },
  playerStart: { x: 404, y: 255 },
} as const;

export const roomObjectLayout = [
  { id: "laptop", x: 286, y: 156, width: 48, height: 44, interactionRadius: 56 },
  { id: "book", x: 398, y: 156, width: 34, height: 38, interactionRadius: 50 },
  { id: "ticket", x: 474, y: 156, width: 58, height: 36, interactionRadius: 54 },
  { id: "door", x: 150, y: 60, width: 40, height: 58, interactionRadius: 58 },
  { id: "remote", x: 96, y: 350, width: 30, height: 50, interactionRadius: 52 },
  { id: "piano", x: 372, y: 274, width: 72, height: 34, interactionRadius: 58 },
  { id: "watch", x: 286, y: 232, width: 30, height: 48, interactionRadius: 50 },
  { id: "tag", x: 650, y: 350, width: 36, height: 48, interactionRadius: 52 },
  { id: "phone", x: 586, y: 210, width: 30, height: 46, interactionRadius: 52 },
  { id: "cat", x: 172, y: 380, width: 58, height: 44, interactionRadius: 54 },
] as const;

export function getRoomObjectLayout(objectId: string) {
  return roomObjectLayout.find((item) => item.id === objectId);
}