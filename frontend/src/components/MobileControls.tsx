import type { PointerEvent } from "react";
import { MobileInputState } from "../game/RoomScene";

export function MobileControls({
  setInput,
  onInteract,
  hidden = false,
}: {
  setInput: (input: MobileInputState) => void;
  onInteract: () => void;
  hidden?: boolean;
}) {
  function hold(key: keyof MobileInputState, active: boolean) {
    setInput({ up: false, down: false, left: false, right: false, [key]: active });
  }

  const bind = (key: keyof MobileInputState) => ({
    onPointerDown: (event: PointerEvent<HTMLButtonElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      hold(key, true);
    },
    onPointerUp: () => hold(key, false),
    onPointerCancel: () => hold(key, false),
    onPointerLeave: () => hold(key, false),
  });

  return (
    <div className={hidden ? "mobile-controls hidden" : "mobile-controls"} aria-label="Mobile movement controls">
      <div className="dpad">
        <button aria-label="Move up" className="pad up" type="button" {...bind("up")}>↑</button>
        <button aria-label="Move left" className="pad left" type="button" {...bind("left")}>←</button>
        <button aria-label="Move right" className="pad right" type="button" {...bind("right")}>→</button>
        <button aria-label="Move down" className="pad down" type="button" {...bind("down")}>↓</button>
      </div>
      <button aria-label="Interact" className="interact-pad" onClick={onInteract} type="button">E</button>
    </div>
  );
}
