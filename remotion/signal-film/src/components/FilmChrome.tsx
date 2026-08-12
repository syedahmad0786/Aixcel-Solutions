import type {ReactNode} from "react";
import {AbsoluteFill, CanvasImage, Interactive, staticFile} from "remotion";

type FilmChromeProps = {readonly step: number; readonly label: string; readonly children: ReactNode;};

export const FilmChrome: React.FC<FilmChromeProps> = ({step, label, children}) => (
  <AbsoluteFill style={{backgroundColor: "#0b1211", color: "#f7f9f8", fontFamily: "Signal Sans", overflow: "hidden"}}>
    <AbsoluteFill style={{backgroundImage: "linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)", backgroundSize: "120px 120px"}}/>
    <Interactive.Div name="Film header" style={{height: 112, position: "absolute", top: 0, left: 88, right: 88, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #33403b"}}>
      <div style={{display: "flex", alignItems: "center", gap: 18}}><CanvasImage name="SIGNAL symbol" src={staticFile("signal-symbol-light.svg")} width={50} height={50}/><div style={{display: "grid", lineHeight: 1}}><span style={{fontFamily: "Signal Mono", fontSize: 14, letterSpacing: "0.22em", color: "#8f9a96"}}>AIXCEL</span><strong style={{marginTop: 7, fontFamily: "Signal Display", fontSize: 27, letterSpacing: "-0.035em"}}>SIGNAL</strong></div></div>
      <div style={{display: "flex", alignItems: "center", gap: 24, fontFamily: "Signal Mono", fontSize: 14, letterSpacing: "0.08em", color: "#8f9a96"}}><span>SYNTHETIC DEMONSTRATION</span><span style={{padding: "10px 13px", border: "1px solid #33403b", color: "#9eb2ff"}}>0{step} / 05</span></div>
    </Interactive.Div>
    <div style={{position: "absolute", inset: "112px 88px 94px"}}>{children}</div>
    <Interactive.Div name="Film footer" style={{height: 64, position: "absolute", left: 88, right: 88, bottom: 0, display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #33403b", fontFamily: "Signal Mono", fontSize: 13, letterSpacing: "0.09em", color: "#8f9a96"}}>
      <span>{label.toUpperCase()}</span><div style={{display: "flex", gap: 8}}>{[1,2,3,4,5].map((item) => <i key={item} style={{width: item === step ? 52 : 18, height: 3, display: "block", backgroundColor: item <= step ? "#6687ff" : "#33403b"}}/>)}</div><span>NO CLIENT DATA</span>
    </Interactive.Div>
  </AbsoluteFill>
);
