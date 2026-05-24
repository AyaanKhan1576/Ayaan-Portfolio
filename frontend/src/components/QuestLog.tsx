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
  onMobileOpenChange,
  onOpenSection,
}: {
  discovered: SectionId[];
  onMobileOpenChange?: (open: boolean) => void;
  onOpenSection: (section: SectionId) => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  function setMobileDrawerOpen(open: boolean) {
    setMobileOpen(open);
    onMobileOpenChange?.(open);
  }

  return (
    <>
      {mobileOpen ? <button aria-label="Close Memory Log" className="quest-log-backdrop" onClick={() => setMobileDrawerOpen(false)} type="button" /> : null}
      <aside className={`quest-log unlocked ${mobileOpen ? "mobile-open" : ""}`}>
      <button
        aria-expanded={mobileOpen}
        className="quest-log-toggle"
        onClick={() => setMobileDrawerOpen(!mobileOpen)}
        type="button"
      >
        Log
      </button>
      <p className="pixel-label">Memory Log</p>
      <div className="quest-log-items">
        {Object.entries(labels)
          .filter(([key]) => key !== "intro")
          .map(([key, label]) => {
            const section = key as SectionId;
            return (
              <button
                className="found"
                key={key}
                onClick={() => {
                  onOpenSection(section);
                  setMobileDrawerOpen(false);
                }}
                type="button"
              >
                {label}
              </button>
            );
          })}
      </div>
      </aside>
    </>
  );
}
