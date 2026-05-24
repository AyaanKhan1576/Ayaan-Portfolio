import { useState } from "react";
import type { SectionId } from "../types";

const labels: Record<SectionId, string> = {
  intro: "Intro",
  about: "About Me",
  contact: "Contact",
  resume: "Resume",
  education: "Education",
  experience: "Experience",
  featured: "Featured Projects",
  skills: "Skills",
  projects: "All Projects",
  media: "Leadership and Honors",
  fluff: "Fluff",
};

const logOrder: SectionId[] = ["about", "contact", "resume", "education", "experience", "featured", "skills", "projects", "media"];

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
        {logOrder
          .map((section) => {
            return (
              <button
                className="found"
                key={section}
                onClick={() => {
                  onOpenSection(section);
                  setMobileDrawerOpen(false);
                }}
                type="button"
              >
                {labels[section]}
              </button>
            );
          })}
      </div>
      </aside>
    </>
  );
}
