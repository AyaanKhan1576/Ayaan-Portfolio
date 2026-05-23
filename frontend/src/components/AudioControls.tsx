import { Volume2, VolumeX } from "lucide-react";
import { availableMusicModes, type MusicMode } from "../hooks/useAudioSystem";

export function AudioControls({
  enabled,
  audioEnabled,
  muted,
  volume,
  musicMode,
  enableAudio,
  setMuted,
  setVolume,
  setMusicMode,
}: {
  enabled: boolean;
  audioEnabled: boolean;
  muted: boolean;
  volume: number;
  musicMode: MusicMode;
  enableAudio: () => void;
  setMuted: (value: boolean) => void;
  setVolume: (value: number) => void;
  setMusicMode: (value: MusicMode) => void;
}) {
  if (!enabled) return null;

  return (
    <div className="audio-card">
      <div className="audio-row">
        <button
          className="pixel-icon-button"
          onClick={() => (audioEnabled ? setMuted(!muted) : enableAudio())}
          title={audioEnabled && !muted ? "Mute sound" : "Enable sound"}
          type="button"
        >
          {audioEnabled && !muted ? <Volume2 size={17} /> : <VolumeX size={17} />}
        </button>
        <input
          aria-label="Volume"
          disabled={!audioEnabled}
          max="0.45"
          min="0"
          onChange={(event) => setVolume(Number(event.target.value))}
          step="0.01"
          type="range"
          value={volume}
        />
        <span>{audioEnabled && !muted ? "sound on" : "muted"}</span>
      </div>
      <div className="music-switcher" aria-label="Generated music modes">
        {availableMusicModes.map((mode) => (
          <button
            className={musicMode === mode.id ? "selected" : ""}
            key={mode.id}
            onClick={() => setMusicMode(mode.id)}
            type="button"
          >
            {mode.label}
          </button>
        ))}
      </div>
    </div>
  );
}
