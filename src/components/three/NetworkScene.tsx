"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import NeuralNetwork from "./NeuralNetwork";
import StarField from "./StarField";

export default function NetworkScene() {
  return (
    <div className="absolute inset-0 z-0 opacity-30">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ background: "transparent" }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[5, 5, 5]} intensity={0.5} color="#00D4FF" />
          <NeuralNetwork scale={1.5} />
          <StarField count={500} />
        </Suspense>
      </Canvas>
    </div>
  );
}
