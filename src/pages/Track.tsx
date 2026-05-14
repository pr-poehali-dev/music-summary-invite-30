import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Track = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
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

    const onTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    audio.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      document.removeEventListener("pointerdown", handleInteraction);
      audio.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, []);

  const handleNext = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    navigate("/moments");
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
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

      <audio ref={audioRef} src="https://files.catbox.moe/1sll88.mp3" preload="auto" />

      <div className="content-wrapper">
        <div className="wrapped-header">
          <div className="wrapped-logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#1DB954">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            <span>Spotify</span>
          </div>
          <div className="wrapped-tag">Трек года</div>
        </div>

        <div className="main-content">
          <div className="track-cover" onClick={togglePlay}>
            <div className="track-cover-inner">
              <div className={`track-vinyl ${isPlaying ? "spinning" : ""}`}>
                <div className="vinyl-center" />
              </div>
            </div>
            <div className="track-play-btn">
              {isPlaying ? (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
              ) : (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </div>
          </div>

          <div className="track-info">
            <p className="track-number">#1 трек что нас связывает</p>
            <h2 className="track-title">Казахская вечеринка</h2>
          </div>

          <div className="track-progress-bar">
            <div className="track-progress-fill" style={{ width: `${progress}%` }} />
          </div>

          <div className="invite-block" style={{ marginTop: "8px" }}>
            <p className="track-desc">
              Мы родились в одном месте, но встретились в другом — чтобы сделать кучу воспоминаний друг с другом. И этот трек навсегда нас связывает казахской вечеринкой.
            </p>
          </div>
        </div>

        <button className="reveal-btn" onClick={handleNext}>
          Далее
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Track;