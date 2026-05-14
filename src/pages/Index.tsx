import { useEffect, useRef, useState, useCallback } from "react";

interface Cake {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  rotation: number;
  rotationSpeed: number;
  emoji: string;
}

const EMOJIS = ["🎂", "🎂", "🎂", "🎉", "🎈", "✨", "🎁", "🍰", "🎊", "🥂"];
let cakeIdCounter = 0;

const makeCake = (startY = -80): Cake => {
  cakeIdCounter += 1;
  return {
    id: cakeIdCounter,
    x: Math.random() * 95,
    y: startY,
    size: 24 + Math.random() * 32,
    speed: 1.5 + Math.random() * 3,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 4,
    emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
  };
};


const Index = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [cakes, setCakes] = useState<Cake[]>([]);
  const revealedRef = useRef(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.6;
    audio.loop = true;

    const tryPlay = () => {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    };

    tryPlay();

    const handleInteraction = () => {
      tryPlay();
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
    };

    document.addEventListener("click", handleInteraction);
    document.addEventListener("touchstart", handleInteraction);

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
    };
  }, []);

  const animate = useCallback(() => {
    if (!revealedRef.current) return;
    setCakes((prev) =>
      prev.map((c) => ({ ...c, y: c.y + c.speed * 0.4 })).filter((c) => c.y < 115)
    );
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (!revealed) return;
    revealedRef.current = true;

    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }

    setCakes(Array.from({ length: 22 }, (_, i) => makeCake(-Math.random() * 120 - i * 8)));
    rafRef.current = requestAnimationFrame(animate);

    const spawnInterval = setInterval(() => {
      setCakes((prev) => [...prev, makeCake(-60)]);
    }, 400);

    return () => {
      clearInterval(spawnInterval);
      cancelAnimationFrame(rafRef.current);
      revealedRef.current = false;
    };
  }, [revealed, animate]);

  return (
    <div className="spotify-page">
      {/* Цветные диагональные полоски фона */}
      <div className="bg-stripes">
        <div className="stripe stripe-1" />
        <div className="stripe stripe-2" />
        <div className="stripe stripe-3" />
        <div className="stripe stripe-4" />
        <div className="stripe stripe-5" />
      </div>

      {revealed && (
        <div className="cakes-container">
          {cakes.map((cake) => (
            <span
              key={cake.id}
              className="falling-cake"
              style={{
                left: `${cake.x}%`,
                top: `${cake.y}%`,
                fontSize: `${cake.size}px`,
                transform: `rotate(${cake.rotation + cake.rotationSpeed * cake.y}deg)`,
              }}
            >
              {cake.emoji}
            </span>
          ))}
        </div>
      )}

      <audio ref={audioRef} src="https://files.catbox.moe/ldrhts.mp3" preload="auto" />

      <div className="content-wrapper">
        {/* Шапка как в Spotify Wrapped */}
        <div className="wrapped-header">
          <div className="wrapped-logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#1DB954">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            <span>Spotify</span>
          </div>
          <div className="wrapped-tag">Wrapped '26</div>
        </div>

        <div className="main-content">
          {/* Приветствие */}
          <div className="headline-block">
            <p className="greeting-sub">привет,</p>
            <h1 className="name-big">Гулять</h1>
            <p className="greeting-sub">это для тебя</p>
          </div>

          <div className="divider-line" />

          {/* Блок приглашения */}
          <div className="invite-block">
            <p className="invite-label">не просто музыкальные итоги</p>
            <h2 className="invite-title">а приглашение<br />отметить мои <em>30</em></h2>
          </div>
        </div>

        {!revealed ? (
          <button className="reveal-btn" onClick={() => setRevealed(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            Смотреть итоги
          </button>
        ) : (
          <div className="revealed-msg">
            <span className="big-emoji">🎂</span>
            <p>С днём рождения!</p>
          </div>
        )}

        {isPlaying && !revealed && (
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
    </div>
  );
};

export default Index;