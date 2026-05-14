import { createContext, useContext, useRef, useState, useCallback, ReactNode } from "react";

interface AudioCtx {
  isPlaying: boolean;
  start: (src: string) => void;
  changeSrc: (src: string) => void;
  pause: () => void;
  toggle: () => void;
  progress: number;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const AudioContext = createContext<AudioCtx | null>(null);

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const setupAudio = useCallback((audio: HTMLAudioElement) => {
    audio.volume = 0.7;
    audio.loop = true;
    audio.ontimeupdate = () => {
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
    };
    audio.onplay = () => setIsPlaying(true);
    audio.onpause = () => setIsPlaying(false);
  }, []);

  const start = useCallback((src: string) => {
    const audio = audioRef.current;
    if (!audio) return;
    setupAudio(audio);
    if (audio.src !== src) {
      audio.src = src;
      audio.load();
    }
    audio.play().catch(() => {});
  }, [setupAudio]);

  const changeSrc = useCallback((src: string) => {
    const audio = audioRef.current;
    if (!audio) return;
    const fullSrc = new URL(src, window.location.href).href;
    if (audio.src === fullSrc) return;
    const wasPlaying = !audio.paused;
    audio.src = src;
    audio.load();
    setupAudio(audio);
    if (wasPlaying) audio.play().catch(() => {});
  }, [setupAudio]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  }, []);

  return (
    <AudioContext.Provider value={{ isPlaying, start, changeSrc, pause, toggle, progress, audioRef }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error("useAudio must be inside AudioProvider");
  return ctx;
};
