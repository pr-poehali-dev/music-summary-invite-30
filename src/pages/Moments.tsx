import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Firework {
  id: number;
  x: number;
  y: number;
  color: string;
  particles: Particle[];
}

interface Particle {
  angle: number;
  speed: number;
  size: number;
  life: number;
  maxLife: number;
}

const COLORS = ["#1DB954", "#FF6B6B", "#F7C948", "#7B61FF", "#FF9F40", "#fff"];
let fwId = 0;

const makeFirework = (): Firework => {
  fwId++;
  const count = 18 + Math.floor(Math.random() * 14);
  return {
    id: fwId,
    x: 10 + Math.random() * 80,
    y: 10 + Math.random() * 55,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    particles: Array.from({ length: count }, () => ({
      angle: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 1.2,
      size: 3 + Math.random() * 4,
      life: 0,
      maxLife: 60 + Math.random() * 40,
    })),
  };
};

const Moments = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fireworks, setFireworks] = useState<Firework[]>([]);
  const activeRef = useRef(true);
  const navigate = useNavigate();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.7;
    audio.loop = true;

    const tryPlay = () => {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    };
    const handleInteraction = () => {
      tryPlay();
      document.removeEventListener("pointerdown", handleInteraction);
    };
    tryPlay();
    document.addEventListener("pointerdown", handleInteraction);
    return () => document.removeEventListener("pointerdown", handleInteraction);
  }, []);

  useEffect(() => {
    activeRef.current = true;
    let lastSpawn = 0;

    const tick = (ts: number) => {
      if (!activeRef.current) return;

      if (ts - lastSpawn > 900) {
        lastSpawn = ts;
        setFireworks((prev) => {
          const updated = prev
            .map((fw) => ({
              ...fw,
              particles: fw.particles.map((p) => ({ ...p, life: p.life + 1 })),
            }))
            .filter((fw) => fw.particles.some((p) => p.life < p.maxLife));
          return [...updated, makeFirework()];
        });
      } else {
        setFireworks((prev) =>
          prev
            .map((fw) => ({
              ...fw,
              particles: fw.particles.map((p) => ({ ...p, life: p.life + 1 })),
            }))
            .filter((fw) => fw.particles.some((p) => p.life < p.maxLife))
        );
      }

      requestAnimationFrame(tick);
    };

    const raf = requestAnimationFrame(tick);
    return () => {
      activeRef.current = false;
      cancelAnimationFrame(raf);
    };
  }, []);

  const handleNext = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    activeRef.current = false;
    navigate("/stats");
  };

  return (
    <div className="spotify-page">
      <div className="bg-stripes">
        <div className="stripe stripe-1" />
        <div className="stripe stripe-2" />
        <div className="stripe stripe-3" />
        <div className="stripe stripe-4" />
        <div className="stripe stripe-5" />
      </div>

      {/* Салюты */}
      <svg className="fireworks-canvas" viewBox="0 0 100 100" preserveAspectRatio="none">
        {fireworks.map((fw) =>
          fw.particles.map((p, i) => {
            const t = p.life / p.maxLife;
            const dist = p.speed * p.life * 0.6;
            const px = fw.x + Math.cos(p.angle) * dist;
            const py = fw.y + Math.sin(p.angle) * dist + p.life * p.life * 0.008;
            const opacity = Math.max(0, 1 - t * 1.2);
            return (
              <circle
                key={`${fw.id}-${i}`}
                cx={px}
                cy={py}
                r={p.size * (1 - t * 0.5) * 0.35}
                fill={fw.color}
                opacity={opacity}
              />
            );
          })
        )}
      </svg>

      <audio ref={audioRef} src="https://files.catbox.moe/re1vms.mp3" preload="auto" />

      <div className="content-wrapper">
        <div className="wrapped-header">
          <div className="wrapped-logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#1DB954">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            <span>Spotify</span>
          </div>
          <div className="wrapped-tag">Моменты</div>
        </div>

        <div className="main-content">
          <div className="moments-icon">✨</div>

          <div className="headline-block">
            <h1 className="moments-title">Момент с тобой</h1>
          </div>

          <div className="moments-text">
            <p>
              Помнишь, как мы делали булочки с сосисками, праздновали Хеллоуин и смотрели фильм с Адамом Сэндлером, болтали и смеялись? Или как я читала тебе фанфики в Китае своим голосом?
            </p>
            <p className="moments-thanks">
              Спасибо тебе за эти моменты.
            </p>
          </div>

          {isPlaying && (
            <div className="music-bar">
              <div className="bar" />
              <div className="bar" />
              <div className="bar" />
              <div className="bar" />
              <div className="bar" />
              <span className="music-label">играет для тебя</span>
            </div>
          )}
        </div>

        <button className="reveal-btn" onClick={handleNext}>
          Что там дальше?
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Moments;