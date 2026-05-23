import { MobileInputState } from "../game/RoomScene";

export function MobileControls({
  setInput,
  onInteract,
}: {
  setInput: (input: MobileInputState) => void;
  onInteract: () => void;
}) {
  function hold(key: keyof MobileInputState, active: boolean) {
    setInput({ up: false, down: false, left: false, right: false, [key]: active });
  }

  const bind = (key: keyof MobileInputState) => ({
    onPointerDown: () => hold(key, true),
    onPointerUp: () => hold(key, false),
    onPointerLeave: () => hold(key, false),
  });

  return (
    <div className="mobile-controls" aria-label="Mobile movement controls">
      <div className="dpad">
        <button className="pad up" type="button" {...bind("up")}>↑</button>
        <button className="pad left" type="button" {...bind("left")}>←</button>
        <button className="pad right" type="button" {...bind("right")}>→</button>
        <button className="pad down" type="button" {...bind("down")}>↓</button>
      </div>
      <button className="interact-pad" onClick={onInteract} type="button">E</button>
    </div>
  );
}
