import { generatedAssetManifest } from "./generatedAssetManifest";
import type { AudioAssetCategory } from "./assetManifest";

export interface AudioTrackConfig {
  key: string;
  label: string;
  path: string;
  category: AudioAssetCategory;
  loop: boolean;
  preferredVolume: number;
}

function labelFromFilename(filename: string) {
  return filename
    .replace(/\.[^/.]+$/, "")
    .replace(/^(SYS|SE|AMB|GEN)_/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export const audioTracks: AudioTrackConfig[] = generatedAssetManifest.audio.map((asset) => ({
  key: asset.key,
  label: labelFromFilename(asset.filename),
  path: asset.path,
  category: asset.inferredCategory,
  loop: asset.inferredCategory === "music" || asset.inferredCategory === "ambience",
  preferredVolume: asset.inferredCategory === "music" ? 0.45 : asset.inferredCategory === "ambience" ? 0.3 : 0.75,
}));

export const musicTracks = audioTracks.filter((track) => track.category === "music");
export const ambienceTracks = audioTracks.filter((track) => track.category === "ambience");

export const uiSounds = {
  click: audioTracks.find((track) => /click|select/i.test(track.label))?.key,
  hover: audioTracks.find((track) => /cursor/i.test(track.label))?.key,
  reward: audioTracks.find((track) => /quest|item/i.test(track.label))?.key,
  transition: audioTracks.find((track) => track.category === "transition")?.key,
  laptop: audioTracks.find((track) => /laptop/i.test(track.label))?.key,
  tv: audioTracks.find((track) => /tv/i.test(track.label))?.key,
  page: audioTracks.find((track) => /page|slide/i.test(track.label))?.key,
  prompt: audioTracks.find((track) => /item|get|quest|select/i.test(track.label))?.key,
  door: audioTracks.find((track) => /spiral|cassette|down/i.test(track.label))?.key,
  blocked: audioTracks.find((track) => /static|hum/i.test(track.label))?.key,
  piano: musicTracks.find((track) => /piano|duet/i.test(track.label))?.key,
  cat: audioTracks.find((track) => /cursor|select/i.test(track.label))?.key,
  ambience: ambienceTracks.find((track) => /hum|static|ambience/i.test(track.label))?.key,
};
