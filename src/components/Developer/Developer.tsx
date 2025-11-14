import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextScramble } from "@/components/ui/TextScramble";
import "./Developer.css";

gsap.registerPlugin(ScrollTrigger);

export default function Developer() {
  const bannerRef = useRef<HTMLDivElement>(null);
  const bannerContainerRef = useRef<HTMLDivElement>(null);
  const lastScroll = useRef(window.scrollY);
  const velocity = useRef(0);
  const rafId = useRef(0);

  const developerTitleRef = useRef<HTMLHeadingElement>(null);
  const devInfo3Ref = useRef<HTMLDivElement>(null);
  const devInfoLeftRef = useRef<HTMLDivElement>(null);
  const devInfoRightRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const [hovered, setHovered] = useState(false);
  const [blurActive, setBlurActive] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [allAnimationsComplete, setAllAnimationsComplete] = useState(false);

  // 🚀 Banner infinito otimizado com gsap.quickSetter
  useEffect(() => {
    if (!bannerRef.current) return;

    const banner = bannerRef.current;
    let currentX = 0;
    const speed = 0.5;
    const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;

    const setX = gsap.quickSetter(banner, "x", "px");

    const updatePosition = () => {
      currentX += velocity.current;
      const width = banner.scrollWidth / 2;

      if (currentX <= -width) currentX = 0;
      if (currentX >= 0) currentX = -width;

      setX(currentX);
      rafId.current = requestAnimationFrame(updatePosition);
    };

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const scrollDelta = currentScroll - lastScroll.current;
      const scrollDir = scrollDelta > 0 ? -1 : 1;
      const nearBottom = currentScroll >= maxScrollTop - 10;
      const nearTop = currentScroll <= 10;

      if (nearBottom || nearTop) {
        velocity.current = scrollDir * speed;
      } else {
        velocity.current = scrollDelta * 0.2;
      }

      lastScroll.current = currentScroll;
    };

    window.addEventListener("scroll", handleScroll);
    updatePosition();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

useEffect(() => {
  if (
    !bannerContainerRef.current ||
    !developerTitleRef.current ||
    !devInfo3Ref.current ||
    !devInfoLeftRef.current ||
    !devInfoRightRef.current ||
    !imageContainerRef.current
  )
    return;

  // 🧩 Timeline principal - controla o título e texto superior
  const scrollTl = gsap.timeline({
    scrollTrigger: {
      trigger: document.body,
      start: "250vh top",
      end: "350vh top",
      scrub: 1.2,
      onUpdate: (self) => setScrollProgress(self.progress),
      onEnter: () => console.log("Iniciando animações de entrada"),
      onLeave: () => {
        console.log("✅ ANIMAÇÕES DE ENTRADA COMPLETAS em 350vh");
        setAllAnimationsComplete(true);
      },
      onEnterBack: () => {
        console.log("Voltando - reativando elementos");
        setAllAnimationsComplete(false);
      },
    },
  });

  // Fase 1: título e texto
  scrollTl
    .fromTo(
      developerTitleRef.current,
      { opacity: 0, y: 120, filter: "blur(8px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", ease: "power2.out", duration: 1.0 },
      "phase1"
    )
    .fromTo(
      devInfo3Ref.current,
      { opacity: 0, y: 40, filter: "blur(10px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", ease: "power2.out", duration: 0.8 },
      "phase1+=0.1"
    );

  // 🖼️ Fase 2: Imagem (entra mais tarde)
  gsap.fromTo(
    imageContainerRef.current,
    { opacity: 0, scale: 0.8, y: 50 },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      ease: "power2.out",
      duration: 1.2,
      scrollTrigger: {
        trigger: document.body,
        start: "530vh top", // só aparece quando a imagem entra na tela
        end: "570vh top",
        scrub: 1.2,
        toggleActions: "play none none none",
      },
    }
  );

  // 🧍‍♂️ Fase 3: textos e banner — cada um com scrollTrigger independente
  gsap.fromTo(
    devInfoLeftRef.current,
    { opacity: 0, x: "-120vw", filter: "blur(20px)" },
    {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: devInfoLeftRef.current,
        start: "top 70%",
        end: "top 50%",
        toggleActions: "play reverse play reverse",
      },
    }
  );

  gsap.fromTo(
    devInfoRightRef.current,
    { opacity: 0, x: "120vw", filter: "blur(20px)" },
    {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: devInfoRightRef.current,
        start: "top 70%",
        end: "top 45%",
        toggleActions: "play reverse play reverse",
      },
    }
  );

  gsap.fromTo(
    bannerContainerRef.current,
    { opacity: 0, y: 140 },
    {
      opacity: 1,
      y: 0,
      duration: 1.0,
      ease: "power2.out",
      scrollTrigger: {
        trigger: bannerContainerRef.current,
        start: "top 55%",
        end: "top 25%",
        toggleActions: "play reverse play reverse",
      },
    }
  );

  // Limpeza
  return () => {
    scrollTl.kill();
    ScrollTrigger.getAll().forEach((st) => st.kill());
  };
}, []);

  // 🆕 Timeline de desaparecimento - COM ATRASO DE 5 SCROLLS (aproximadamente 500vh)
  useEffect(() => {
    if (
      !allAnimationsComplete ||
      !bannerContainerRef.current ||
      !developerTitleRef.current ||
      !devInfo3Ref.current ||
      !devInfoLeftRef.current ||
      !devInfoRightRef.current ||
      !imageContainerRef.current
    )
      return;

    console.log("⏰ Inicializando fade out com atraso de 5 scrolls");

    const fadeOutTl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: "750vh top", // ATRASO DE 5 SCROLLS: 350vh + 500vh = 850vh
        end: "950vh top",   // Termina em 950vh
        scrub: 1.5,
        onUpdate: (self) => {
          const progress = self.progress;
          console.log(`Progresso do fade out: ${Math.round(progress * 100)}%`);
          
          // Ordem de desaparecimento SUAVE
          if (progress > 0.7) {
            // Últimos a desaparecer: título e texto superior (70-100% do progresso)
            const fadeProgress = (progress - 0.7) / 0.3;
            gsap.to([developerTitleRef.current, devInfo3Ref.current], {
              opacity: Math.max(0, 1 - fadeProgress),
              duration: 0.1,
            });
          }
          
          if (progress > 0.5 && progress <= 0.8) {
            // Terceiros a desaparecer: imagem (50-80% do progresso)
            const fadeProgress = (progress - 0.5) / 0.3;
            gsap.to(imageContainerRef.current, {
              opacity: Math.max(0, 1 - fadeProgress),
              duration: 0.1,
            });
          }
          
        
          if (progress > 0.1 && progress <= 0.4) {
            // Primeiros a desaparecer: banner (10-40% do progresso)
            const fadeProgress = (progress - 0.1) / 0.3;
            gsap.to(bannerContainerRef.current, {
              opacity: Math.max(0, 1 - fadeProgress),
              duration: 0.1,
            });
          }
        },
        onEnter: () => {
          console.log("🎯 INICIANDO FADE OUT COM ATRASO (850vh-950vh)");
          console.log("📏 5 scrolls completos após animações de entrada");
          // Garante que tudo esteja 100% visível no início do fade out
          gsap.to([
            bannerContainerRef.current,
            devInfoLeftRef.current,
            devInfoRightRef.current,
            imageContainerRef.current,
            devInfo3Ref.current,
            developerTitleRef.current
          ], {
            opacity: 1,
            duration: 0.1
          });
        },
        onLeave: () => {
          console.log("✅ FADE OUT COMPLETO em 950vh");
          // Garante que tudo esteja completamente invisível
          gsap.to([
            bannerContainerRef.current,
            devInfoLeftRef.current,
            devInfoRightRef.current,
            imageContainerRef.current,
            devInfo3Ref.current,
            developerTitleRef.current
          ], {
            opacity: 0,
            duration: 0.3,
          });
        },
        onEnterBack: () => {
          console.log("↩️  REVERTENDO fade out - voltando para zona de repouso");
        },
        onLeaveBack: () => {
          console.log("🔙 Volta completa - elementos visíveis na zona de repouso");
          // Garante que tudo esteja visível ao voltar para a zona de repouso
          gsap.to([
            bannerContainerRef.current,
            devInfoLeftRef.current,
            devInfoRightRef.current,
            imageContainerRef.current,
            devInfo3Ref.current,
            developerTitleRef.current
          ], {
            opacity: 1,
            duration: 0.3,
          });
        }
      },
    });

    return () => {
      if (fadeOutTl) {
        fadeOutTl.kill();
      }
    };
  }, [allAnimationsComplete]);

  // Efeito para controlar animações baseadas no progresso do scroll
  useEffect(() => {
    const handleScrollProgress = () => {
      if (scrollProgress > 0.2 && scrollProgress < 0.8) {
        setBlurActive(false);
      }
    };

    window.addEventListener("scroll", handleScrollProgress);
    return () => window.removeEventListener("scroll", handleScrollProgress);
  }, [scrollProgress]);

  const bannerItems = [
    "BACK END",
    "FRONT END",
    "FULL STACK",
    "MACHINE LEARNING",
    "SYSADMIN",
    "NETSEC",
    "NETOPS",
  ];

  const repeatedBannerItems = Array(10).fill(null).flatMap(() => bannerItems);

  return (
    <>
      <div className={`global-blur-overlay ${blurActive ? "active" : ""}`} />

      <motion.div
        className="developer-container"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.8 }}
      >
        <div style={{ position: "relative", width: "100%" }}>
          <motion.h1
            ref={developerTitleRef}
            className="developer-title"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              cursor: "pointer",
              maxWidth: "15%",
              height: "14rem",
              overflow: "visible",
              display: "flex",
              alignItems: "center",
              paddingRight: "0.5rem",
            }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
          >
            {hovered ? <TextScramble>DEVELOPER</TextScramble> : "DEVELOPER"}
          </motion.h1>

          <div
            ref={devInfoLeftRef}
            className="dev-info-text"
            onMouseEnter={() => setBlurActive(true)}
            onMouseLeave={() => setBlurActive(false)}
          >
            Após os meus primeiros contatos com a tecnologia, que começaram no ano de 2012,
            sempre fui audacioso diante dos avanços, os quais me proporcionaram desafios
            constantes ao longo do trajeto até os dias atuais. Pude solucioná-los ao me
            aproximar dos conhecimentos de programação, buscando, por determinação própria,
            conhecimentos específicos na área da ciência da computação na vasta World Wide Web.
          </div>

          <div
            ref={devInfoRightRef}
            className="dev-info2-text"
            onMouseEnter={() => setBlurActive(true)}
            onMouseLeave={() => setBlurActive(false)}
          >
            Atualmente, trabalho na área de segurança privada e, diariamente, enfrento desafios,
            monitorando por meio da tecnologia e solucionando problemas antes que possam
            prejudicar ou até mesmo colocar em risco a segurança alheia. Além disso, estou
            no 4º semestre da faculdade de Análise e Desenvolvimento de Sistemas, estudando
            e desenvolvendo projetos próprios.
          </div>

          <div
            ref={devInfo3Ref}
            className={`dev-info3-text ${blurActive ? "blurred" : ""}`}
          >
            ANALISTA E DESENVOLVEDOR DE SISTEMAS.
          </div>
        </div>
      </motion.div>

      <div
        ref={imageContainerRef}
        className={`centered-image-container ${blurActive ? "active-blur" : ""}`}
      >
        <img src="/foto.png" alt="Foto" className="centered-image" />
      </div>

      <div ref={bannerContainerRef} className="banner-container transparent-banner">
        <div ref={bannerRef} className="banner infinite-banner">
          {repeatedBannerItems.map((item, index) => (
            <span key={index}>{item}</span>
          ))}
        </div>
      </div>
    </>
  );
}