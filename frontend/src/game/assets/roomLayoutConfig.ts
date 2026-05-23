export const roomLayout = {
  bounds: { x: 248, y: 132, width: 304, height: 190 },
  playerStart: { x: 404, y: 255 },
} as const;

export const roomObjectLayout = [
  { id: "laptop", x: 315, y: 165, width: 48, height: 44, interactionRadius: 56 },
  { id: "book", x: 444, y: 160, width: 34, height: 38, interactionRadius: 50 },
  { id: "ticket", x: 500, y: 160, width: 58, height: 36, interactionRadius: 54 },
  { id: "door", x: 172, y: 86, width: 40, height: 58, interactionRadius: 58 },
  { id: "remote", x: 100, y: 356, width: 30, height: 50, interactionRadius: 52 },
  { id: "piano", x: 486, y: 300, width: 72, height: 34, interactionRadius: 58 },
  { id: "watch", x: 356, y: 238, width: 30, height: 48, interactionRadius: 50 },
  { id: "tag", x: 652, y: 356, width: 36, height: 48, interactionRadius: 52 },
  { id: "phone", x: 440, y: 214, width: 30, height: 46, interactionRadius: 52 },
  { id: "cat", x: 170, y: 378, width: 58, height: 44, interactionRadius: 54 },
] as const;

export function getRoomObjectLayout(objectId: string) {
  return roomObjectLayout.find((item) => item.id === objectId);
}