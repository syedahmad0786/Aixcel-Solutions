import "./index.css";
import {loadFont} from "@remotion/fonts";
import {Composition, Folder, Still, staticFile} from "remotion";
import {SignalFilm} from "./SignalFilm";
import {SignalPoster, SignalSocialCard} from "./Poster";
import {IntroScene} from "./scenes/IntroScene";
import {ObservationScene} from "./scenes/ObservationScene";
import {EvidenceScene} from "./scenes/EvidenceScene";
import {ActionScene} from "./scenes/ActionScene";
import {BoundaryScene} from "./scenes/BoundaryScene";

void Promise.all([
  loadFont({family: "Signal Display", url: staticFile("SchibstedGrotesk.woff2"), weight: "500"}),
  loadFont({family: "Signal Sans", url: staticFile("IBMPlexSans.woff2"), weight: "400"}),
  loadFont({family: "Signal Mono", url: staticFile("IBMPlexMono.woff2"), weight: "500"}),
]);

export const RemotionRoot: React.FC = () => (
  <>
    <Folder name="Signal-Film-Scenes">
      <Composition id="Signal-Question" component={IntroScene} durationInFrames={120} fps={30} width={1920} height={1080}/>
      <Composition id="Signal-Observation" component={ObservationScene} durationInFrames={150} fps={30} width={1920} height={1080}/>
      <Composition id="Signal-Evidence" component={EvidenceScene} durationInFrames={150} fps={30} width={1920} height={1080}/>
      <Composition id="Signal-Action" component={ActionScene} durationInFrames={135} fps={30} width={1920} height={1080}/>
      <Composition id="Signal-Boundary" component={BoundaryScene} durationInFrames={135} fps={30} width={1920} height={1080}/>
    </Folder>
    <Composition id="Signal-Product-Film" component={SignalFilm} durationInFrames={630} fps={30} width={1920} height={1080}/>
    <Still id="Signal-Film-Poster" component={SignalPoster} width={1920} height={1080}/>
    <Still id="Signal-Social-Card" component={SignalSocialCard} width={1200} height={630}/>
  </>
);
