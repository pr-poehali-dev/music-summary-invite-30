import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const navigate = useNavigate();

  const startMusic = () => {
    const audio = audioRef.current;
    if (!audio || isPlaying) return;
    audio.volume = 0.6;
    audio.loop = true;
    audio.play().then(() => setIsPlaying(true)).catch(() => {});
  };

  const handleReveal = () => {
    const audio = audioRef.current;
    setLeaving(true);
    setTimeout(() => {
      if (audio) { audio.pause(); audio.currentTime = 0; }
      navigate("/track");
    }, 500);
  };

  return (
    <div className={`spotify-page page-enter ${leaving ? "page-exit" : ""}`}>
      <div className="bg-stripes-animated">
        {[1,2,3,4,5,6].map(i => <div key={i} className={`stripe-anim stripe-anim-${i}`} />)}
      </div>

      <audio ref={audioRef} src="https://files.catbox.moe/ldrhts.mp3" preload="auto" />

      <div className="content-wrapper">
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
          <div className="headline-block">
            <p className="greeting-sub">привет,</p>
            <h1 className="name-big">Гулять</h1>
            <p className="greeting-sub">это для тебя</p>
          </div>

          <div className="divider-line" />

          <div className="invite-block">
            <p className="invite-label">не просто музыкальные итоги</p>
            <h2 className="invite-title">а приглашение<br />отметить мои <em>30</em></h2>
          </div>
        </div>

        {!isPlaying ? (
          <button className="tap-music-btn" onClick={startMusic}>
            <span className="tap-music-icon">▶</span>
            Нажми сюда
          </button>
        ) : (
          <div className="music-playing-block">
            <div className="music-bar">
              <div className="bar" /><div className="bar" /><div className="bar" />
              <div className="bar" /><div className="bar" />
              <span className="music-label">играет для тебя</span>
            </div>
            <button className="reveal-btn" onClick={handleReveal}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              Смотреть итоги
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
