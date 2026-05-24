import { useState } from "react";
import type { SectionId } from "../types";

const labels: Record<SectionId, string> = {
  intro: "Intro",
  about: "About Me",
  skills: "Skills",
  featured: "Featured Projects",
  projects: "All Projects",
  media: "Leadership and Honors",
  education: "Education",
  experience: "Experience",
  resume: "Resume",
  contact: "Contact",
};

export function QuestLog({
  discovered,
  onOpenSection,
}: {
  discovered: SectionId[];
  onOpenSection: (section: SectionId) => void;
}) {
  const unlocked = discovered.length > 1;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <aside className={`${unlocked ? "quest-log unlocked" : "quest-log"} ${mobileOpen ? "mobile-open" : ""}`}>
      <button
        aria-expanded={mobileOpen}
        className="quest-log-toggle"
        onClick={() => setMobileOpen((value) => !value)}
        type="button"
      >
        Log
      </button>
      <p className="pixel-label">Memory Log {unlocked ? "Unlocked" : "Locked"}</p>
      <div className="quest-log-items">
        {Object.entries(labels)
          .filter(([key]) => key !== "intro")
          .map(([key, label]) => {
            const section = key as SectionId;
            const found = discovered.includes(section);
            return (
              <button
                className={found ? "found" : ""}
                disabled={!unlocked || !found}
                key={key}
                onClick={() => {
                  onOpenSection(section);
                  setMobileOpen(false);
                }}
                type="button"
              >
                {label}
              </button>
            );
          })}
      </div>
    </aside>
  );
}
