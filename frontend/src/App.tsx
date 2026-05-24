import { useCallback, useEffect, useState } from "react";
import { AudioControls } from "./components/AudioControls";
import { GameRoom } from "./components/GameRoom";
import { MobileControls } from "./components/MobileControls";
import { QuestLog } from "./components/QuestLog";
import { RpgDialogue } from "./components/RpgDialogue";
import { RpgModal } from "./components/RpgModal";
import { config } from "./config";
import type { MobileInputState } from "./game/RoomScene";
import { getInteractionPreview, opensPortfolio, type InteractionSource } from "./game/assets/interactionConfig";
import { useAudioSystem } from "./hooks/useAudioSystem";
import { trackEvent } from "./services/analytics";
import { PortfolioContent } from "./sections/PortfolioContent";
import type { RoomObject, SectionId } from "./types";

export function App() {
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);
  const [nearbyObject, setNearbyObject] = useState<RoomObject | null>(null);
  const [hoveredObject, setHoveredObject] = useState<RoomObject | null>(null);
  const [mobileInput, setMobileInput] = useState<MobileInputState>({ up: false, down: false, left: false, right: false });
  const [interactSignal, setInteractSignal] = useState(0);
  const [discovered, setDiscovered] = useState<SectionId[]>(() => {
    const stored = localStorage.getItem("ayaans-room-discovered");
    return stored ? (JSON.parse(stored) as SectionId[]) : ["intro"];
  });
  const audio = useAudioSystem(config.enableAudio);

  useEffect(() => {
    void trackEvent({ eventType: "site_visit", metadata: { site: config.siteName } });
  }, []);

  useEffect(() => {
    localStorage.setItem("ayaans-room-discovered", JSON.stringify(discovered));
  }, [discovered]);

  useEffect(() => {
    if (nearbyObject) audio.play("prompt");
  }, [audio, nearbyObject]);

  const openSection = useCallback((section: SectionId) => {
    setActiveSection(section);
    setDiscovered((current) => (current.includes(section) ? current : [...current, section]));
    audio.play("menuOpen");
    void trackEvent({ eventType: "section_open", metadata: { section } });
  }, [audio]);

  const interact = useCallback((object: RoomObject) => {
    const interactionSounds: Record<string, Parameters<typeof audio.play>[0]> = {
      door: "door",
      piano: "piano",
      laptop: "laptop",
      book: "page",
      ticket: "reward",
      tag: "page",
      watch: "prompt",
      phone: "prompt",
      cat: "cat",
    };

    if (!opensPortfolio(object)) {
      audio.play(interactionSounds[object.object_id] ?? "prompt");
      void trackEvent({
        eventType: "object_interaction",
        metadata: { objectId: object.object_id, displayName: object.display_name },
      });
      return;
    }

    openSection(object.linked_portfolio_section);
    audio.play(interactionSounds[object.object_id] ?? "prompt");
    void trackEvent({
      eventType: "object_interaction",
      metadata: { objectId: object.object_id, displayName: object.display_name },
    });
  }, [audio, openSection]);

  const activePreview = activeSection ? null : nearbyObject ?? hoveredObject;
  const activePreviewSource: InteractionSource | null = nearbyObject ? "nearby" : hoveredObject ? "hover" : null;
  const preview = activePreview && activePreviewSource ? getInteractionPreview(activePreview, activePreviewSource) : null;

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        audio.play("menuClose");
        setActiveSection(null);
      }
      if (event.key.toLowerCase() === "m") setActiveSection("intro");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [audio]);

  const modalContent = activeSection ? <PortfolioContent openSection={openSection} section={activeSection} /> : null;

  return (
    <main className="room-page">
      <div className="dream-backdrop" />
      <header className="room-header">
        <div>
          <p className="pixel-label">Playable Portfolio</p>
          <h1>Ayaan's Room</h1>
        </div>
        <AudioControls
          audioEnabled={audio.audioEnabled}
          enableAudio={audio.enableAudio}
          enabled={config.enableAudio}
          muted={audio.muted}
          musicMode={audio.musicMode}
          setMuted={audio.setMuted}
          setMusicMode={audio.setMusicMode}
          setVolume={audio.setVolume}
          volume={audio.volume}
        />
      </header>

      <section className="room-layout">
        <QuestLog discovered={discovered} onOpenSection={openSection} />
        <div className="game-panel">
          <GameRoom
            interactSignal={interactSignal}
            onHoverChange={setHoveredObject}
            mobileInput={mobileInput}
            onInteract={interact}
            onNearbyChange={setNearbyObject}
          />
          <MobileControls
            onInteract={() => setInteractSignal((value) => value + 1)}
            setInput={setMobileInput}
          />
        </div>
        <aside className="controls-card">
          <p className="pixel-label">Controls</p>
          <p>Move: WASD / arrows</p>
          <p>Interact: E / Space / tap</p>
          <p>Menu: M</p>
          <p>Close: Esc</p>
        </aside>
      </section>

      <RpgDialogue key={`${preview?.objectId ?? "none"}-${activePreviewSource ?? "none"}`} prompt={preview?.prompt ?? ""} text={preview?.text ?? ""} title={preview?.title ?? ""} />

      <RpgModal
        onClose={() => {
          audio.play("menuClose");
          setActiveSection(null);
        }}
        section={activeSection}
      >
        {modalContent}
      </RpgModal>
    </main>
  );
}
