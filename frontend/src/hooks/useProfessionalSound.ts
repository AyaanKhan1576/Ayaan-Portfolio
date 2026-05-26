import { useCallback, useEffect, useRef, useState } from "react";

type Tone = "hover" | "select" | "transition";

const STORAGE_KEY = "ayaan-professional-sound";

export function useProfessionalSound() {
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(STORAGE_KEY) === "on";
  });
  const contextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off");
  }, [enabled]);

  const play = useCallback(
    (tone: Tone) => {
      if (!enabled || typeof window === "undefined") return;

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      const context = contextRef.current ?? new AudioCtx();
      contextRef.current = context;

      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const now = context.currentTime;
      const frequency = tone === "hover" ? 176 : tone === "select" ? 264 : 220;
      const duration = tone === "transition" ? 0.22 : 0.12;

      oscillator.type = tone === "select" ? "triangle" : "sine";
      oscillator.frequency.setValueAtTime(frequency, now);
      oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.35, now + duration);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.035, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + duration + 0.03);
    },
    [enabled],
  );

  const toggleSound = useCallback(() => setEnabled((value) => !value), []);

  return {
    enabled,
    soundEnabled: enabled,
    toggle: toggleSound,
    toggleSound,
    play,
    playHover: () => play("hover"),
    playSelect: () => play("select"),
    playTransition: () => play("transition"),
  };
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
