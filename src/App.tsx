import { useState } from "react";
import Intro from "./components/Intro/Intro";
import BackgroundSection from "./sections/BackgroundSection";
import Hero from "./components/Hero/Hero";
import Navbar from "./components/Navbar";
import Developer from "./components/Developer/Developer";

export default function App() {
  const [showHero, setShowHero] = useState(false);

  return (
    <>
      {/* INTRO - ocupa toda a tela e some depois */}
      {!showHero && <Intro onFinish={() => setShowHero(true)} />}

      {showHero && (
        <div style={{ position: "relative" }}>

          {/* BACKGROUND - FICA FIXO ATRÁS DE TUDO */}
          <BackgroundSection />

          {/* NAVBAR - SEMPRE NO TOPO */}
          <Navbar />

          {/* LEVEL 1 - HERO */}
          <section id="hero-section" style={{ position: "relative", zIndex: 2 }}>
            <Hero />
          </section>

          {/* LEVEL 2 - DEVELOPER */}
          <section id="dev-section" style={{ position: "relative", zIndex: 2 }}>
            <Developer />
          </section>

        </div>
      )}
    </>
  );
}
