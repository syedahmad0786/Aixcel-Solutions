import {TransitionSeries, linearTiming} from "@remotion/transitions";
import {fade} from "@remotion/transitions/fade";
import {IntroScene} from "./scenes/IntroScene";
import {ObservationScene} from "./scenes/ObservationScene";
import {EvidenceScene} from "./scenes/EvidenceScene";
import {ActionScene} from "./scenes/ActionScene";
import {BoundaryScene} from "./scenes/BoundaryScene";

export const SignalFilm: React.FC = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence name="Buyer question" durationInFrames={120}><IntroScene/></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})}/>
    <TransitionSeries.Sequence name="Observed answer" durationInFrames={150}><ObservationScene/></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})}/>
    <TransitionSeries.Sequence name="Source evidence" durationInFrames={150}><EvidenceScene/></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})}/>
    <TransitionSeries.Sequence name="Ranked action" durationInFrames={135}><ActionScene/></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})}/>
    <TransitionSeries.Sequence name="Boundaries" durationInFrames={135}><BoundaryScene/></TransitionSeries.Sequence>
  </TransitionSeries>
);
