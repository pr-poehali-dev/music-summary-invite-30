import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Moments = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.7;
    audio.loop = true;
    const tryPlay = () => audio.play().then(() => setIsPlaying(true)).catch(() => {});
    const handleInteraction = () => { tryPlay(); document.removeEventListener("pointerdown", handleInteraction); };
    tryPlay();
    document.addEventListener("pointerdown", handleInteraction);
    return () => document.removeEventListener("pointerdown", handleInteraction);
  }, []);

  const handleNext = () => {
    const audio = audioRef.current;
    setLeaving(true);
    setTimeout(() => {
      if (audio) { audio.pause(); audio.currentTime = 0; }
      navigate("/stats");
    }, 500);
  };

  return (
    <div className={`spotify-page page-enter ${leaving ? "page-exit" : ""}`}>
      <div className="bg-stripes-animated">
        {[1,2,3,4,5,6].map(i => <div key={i} className={`stripe-anim stripe-anim-${i}`} />)}
      </div>

      {/* Летящие полосы вместо салютов */}
      <div className="burst-stripes">
        {Array.from({length: 12}, (_, i) => (
          <div key={i} className={`burst-stripe burst-stripe-${i+1}`} />
        ))}
      </div>

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
            <p className="moments-thanks">Спасибо тебе за эти моменты.</p>
          </div>
          {isPlaying && (
            <div className="music-bar">
              <div className="bar" /><div className="bar" /><div className="bar" />
              <div className="bar" /><div className="bar" />
              <span className="music-label">играет для тебя</span>
            </div>
          )}
        </div>

        <button className="reveal-btn" onClick={handleNext}>
          Что там дальше?
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </button>
      </div>
    </div>
  );
};

export default Moments;
