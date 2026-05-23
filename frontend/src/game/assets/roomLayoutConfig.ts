export const roomLayout = {
  bounds: { x: 248, y: 132, width: 304, height: 190 },
  playerStart: { x: 404, y: 255 },
} as const;

export const roomObjectLayout = [
  { id: "laptop", x: 256, y: 136, width: 48, height: 44, interactionRadius: 56 },
  { id: "book", x: 610, y: 82, width: 34, height: 38, interactionRadius: 50 },
  { id: "ticket", x: 160, y: 206, width: 58, height: 36, interactionRadius: 54 },
  { id: "door", x: 150, y: 60, width: 40, height: 58, interactionRadius: 58 },
  { id: "education", x: 490, y: 150, width: 36, height: 36, interactionRadius: 48 },
  { id: "piano", x: 550, y: 282, width: 72, height: 34, interactionRadius: 58 },
  { id: "watch", x: 250, y: 272, width: 30, height: 48, interactionRadius: 50 },
  { id: "tag", x: 480, y: 266, width: 36, height: 48, interactionRadius: 52 },
  { id: "phone", x: 396, y: 140, width: 30, height: 46, interactionRadius: 52 },
  { id: "cat", x: 76, y: 308, width: 58, height: 44, interactionRadius: 54 },
] as const;

export function getRoomObjectLayout(objectId: string) {
  return roomObjectLayout.find((item) => item.id === objectId);
}