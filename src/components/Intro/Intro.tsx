import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TextScramble } from "@/components/ui/TextScramble";
import "./Intro.css";

export default function Intro({ onFinish }: { onFinish: () => void }) {
  const [phase, setPhase] = useState<"scramble" | "fade" | "done">("scramble");

  // Quando termina o efeito de scramble → começa o fade
  const handleScrambleEnd = () => {
    setTimeout(() => setPhase("fade"), 600);
  };

  // Quando o fade termina → finaliza intro
  useEffect(() => {
    if (phase === "fade") {
      const timer = setTimeout(() => setPhase("done"), 2000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Chama o callback final
  useEffect(() => {
    if (phase === "done") onFinish();
  }, [phase, onFinish]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="intro-container"
          initial={{ backgroundColor: "#ffffff" }}
          animate={{ backgroundColor: phase === "fade" ? "#000000" : "#ffffff" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: [0.4, 0, 0.2, 1] }}
        >
          <motion.h1
            className="intro-text"
            initial={{ opacity: 0, scale: 1 }}
            animate={{
              opacity: phase === "fade" ? 0 : 1,
              scale: phase === "fade" ? 1.15 : 1,
              color: "#000000",
              filter: phase === "fade" ? "blur(4px)" : "blur(0px)",
            }}
            transition={{ duration: 1.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <TextScramble onScrambleComplete={handleScrambleEnd}>
              FLAVIO JUNIOR
            </TextScramble>
          </motion.h1>

          <motion.div
            className="fade-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "fade" ? 1 : 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}


