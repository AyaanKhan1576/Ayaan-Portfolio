import { audioTracks, musicTracks, uiSounds, type AudioTrackConfig } from "./audioConfig";

export interface AudioPreferences {
  muted: boolean;
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  musicKey: string;
}

const defaultPreferences: AudioPreferences = {
  muted: true,
  masterVolume: 0.38,
  musicVolume: 0.18,
  sfxVolume: 0.7,
  musicKey: musicTracks.find((track) => /whitespace piano/i.test(track.label))?.key ?? musicTracks.find((track) => /white space|piano/i.test(track.label))?.key ?? musicTracks[0]?.key ?? "",
};

export class AudioManager {
  private tracks = new Map<string, AudioTrackConfig>();
  private elements = new Map<string, HTMLAudioElement>();
  private currentMusic: HTMLAudioElement | null = null;
  private preferences: AudioPreferences;

  constructor() {
    audioTracks.forEach((track) => this.tracks.set(track.key, track));
    this.preferences = this.loadPreferences();
  }

  preload() {
    for (const track of this.tracks.values()) {
      if (this.elements.has(track.key)) continue;
      try {
        const element = new Audio(track.path);
        element.preload = "auto";
        element.loop = track.loop;
        element.volume = 0;
        element.addEventListener("error", () => {
          console.warn(`Audio asset failed to load: ${track.key}`);
          this.elements.delete(track.key);
        });
        this.elements.set(track.key, element);
      } catch {
        console.warn(`Audio asset could not be initialized: ${track.key}`);
      }
    }
  }

  getPreferences() {
    return this.preferences;
  }

  setMuted(muted: boolean) {
    this.preferences = { ...this.preferences, muted };
    this.applyVolumes();
    this.savePreferences();
  }

  setMasterVolume(masterVolume: number) {
    this.preferences = { ...this.preferences, masterVolume };
    this.applyVolumes();
    this.savePreferences();
  }

  setMusicVolume(musicVolume: number) {
    this.preferences = { ...this.preferences, musicVolume };
    this.applyVolumes();
    this.savePreferences();
  }

  setSfxVolume(sfxVolume: number) {
    this.preferences = { ...this.preferences, sfxVolume };
    this.savePreferences();
  }

  async loopMusic(key = this.preferences.musicKey) {
    const element = this.elements.get(key);
    const track = this.tracks.get(key);
    if (!element || !track) return false;
    this.preferences = { ...this.preferences, musicKey: key };
    this.savePreferences();

    if (this.currentMusic === element) {
      this.applyVolumes();
      if (!element.paused) return true;
    } else {
      this.stopMusic();
      this.currentMusic = element;
      element.currentTime = element.currentTime || 0;
    }

    element.loop = true;
    this.applyVolumes();
    if (this.preferences.muted) return false;
    try {
      await element.play();
      return true;
    } catch {
      console.warn(`Music playback blocked or failed: ${key}`);
      return false;
    }
  }

  stopMusic() {
    if (!this.currentMusic) return;
    this.currentMusic.pause();
    this.currentMusic = null;
  }

  async playSfx(key?: string) {
    if (!key || this.preferences.muted) return false;
    const source = this.elements.get(key);
    const track = this.tracks.get(key);
    if (!source || !track) return false;
    try {
      const element = source.cloneNode(true) as HTMLAudioElement;
      element.volume = Math.min(1, this.preferences.masterVolume * this.preferences.sfxVolume * track.preferredVolume);
      await element.play();
      return true;
    } catch {
      console.warn(`SFX playback blocked or failed: ${key}`);
      return false;
    }
  }

  playUiClick() {
    return this.playSfx(uiSounds.click);
  }

  playUiHover() {
    return this.playSfx(uiSounds.hover);
  }

  playNamedSfx(name: keyof typeof uiSounds) {
    return this.playSfx(uiSounds[name]);
  }

  private applyVolumes() {
    if (this.currentMusic) {
      const track = this.tracks.get(this.preferences.musicKey);
      this.currentMusic.volume = this.preferences.muted
        ? 0
        : Math.min(1, this.preferences.masterVolume * this.preferences.musicVolume * (track?.preferredVolume ?? 1));
      if (this.preferences.muted) {
        this.currentMusic.pause();
      } else {
        void this.currentMusic.play().catch(() => console.warn("Music resume was blocked by the browser."));
      }
    }
  }

  private loadPreferences(): AudioPreferences {
    try {
      const raw = localStorage.getItem("ayaans-room-audio");
      return raw ? { ...defaultPreferences, ...JSON.parse(raw) } : defaultPreferences;
    } catch {
      return defaultPreferences;
    }
  }

  private savePreferences() {
    localStorage.setItem("ayaans-room-audio", JSON.stringify(this.preferences));
  }
}

export const audioManager = new AudioManager();
