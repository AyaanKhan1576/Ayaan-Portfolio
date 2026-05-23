import Phaser from "phaser";
import { useEffect, useRef } from "react";
import { roomObjects } from "../game/assets/objectConfig";
import { MobileInputState, RoomScene } from "../game/RoomScene";
import type { RoomObject } from "../types";

export function GameRoom({
  onNearbyChange,
  onHoverChange,
  onInteract,
  mobileInput,
  interactSignal,
}: {
  onNearbyChange: (object: RoomObject | null) => void;
  onHoverChange: (object: RoomObject | null) => void;
  onInteract: (object: RoomObject) => void;
  mobileInput: MobileInputState;
  interactSignal: number;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<RoomScene | null>(null);
  const callbacksRef = useRef({ onNearbyChange, onHoverChange, onInteract });

  useEffect(() => {
    callbacksRef.current = { onNearbyChange, onHoverChange, onInteract };
  }, [onHoverChange, onInteract, onNearbyChange]);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new RoomScene(roomObjects, {
      onNearbyChange: (object) => callbacksRef.current.onNearbyChange(object),
      onHoverChange: (object) => callbacksRef.current.onHoverChange(object),
      onInteract: (object) => callbacksRef.current.onInteract(object),
    });
    sceneRef.current = scene;

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: 800,
      height: 450,
      backgroundColor: "#1d1a25",
      pixelArt: true,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene,
    });

    return () => {
      sceneRef.current = null;
      game.destroy(true);
    };
  }, []);

  useEffect(() => {
    sceneRef.current?.setMobileInput(mobileInput);
  }, [mobileInput]);

  useEffect(() => {
    if (interactSignal > 0) {
      sceneRef.current?.interactWithNearby();
    }
  }, [interactSignal]);

  return <div className="game-shell" ref={containerRef} />;
}
