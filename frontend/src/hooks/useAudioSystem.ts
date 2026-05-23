import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { audioManager } from "../game/assets/AudioManager";
import { musicTracks } from "../game/assets/audioConfig";

export type SoundType =
  | "boot"
  | "hover"
  | "click"
  | "menuOpen"
  | "menuClose"
  | "prompt"
  | "door"
  | "reward"
  | "blocked"
  | "piano"
  | "cat"
  | "laptop"
  | "page";
export type MusicMode = string;

export const availableMusicModes = musicTracks.length
  ? musicTracks.map((track) => ({ id: track.key, label: track.label }))
  : [
      { id: "generated_quiet_white", label: "Quiet White" },
      { id: "generated_dream_hum", label: "Dream Hum" },
      { id: "generated_memory_bell", label: "Memory Bell" },
    ];

export function useAudioSystem(enabled: boolean) {
  const fallbackContextRef = useRef<AudioContext | null>(null);
  const fallbackMusicRef = useRef<{ oscillators: OscillatorNode[]; gain: GainNode } | null>(null);
  const generatedSoundsRef = useRef<Set<{ oscillator: OscillatorNode; gain: GainNode }>>(new Set());
  const initialPreferences = audioManager.getPreferences();
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [muted, setMutedState] = useState(() => initialPreferences.muted);
  const [volume, setVolumeState] = useState(() => initialPreferences.masterVolume);
  const [musicMode, setMusicModeState] = useState<MusicMode>(() => initialPreferences.musicKey || availableMusicModes[0]?.id || "");

  useEffect(() => {
    audioManager.preload();
  }, []);

  const ensureFallbackContext = useCallback(() => {
    if (!enabled) return null;
    try {
      fallbackContextRef.current ??= new AudioContext();
      return fallbackContextRef.current;
    } catch {
      return null;
    }
  }, [enabled]);

  const stopFallbackMusic = useCallback(() => {
    const nodes = fallbackMusicRef.current;
    if (!nodes) return;
    try {
      nodes.gain.gain.setTargetAtTime(0.0001, nodes.gain.context.currentTime, 0.08);
      nodes.oscillators.forEach((oscillator) => oscillator.stop(nodes.gain.context.currentTime + 0.18));
    } catch {
      // Audio failure must not affect the UI.
    } finally {
      fallbackMusicRef.current = null;
    }
  }, []);

  const stopGeneratedSounds = useCallback(() => {
    for (const sound of generatedSoundsRef.current) {
      try {
        sound.gain.gain.setTargetAtTime(0.0001, sound.gain.context.currentTime, 0.04);
        sound.oscillator.stop(sound.gain.context.currentTime + 0.08);
      } catch {
        // Audio failures must not affect the UI.
      }
      try {
        sound.oscillator.disconnect();
        sound.gain.disconnect();
      } catch {
        // Ignore cleanup failures.
      }
    }
    generatedSoundsRef.current.clear();
  }, []);

  const startFallbackMusic = useCallback(() => {
    const context = ensureFallbackContext();
    if (!context || muted || !audioEnabled) return;
    stopFallbackMusic();

    const generatedModes: Record<string, [number, number]> = {
      generated_quiet_white: [174.61, 261.63],
      generated_dream_hum: [196, 293.66],
      generated_memory_bell: [220, 329.63],
    };
    const frequencies = generatedModes[musicMode] ?? generatedModes.generated_quiet_white;
    const gain = context.createGain();
    gain.gain.value = volume * 0.12;
    const oscillators = frequencies.map((frequency) => {
      const oscillator = context.createOscillator();
      oscillator.frequency.value = frequency;
      oscillator.type = "sine";
      oscillator.connect(gain);
      oscillator.start();
      return oscillator;
    });
    gain.connect(context.destination);
    fallbackMusicRef.current = { oscillators, gain };
  }, [audioEnabled, ensureFallbackContext, musicMode, muted, stopFallbackMusic, volume]);

  const startMusic = useCallback(async () => {
    if (!enabled || muted || !audioEnabled) return;
    const played = await audioManager.loopMusic(musicMode);
    if (!played) startFallbackMusic();
  }, [audioEnabled, enabled, musicMode, muted, startFallbackMusic]);

  useEffect(() => {
    if (audioEnabled && !muted) {
      void startMusic();
    } else {
      audioManager.stopMusic();
      stopFallbackMusic();
      stopGeneratedSounds();
    }
    return () => {
      audioManager.stopMusic();
      stopFallbackMusic();
      stopGeneratedSounds();
    };
  }, [audioEnabled, muted, musicMode, startMusic, stopFallbackMusic, stopGeneratedSounds]);

  const enableAudio = useCallback(async () => {
    if (!enabled) return;
    try {
      await ensureFallbackContext()?.resume();
      setAudioEnabled(true);
      setMutedState(false);
      audioManager.setMuted(false);
      void startMusic();
    } catch {
      setAudioEnabled(false);
    }
  }, [enabled, ensureFallbackContext, startMusic]);

  const setMuted = useCallback((value: boolean) => {
    setMutedState(value);
    if (value) {
      stopFallbackMusic();
      stopGeneratedSounds();
    }
    audioManager.setMuted(value);
  }, [stopFallbackMusic, stopGeneratedSounds]);

  const setVolume = useCallback((value: number) => {
    setVolumeState(value);
    audioManager.setMasterVolume(value);
  }, []);

  const setMusicMode = useCallback((value: MusicMode) => {
    setMusicModeState(value);
    if (!muted && audioEnabled) {
      void audioManager.loopMusic(value);
    }
  }, [audioEnabled, muted]);

  const playGeneratedClick = useCallback((type: SoundType) => {
    if (!audioEnabled || muted) return;
    const context = ensureFallbackContext();
    if (!context) return;
    try {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const frequencies: Record<SoundType, number> = {
        boot: 180,
        hover: 620,
        click: 420,
        menuOpen: 330,
        menuClose: 260,
        prompt: 520,
        door: 140,
        reward: 740,
        blocked: 120,
        piano: 262,
        cat: 520,
        laptop: 330,
        page: 300,
      };
      oscillator.frequency.value = frequencies[type];
      oscillator.type = type === "boot" ? "sine" : "triangle";
      gain.gain.setValueAtTime(volume * 0.3, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.12);
      const sound = { oscillator, gain };
      generatedSoundsRef.current.add(sound);
      const cleanup = () => {
        generatedSoundsRef.current.delete(sound);
        try {
          oscillator.disconnect();
          gain.disconnect();
        } catch {
          // Ignore cleanup failures.
        }
      };
      oscillator.addEventListener("ended", cleanup, { once: true });
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.13);
    } catch {
      // Ignore audio failures.
    }
  }, [audioEnabled, ensureFallbackContext, muted, volume]);

  const play = useCallback(
    (type: SoundType) => {
      const soundMap: Partial<Record<SoundType, Parameters<typeof audioManager.playNamedSfx>[0]>> = {
        hover: "hover",
        click: "click",
        boot: "prompt",
        menuOpen: "page",
        menuClose: "page",
        prompt: "prompt",
        door: "door",
        reward: "reward",
        blocked: "blocked",
        piano: "piano",
        cat: "cat",
        laptop: "laptop",
        page: "page",
      };
      void audioManager.playNamedSfx(soundMap[type] ?? "click").then((played) => {
        if (!played) playGeneratedClick(type);
      });
    },
    [playGeneratedClick],
  );

  return useMemo(
    () => ({
      audioEnabled,
      muted,
      volume,
      musicMode,
      enableAudio,
      setMuted,
      setVolume,
      setMusicMode,
      play,
    }),
    [audioEnabled, enableAudio, musicMode, muted, play, setMuted, setMusicMode, setVolume, volume],
  );
}
