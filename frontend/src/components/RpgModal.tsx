import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import type { SectionId } from "../types";

const titles: Record<SectionId, string> = {
  intro: "A small room between projects",
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

export function RpgModal({
  section,
  children,
  onClose,
}: {
  section: SectionId | null;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {section ? (
        <motion.div className="rpg-overlay rpg-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            className={`rpg-window ${section === "resume" ? "rpg-window-resume" : ""}`}
            initial={{ y: 18, scale: 0.96 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 12, scale: 0.98 }}
          >
            <div className="rpg-window-header">
              <div>
                <p className="pixel-label">Ayaan's Room</p>
                <h2>{titles[section]}</h2>
              </div>
              <button className="pixel-icon-button" onClick={onClose} title="Close menu" type="button">
                <X size={18} />
              </button>
            </div>
            <div className="rpg-window-body">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
