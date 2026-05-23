import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export function RpgDialogue({
  title,
  text,
  prompt,
}: {
  title: string;
  text: string;
  prompt: string;
}) {
  const [visibleText, setVisibleText] = useState("");

  useEffect(() => {
    let timer: number | undefined;
    let index = 0;
    setVisibleText("");

    if (!text) return;

    timer = window.setInterval(() => {
      index += 1;
      setVisibleText(text.slice(0, index));
      if (index >= text.length && timer) window.clearInterval(timer);
    }, 22);

    return () => {
      if (timer) window.clearInterval(timer);
      setVisibleText("");
    };
  }, [text, title]);

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
          <div className="rpg-window-content">
            <div className="rpg-window-header">
              <h2>{title}</h2>
            </div>
            <div className="rpg-window-body">
              <p>{visibleText}</p>
              <p className="pixel-label" style={{ opacity: 0.78 }}>{prompt}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}