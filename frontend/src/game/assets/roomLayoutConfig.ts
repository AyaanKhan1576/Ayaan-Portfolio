export const roomLayout = {
  bounds: { x: 248, y: 132, width: 304, height: 190 },
  playerStart: { x: 404, y: 255 },
} as const;

export const roomObjectLayout = [
  { id: "laptop", x: 256, y: 136, width: 48, height: 44, interactionRadius: 56 },
  { id: "book", x: 268, y: 206, width: 34, height: 38, interactionRadius: 50 },
  { id: "ticket", x: 500, y: 150, width: 58, height: 36, interactionRadius: 54 },
  { id: "door", x: 150, y: 60, width: 40, height: 58, interactionRadius: 58 },
  { id: "remote", x: 612, y: 96, width: 30, height: 50, interactionRadius: 52 },
  { id: "piano", x: 470, y: 282, width: 72, height: 34, interactionRadius: 58 },
  { id: "watch", x: 294, y: 232, width: 30, height: 48, interactionRadius: 50 },
  { id: "tag", x: 540, y: 246, width: 36, height: 48, interactionRadius: 52 },
  { id: "phone", x: 606, y: 214, width: 30, height: 46, interactionRadius: 52 },
  { id: "cat", x: 176, y: 308, width: 58, height: 44, interactionRadius: 54 },
] as const;

export function getRoomObjectLayout(objectId: string) {
  return roomObjectLayout.find((item) => item.id === objectId);
}