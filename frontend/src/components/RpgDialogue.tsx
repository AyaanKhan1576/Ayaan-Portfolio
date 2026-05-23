import { AnimatePresence, motion } from "framer-motion";

export function RpgDialogue({
  title,
  text,
  prompt,
}: {
  title: string;
  text: string;
  prompt: string;
}) {
  if (!title || !text) return null;

  return (
    <AnimatePresence>
      <motion.div className="rpg-preview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
        <motion.div
          className="rpg-window"
          initial={{ scale: 0.98 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.98 }}
        >
          <div className="rpg-window-header">
            <div>
              <p className="pixel-label">Ayaan's Room</p>
              <h2>{title}</h2>
            </div>
          </div>
          <div className="rpg-window-body">
            <p style={{ marginBottom: "0.35rem" }}>{text}</p>
            <p className="pixel-label" style={{ margin: 0, opacity: 0.78 }}>{prompt}</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}