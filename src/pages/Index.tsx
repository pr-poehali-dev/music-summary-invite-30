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
        <div className="top-label">
          <span className="year-badge">2024</span>
          <span className="top-text">твои музыкальные итоги</span>
        </div>

        <div className="main-content">
          <div className="headline-block">
            <p className="greeting-sub">привет,</p>
            <h1 className="name-big">Гулять</h1>
            <p className="greeting-sub">это для тебя</p>
          </div>

          <div className="divider-line" />

          <div className="invite-block">
            <p className="invite-label">специальное приглашение</p>
            <h2 className="invite-title">Отметить<br />твои <em>30</em></h2>
            <p className="invite-desc">
              Год пройден. Тридцать лет — это не просто цифра.<br />
              Это повод собраться и сделать что-то незабываемое.
            </p>
          </div>
        </div>

        {!revealed ? (
          <button className="reveal-btn" onClick={handleReveal}>
            <span className="btn-icon">▶</span>
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

      <div className="bg-glow bg-glow-1" />
      <div className="bg-glow bg-glow-2" />
      <div className="bg-glow bg-glow-3" />
    </div>
  );
};

export default Index;