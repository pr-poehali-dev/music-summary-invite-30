import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const STATS = [
  {
    label: "Сколько мы дружим",
    value: "2 649",
    unit: "дней",
    color: "#1DB954",
    delay: 0,
  },
  {
    label: "Сколько раз ты была на моём дне рождения",
    value: "6",
    unit: "раз",
    color: "#F7C948",
    delay: 150,
  },
  {
    label: "Как сильно я дорожу тобой",
    value: "∞",
    unit: "от луны и обратно",
    color: "#FF6B6B",
    delay: 300,
  },
];

const Stats = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [visible, setVisible] = useState([false, false, false]);
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
    STATS.forEach((s, i) => {
      setTimeout(() => {
        setVisible((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, 200 + s.delay);
    });
  }, []);

  const handleNext = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    navigate("/party");
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

      <audio ref={audioRef} src="https://files.catbox.moe/3ku0qd.mp3" preload="auto" />

      <div className="content-wrapper">
        <div className="wrapped-header">
          <div className="wrapped-logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#1DB954">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            <span>SpotIRA</span>
          </div>
          <div className="wrapped-tag">Наша статистика</div>
        </div>

        <div className="main-content">
          <div className="headline-block">
            <p className="greeting-sub">твои цифры</p>
            <h1 className="name-big" style={{ fontSize: "clamp(42px, 10vw, 68px)" }}>этого года</h1>
          </div>

          <div className="friendship-stats">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={`friendship-card ${visible[i] ? "card-visible" : "card-hidden"}`}
                style={{ borderColor: s.color + "50" }}
              >
                <span className="friendship-value" style={{ color: s.color }}>{s.value}</span>
                <div className="friendship-right">
                  <span className="friendship-unit">{s.unit}</span>
                  <span className="friendship-label">{s.label}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="stats-closing">
            Я хочу разделить с тобой свои 30 лет и переход в новое десятилетие.
          </p>

          {isPlaying && (
            <div className="music-bar">
              <div className="bar" />
              <div className="bar" />
              <div className="bar" />
              <div className="bar" />
              <div className="bar" />
              <span className="music-label">трек, который с тобой ассоциируется</span>
            </div>
          )}
        </div>

        <button className="reveal-btn" onClick={handleNext}>
          Подробности
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Stats;