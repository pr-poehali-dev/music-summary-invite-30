import { useEffect, useRef, useState } from "react";

const SCHEDULE = [
  { time: "17:30 – 18:30", desc: "Сбор, лёгкий перекус, первые тосты" },
  { time: "18:30 – 20:30", desc: "Вкусно кушаем, вкусно пьём и проходим квиз по Иришке" },
  { time: "20:30 – 22:00", desc: "Слушаем музыку, общаемся" },
];

const Party = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.7;
    audio.loop = true;
    const tryPlay = () => audio.play().then(() => setIsPlaying(true)).catch(() => {});
    const handleInteraction = () => { tryPlay(); document.removeEventListener("pointerdown", handleInteraction); };
    tryPlay();
    document.addEventListener("pointerdown", handleInteraction);
    setTimeout(() => setVisible(true), 80);
    return () => document.removeEventListener("pointerdown", handleInteraction);
  }, []);

  return (
    <div className={`spotify-page party-page page-enter`}>
      <div className="party-bg-glow party-glow-1" />
      <div className="party-bg-glow party-glow-2" />
      <div className="party-bg-glow party-glow-3" />

      <div className="bg-stripes-animated">
        {[1,2,3,4,5,6].map(i => <div key={i} className={`stripe-anim stripe-anim-${i}`} />)}
      </div>

      <audio ref={audioRef} src="https://files.catbox.moe/trc7we.mp3" preload="auto" />

      <div className={`content-wrapper party-content ${visible ? "party-visible" : "party-hidden"}`}>
        <div className="wrapped-header">
          <div className="wrapped-logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#1DB954">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            <span>SpotIRA</span>
          </div>
          <div className="wrapped-tag" style={{ background: "linear-gradient(135deg, #FF6B6B, #F7C948)" }}>27 июня</div>
        </div>

        <div className="party-hero">
          <p className="party-waiting">жду тебя</p>
          <div className="party-date-block">
            <span className="party-date">27 июня</span>
            <span className="party-time">в 17:30</span>
          </div>
        </div>

        <div className="party-address-card">
          <div className="party-address-icon">📍</div>
          <div className="party-address-text">
            <p className="party-address-main">Московский проспект 139А</p>
            <p className="party-address-sub">м Электросила · вход с торца через железную калитку</p>
            <p className="party-address-phone">Мой номер знаешь 🤍</p>
          </div>
        </div>

        <div className="party-schedule">
          <p className="party-schedule-title">✦ что тебя ждёт ✦</p>
          <div className="party-schedule-list">
            {SCHEDULE.map((item, i) => (
              <div className="party-schedule-item" key={i}>
                <span className="party-schedule-time">{item.time}</span>
                <span className="party-schedule-desc">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {isPlaying && (
          <div className="music-bar">
            <div className="bar" /><div className="bar" /><div className="bar" />
            <div className="bar" /><div className="bar" />
            <span className="music-label">играет для тебя</span>
          </div>
        )}

        <a
          href="https://docs.google.com/spreadsheets/d/1Ku3rdanulnFMoDGRRYnycAnj4sJThtFrm7mCLC-oufE/edit?gid=0#gid=0"
          target="_blank"
          rel="noopener noreferrer"
          className="wishlist-btn"
        >
          🎁 Wishlist
        </a>
      </div>
    </div>
  );
};

export default Party;