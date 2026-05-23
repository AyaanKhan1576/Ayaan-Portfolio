import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export function RpgDialogue({
  title,
  text,
  onContinue,
  onClose,
}: {
  title: string;
  text: string;
  onContinue: () => void;
  onClose: () => void;
}) {
  if (!title || !text) return null;

  return (
    <AnimatePresence>
      <motion.div className="rpg-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div
          className="rpg-window"
          initial={{ y: 16, scale: 0.97 }}
          animate={{ y: 0, scale: 1 }}
          exit={{ y: 10, scale: 0.98 }}
        >
          <div className="rpg-window-header">
            <div>
              <p className="pixel-label">Ayaan's Room</p>
              <h2>{title}</h2>
            </div>
            <button className="pixel-icon-button" onClick={onClose} title="Close dialogue" type="button">
              <X size={18} />
            </button>
          </div>
          <div className="rpg-window-body">
            <p style={{ marginBottom: "1rem" }}>{text}</p>
            <button
              onClick={onContinue}
              type="button"
              style={{
                border: "2px solid #111111",
                borderRadius: 0,
                background: "#ffffff",
                color: "#111111",
                padding: "8px 14px",
                fontFamily: '"Courier New", ui-monospace, monospace',
                fontSize: "0.82rem",
                letterSpacing: "0.04em",
              }}
            >
              Continue
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}