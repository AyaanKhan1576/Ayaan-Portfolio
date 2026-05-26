import { useCallback, useEffect, useState } from "react";
import { AudioControls } from "../components/AudioControls";
import { GameRoom } from "../components/GameRoom";
import { MobileControls } from "../components/MobileControls";
import { QuestLog } from "../components/QuestLog";
import { RpgDialogue } from "../components/RpgDialogue";
import { RpgModal } from "../components/RpgModal";
import { Card, CardContent } from "../components/ui/card";
import { config } from "../config";
import type { MobileInputState } from "../game/RoomScene";
import { getInteractionPreview, opensPortfolio, type InteractionSource } from "../game/assets/interactionConfig";
import { useAudioSystem } from "../hooks/useAudioSystem";
import { trackEvent } from "../services/analytics";
import { PortfolioContent } from "../sections/PortfolioContent";
import type { RoomObject, SectionId } from "../types";

export function RoomPage({ onNavigate }: { onNavigate: (path: "/professional" | "/room" | "/") => void }) {
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);
  const [nearbyObject, setNearbyObject] = useState<RoomObject | null>(null);
  const [hoveredObject, setHoveredObject] = useState<RoomObject | null>(null);
  const [mobileInput, setMobileInput] = useState<MobileInputState>({ up: false, down: false, left: false, right: false });
  const [interactSignal, setInteractSignal] = useState(0);
  const [mobileLogOpen, setMobileLogOpen] = useState(false);
  const [discovered, setDiscovered] = useState<SectionId[]>(() => {
    const stored = localStorage.getItem("ayaans-room-discovered");
    return stored ? (JSON.parse(stored) as SectionId[]) : ["intro"];
  });
  const audio = useAudioSystem(config.enableAudio);

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

  const closeSection = useCallback(() => {
    if (activeSection === "resume" || activeSection === "about") audio.stopSfx();
    audio.play("menuClose");
    setActiveSection(null);
  }, [activeSection, audio]);

  const interact = useCallback((object: RoomObject) => {
    const interactionSounds: Record<string, Parameters<typeof audio.play>[0]> = {
      door: "door",
      piano: "click",
      laptop: "click",
      book: "click",
      ticket: "reward",
      tag: "click",
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

  const activePreview = activeSection || mobileLogOpen ? null : nearbyObject ?? hoveredObject;
  const activePreviewSource: InteractionSource | null = nearbyObject ? "nearby" : hoveredObject ? "hover" : null;
  const preview = activePreview && activePreviewSource ? getInteractionPreview(activePreview, activePreviewSource) : null;

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSection();
      }
      if (!activeSection && event.key.toLowerCase() === "m") setActiveSection("intro");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeSection, closeSection]);

  const modalContent = activeSection ? <PortfolioContent openSection={openSection} section={activeSection} /> : null;
  const interactionLocked = Boolean(activeSection) || mobileLogOpen;

  return (
    <main className="room-page">
      <div className="dream-backdrop" />
      <header className="room-header">
        <div>
          <p className="pixel-label">Playable Portfolio</p>
          <h1>Ayaan's Room</h1>
        </div>
        <div className="room-header-actions">
          <button className="room-switch-link" onClick={() => onNavigate("/professional")} type="button">
            Professional Portfolio
          </button>
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
        </div>
      </header>

      <section className="room-layout">
        <QuestLog discovered={discovered} onMobileOpenChange={setMobileLogOpen} onOpenSection={openSection} />
        <Card
          className="onboarding-hint max-[680px]:!fixed max-[680px]:!left-1/2 max-[680px]:!right-auto max-[680px]:!top-auto max-[680px]:!bottom-44 max-[680px]:!z-[5] max-[680px]:!w-[calc(100vw-24px)] max-[680px]:!max-w-[92vw] max-[680px]:!-translate-x-1/2 max-[680px]:!px-4 max-[680px]:!py-2.5"
          aria-label="How to explore"
        >
          <CardContent className="grid gap-0.5">
            <p className="desktop-hint">WASD / arrows &rarr; Move</p>
            <p className="desktop-hint">E &rarr; Interact</p>
            <p className="desktop-hint">Memory Log &rarr; Explore sections</p>
            <p className="desktop-hint">Objects can also be clicked</p>
            <p className="mobile-hint">Tap entries to explore</p>
            <p className="mobile-hint">Use controls to move</p>
            <p className="mobile-hint">Room objects are also interactive</p>
          </CardContent>
        </Card>
        <div className="game-panel">
          <GameRoom
            interactSignal={interactSignal}
            interactionLocked={interactionLocked}
            onHoverChange={setHoveredObject}
            mobileInput={mobileInput}
            onInteract={interact}
            onNearbyChange={setNearbyObject}
          />
          <MobileControls
            hidden={interactionLocked}
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
        onClose={closeSection}
        section={activeSection}
      >
        {modalContent}
      </RpgModal>
    </main>
  );
}
