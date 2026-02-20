"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import StarField from "./StarField";
import FloatingOrb from "./FloatingOrb";

export default function HeroScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        style={{ background: "transparent" }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={0.8} color="#4A90E2" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#7B61FF" />
          <StarField count={2500} />
          <FloatingOrb position={[-6, 2, -5]} color="#4A90E2" scale={1.5} speed={0.8} distort={0.3} />
          <FloatingOrb position={[7, -1, -8]} color="#7B61FF" scale={1.2} speed={1.2} distort={0.5} />
          <FloatingOrb position={[0, -4, -6]} color="#00D4FF" scale={0.8} speed={1} distort={0.4} />
          <FloatingOrb position={[-4, -3, -10]} color="#4A90E2" scale={0.6} speed={0.6} distort={0.3} />
          <FloatingOrb position={[5, 4, -12]} color="#00D4FF" scale={1} speed={0.9} distort={0.35} />
        </Suspense>
      </Canvas>
    </div>
  );
}
