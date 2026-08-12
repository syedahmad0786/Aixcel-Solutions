import {Player, type PlayerRef} from "@remotion/player";
import {useEffect, useRef} from "react";
import {createRoot} from "react-dom/client";
import {SignalFilm} from "./SignalFilm";
import "./index.css";

declare global {
  interface Window {
    __signalReady?: boolean;
    __signalSeek?: (frame: number) => Promise<void>;
  }
}

const waitForPaint = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });

const CapturePlayer: React.FC = () => {
  const playerRef = useRef<PlayerRef>(null);

  useEffect(() => {
    window.__signalSeek = async (frame: number) => {
      const player = playerRef.current;
      if (!player) throw new Error("SIGNAL capture player is not mounted");
      player.seekTo(frame);
      await waitForPaint();
    };

    void document.fonts.ready.then(async () => {
      await waitForPaint();
      window.__signalReady = true;
    });

    return () => {
      delete window.__signalSeek;
      delete window.__signalReady;
    };
  }, []);

  return (
    <Player
      ref={playerRef}
      component={SignalFilm}
      durationInFrames={630}
      compositionWidth={1920}
      compositionHeight={1080}
      fps={30}
      controls={false}
      autoPlay={false}
      loop={false}
      acknowledgeRemotionLicense
      style={{width: 1920, height: 1080}}
    />
  );
};

createRoot(document.getElementById("root")!).render(<CapturePlayer/>);
