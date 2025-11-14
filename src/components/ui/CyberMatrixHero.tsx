'use client';

import React, { useEffect, useRef, useState } from 'react';

const CyberMatrixHero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isClient, setIsClient] = useState(false);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastScrollYRef = useRef<number>(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789<>/?;:"[]{}\\|!@#$%^&*()_+-=';
    const tileSize = 70;
    let columns = 0;
    let rows = 0;

    type Tile = {
      x: number;
      y: number;
      char: string;
      intensity: number;
      glitchFrames: number;
      scale: number;
      lastUpdated: number;
    };

    let tiles: Tile[] = [];
    let mouseX = -9999;
    let mouseY = -9999;

    const MAX_ACTIVE_GLITCH = 0;
    const activeGlitches: Tile[] = [];

    // ⚡ OPTIMIZAÇÃO: Throttle para reduzir atualizações
    let lastUpdateTime = 0;
    const UPDATE_INTERVAL = 1000 / 30; // 30 FPS para updates

    // ⚡ OPTIMIZAÇÃO: Viewport tracking
    let viewportTop = 0;
    let viewportBottom = 0;
    const VIEWPORT_BUFFER = 300; // pixels de buffer

    // 🔥 NOVO: Definir altura da primeira seção (100vh)
    let FIRST_SECTION_HEIGHT = window.innerHeight;

    const updateViewport = () => {
      const scrollY = window.scrollY;
      viewportTop = scrollY - VIEWPORT_BUFFER;
      viewportBottom = scrollY + window.innerHeight + VIEWPORT_BUFFER;
    };

    const createGrid = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 5; // Mantém 500vh

      // 🔥 ATUALIZAR: Altura da primeira seção
      FIRST_SECTION_HEIGHT = window.innerHeight;

      columns = Math.floor(canvas.width / tileSize);
      rows = Math.floor(canvas.height / tileSize);

      tiles = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
          tiles.push({
            x: x * tileSize + tileSize / 2,
            y: y * tileSize + tileSize / 2,
            char: chars[Math.floor(Math.random() * chars.length)],
            intensity: 0,
            glitchFrames: 0,
            scale: 1,
            lastUpdated: 0,
          });
        }
      }
    };

    // ⚡ OPTIMIZAÇÃO: Atualiza apenas tiles visíveis ou próximos
    const update = (currentTime: number) => {
      if (currentTime - lastUpdateTime < UPDATE_INTERVAL) {
        return;
      }
      lastUpdateTime = currentTime;

      updateViewport();
      const radius = 250;

      tiles.forEach((tile) => {
        // 🔥 MODIFICADO: Se o tile está na primeira seção (primeiros 100vh), SEMPRE atualiza
        const isInFirstSection = tile.y <= FIRST_SECTION_HEIGHT;
        
        if (!isInFirstSection) {
          // ⚡ SÓ APLICA OTIMIZAÇÕES PARA TILES FORA DA PRIMEIRA SEÇÃO
          if (tile.y < viewportTop || tile.y > viewportBottom) {
            // Reduz intensidade gradualmente para tiles fora da viewport
            if (tile.intensity > 0) {
              tile.intensity += (0 - tile.intensity) * 0.1;
            }
            return;
          }
        }

        const dx = mouseX - tile.x;
        const dy = mouseY - tile.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < radius) {
          tile.intensity += (1 - distance / radius - tile.intensity) * 0.2;
        } else {
          tile.intensity += (0 - tile.intensity) * 0.05;
        }

        if (tile.glitchFrames > 0) {
          tile.glitchFrames--;
          tile.scale = 1 + Math.random() * 0.3;
          tile.intensity = 1;
        } else {
          tile.scale += (1 - tile.scale) * 0.2;
          const index = activeGlitches.indexOf(tile);
          if (index !== -1) activeGlitches.splice(index, 1);
        }

        tile.lastUpdated = currentTime;
      });
    };

    // ⚡ OPTIMIZAÇÃO: Desenha apenas tiles visíveis
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = '1.0rem Courier New, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      tiles.forEach((tile) => {
        // 🔥 MODIFICADO: Se o tile está na primeira seção (primeiros 100vh), SEMPRE desenha
        const isInFirstSection = tile.y <= FIRST_SECTION_HEIGHT;
        
        if (!isInFirstSection) {
          // ⚡ SÓ APLICA OTIMIZAÇÕES PARA TILES FORA DA PRIMEIRA SEÇÃO
          if (tile.y < viewportTop || tile.y > viewportBottom) {
            return;
          }

          const intensity = tile.intensity;
          
          // ⚡ OPTIMIZAÇÃO: Não desenha tiles com intensidade muito baixa (apenas fora da primeira seção)
          if (intensity < 0.05 && tile.glitchFrames === 0) {
            return;
          }
        }

        const intensity = tile.intensity;
        
        ctx.save();
        ctx.translate(tile.x, tile.y);
        ctx.scale(tile.scale, tile.scale);

        if (tile.glitchFrames > 0) {
          ctx.fillStyle = Math.random() > 0.5 ? '#fff' : '#0f0';
          ctx.shadowColor = ctx.fillStyle;
          ctx.shadowBlur = 10;
        } else {
          ctx.fillStyle = `hsl(120,100%,${50 + intensity * 50}%)`;
          ctx.shadowColor = `hsl(120,100%,50%)`;
          ctx.shadowBlur = intensity * 10;
        }

        ctx.globalAlpha = 0.1 + intensity * 0.9;
        ctx.fillText(tile.char, 0, 0);
        ctx.restore();
      });
      ctx.globalAlpha = 1;
    };

    const loop = (currentTime: number) => {
      update(currentTime);
      draw();
      animationFrameRef.current = requestAnimationFrame(loop);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY + window.scrollY;
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top + window.scrollY;

      updateViewport();
      
      tiles.forEach((tile) => {
        // 🔥 MODIFICADO: Para clicks, verifica todos os tiles (incluindo primeira seção)
        if (
          clickX >= tile.x - tileSize / 2 &&
          clickX <= tile.x + tileSize / 2 &&
          clickY >= tile.y - tileSize / 2 &&
          clickY <= tile.y + tileSize / 2
        ) {
          if (activeGlitches.length < MAX_ACTIVE_GLITCH && Math.random() < 0.5) {
            tile.char = chars[Math.floor(Math.random() * chars.length)];
            tile.glitchFrames = 5;
            activeGlitches.push(tile);
          }
        }
      });
    };

    // ⚡ OPTIMIZAÇÃO: Throttle no resize
    let resizeTimeout: number | undefined;
    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        createGrid();
        draw();
      }, 250);
    };

    // ⚡ OPTIMIZAÇÃO: Scroll suave com throttle
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Só força redraw se o scroll for significativo
      if (Math.abs(currentScrollY - lastScrollYRef.current) > 50) {
        lastScrollYRef.current = currentScrollY;
        draw();
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    canvas.addEventListener('click', handleClick);

    createGrid();
    updateViewport();
    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      canvas.removeEventListener('click', handleClick);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
    };
  }, [isClient]);

  return (
    <div className="relative w-full bg-black overflow-hidden">
      <canvas
        ref={canvasRef}
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          display: 'block',
          // ⚡ OPTIMIZAÇÃO: Melhora performance de rendering
          willChange: 'transform',
          backfaceVisibility: 'hidden'
        }}
      />
    </div>
  );
};

export default CyberMatrixHero;