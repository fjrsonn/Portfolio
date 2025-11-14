import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { TextScramble } from "@/components/ui/TextScramble";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Hero.css";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const [key, setKey] = useState(0);
  const [showText, setShowText] = useState(false);
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const nomePartes = ["Flavio", "Junior", "Laranjeira", "de", "Sousa"];

  const startHideTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setVisible(false);
    }, 10000);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (e.clientY >= window.innerHeight - 300) {
      if (!visible) setVisible(true);
      startHideTimeout();
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(true);
      setVisible(true);
      startHideTimeout();
    }, 100);

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", handleMouseMove);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!heroRef.current) return;

    // Animação fade out do Hero com ScrollTrigger - VELOCIDADE AUMENTADA
    gsap.to(heroRef.current, {
      opacity: 0,
      y: -100,
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "top+=300 top", // TERMINA MAIS CEDO - apenas 300px de scroll vs 100px anterior
        scrub: true,
        toggleActions: "play reverse play reverse",
      },
      ease: "power1.out",
    });
  }, []);

  const handleMouseEnter = () => {
    setKey((prev) => prev + 1);
  };

  const variantsSub = {
    hidden: { y: 100, opacity: 0, pointerEvents: "none" },
    visible: { y: 0, opacity: 1, pointerEvents: "auto" },
  };

  return (
    <motion.section
      ref={heroRef}
      className="hero-container"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <motion.div
        className="hero-content"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
      >
        <div
          className={`hero-title-wrapper ${showText ? "show-text" : ""}`}
          onMouseEnter={handleMouseEnter}
        >
          <h1 className="hero-title" data-text="FJR.">
            <TextScramble key={key}>FJR.</TextScramble>
          </h1>
        </div>
      </motion.div>

      {showText && (
        <motion.div
          className="hero-subtitle"
          variants={variantsSub}
          initial="hidden"
          animate={visible ? "visible" : "hidden"}
          transition={{ delay: 1, duration: 1 }}
          style={{ originY: 1 }}
        >
          Machine Learning & Full Stack Dev.
        </motion.div>
      )}

      {showText && (
        <motion.div
          className="bottom-left-desenvolvedor"
          variants={variantsSub}
          initial="hidden"
          animate={visible ? "visible" : "hidden"}
          transition={{ delay: 1, duration: 1 }}
          style={{ originY: 1 }}
        >
          Desenvolvedor
        </motion.div>
      )}

      {showText && (
        <motion.div
          className="bottom-left-text"
          variants={variantsSub}
          initial="hidden"
          animate={visible ? "visible" : "hidden"}
          transition={{
            delay: 1,
            duration: 1,
            ease: "easeInOut",
          }}
          style={{ originY: 1 }}
        >
          <div style={{ display: "flex", flexDirection: "row" }}>
            {nomePartes.map((parte, index) => (
              <motion.span
                key={index}
                variants={variantsSub}
                initial="hidden"
                animate={visible ? "visible" : "hidden"}
                transition={{
                  delay: 1 + index * 0.3,
                  duration: 0.6,
                  ease: "easeInOut",
                }}
                style={{
                  marginRight: index !== nomePartes.length - 1 ? "8px" : 0,
                  fontSize: "1.2rem",
                  color: "white",
                }}
              >
                {parte}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}

      {showText && (
        <>
          <motion.div
            className="bottom-left-inferior-seja"
            variants={variantsSub}
            initial="hidden"
            animate={visible ? "visible" : "hidden"}
            transition={{ delay: 1, duration: 1 }}
            style={{ originY: 1 }}
          >
            Seja bem vindo
          </motion.div>
          <motion.div
            className="bottom-left-inferior-apresentacao"
            variants={variantsSub}
            initial="hidden"
            animate={visible ? "visible" : "hidden"}
            transition={{ delay: 1.7, duration: 1 }}
            style={{ originY: 1 }}
          >
            Apresentação
          </motion.div>
          <motion.div
            className="bottom-left-inferior-portifolio"
            variants={variantsSub}
            initial="hidden"
            animate={visible ? "visible" : "hidden"}
            transition={{ delay: 2.4, duration: 1 }}
            style={{ originY: 1 }}
          >
            Portfólio
          </motion.div>
        </>
      )}

      <motion.div
        className="social-icons"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "40px",
          display: "flex",
          gap: "20px",
          color: "white",
          fontSize: "1.8rem",
          zIndex: 1200,
          cursor: "pointer",
        }}
      >
        <a
          href="https://github.com/fjrsonn"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          style={{ color: "white" }}
        >
          <FaGithub />
        </a>
        <a
          href="https://www.linkedin.com/in/flaviojuniorls"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          style={{ color: "white" }}
        >
          <FaLinkedin />
        </a>
      </motion.div>
    </motion.section>
  );
}