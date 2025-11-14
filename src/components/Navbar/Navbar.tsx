import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "./Navbar.css";

function TextScramble({ text }: { text: string }) {
  const [display, setDisplay] = useState("");
  const intervalRef = useRef<number | null>(null);
  const chars = "!<>-_\\/[]{}—=+*^?#________";

  useEffect(() => {
    let frame = 0;
    const totalFrames = 20;
    const scramble = () => {
      const output = text
        .split("")
        .map((char, i) => {
          if (i < (frame / totalFrames) * text.length) {
            return char;
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");
      setDisplay(output);
      frame++;
      if (frame > totalFrames) {
        frame = 0;
      }
    };
    intervalRef.current = window.setInterval(scramble, 50);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text]);

  return <>{display}</>;
}

export default function Navbar() {
  const [show, setShow] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hoverCv, setHoverCv] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const startHideTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setShow(false);
    }, 10000);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (e.clientY <= 30) {
      if (!show) setShow(true);
      startHideTimeout();
    }
  };

  useEffect(() => {
    if (show) startHideTimeout();
    else if (timeoutRef.current) clearTimeout(timeoutRef.current);

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [show]);

  const menuItems = [
    { main: "Developer", sub: "Perfil" },
    { main: "Habilidades", sub: "Skills" },
    { main: "Projects", sub: "Ideias" },
    { main: "Contact", sub: "" },
  ];

  const abbrevName = "FJR.";

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  return (
    <motion.nav
      className="navbar-container"
      initial={{ y: -100, opacity: 0.1 }}
      animate={show ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0)",
        backdropFilter: "saturate(180%) blur(20px)",
        WebkitBackdropFilter: "saturate(180%) blur(20px)",
        zIndex: 1000,
      }}
    >
      <div
        className="top-left-fjr"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span
          className="fjr-letters"
          style={{ fontWeight: 700, cursor: "pointer" }}
        >
          {hovered ? abbrevName : <TextScramble text={abbrevName} />}
        </span>
      </div>

      <div className="navbar-menu">
        {menuItems.map(({ main, sub }) => (
          <div key={main} className="navbar-item">
            <motion.div
              className="navbar-main-text"
              initial={{ y: -30, opacity: 0 }}
              animate={show ? { y: 0, opacity: 1 } : { y: -30, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              {main}
            </motion.div>
            {sub && (
              <motion.div
                className="navbar-sub-text"
                initial={{ y: -20, opacity: 0 }}
                animate={show ? { y: 0, opacity: 1 } : { y: -20, opacity: 0 }}
                transition={{ delay: 0.8, duration: 0.8, ease: "easeInOut" }}
              >
                {sub}
              </motion.div>
            )}
          </div>
        ))}
      </div>

      <div
        className="navbar-cv"
        onMouseEnter={() => setHoverCv(true)}
        onMouseLeave={() => setHoverCv(false)}
      >
        <a
          href="/curriculo.pdf"
          download="curriculo.pdf"
          className="btn-cv"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Download Currículo"
        >
          {hoverCv ? (
            <svg
              className="glow-animation"
              xmlns="http://www.w3.org/2000/svg"
              fill="black"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              aria-hidden="true"
            >
              <path d="M5 20h14v-2H5v2zm7-18l-5 5h3v6h4v-6h3l-5-5z" />
            </svg>
          ) : (
            "Currículo"
          )}
        </a>
      </div>
    </motion.nav>
  );
}
