"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense } from "react";
import { Float, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import StarField from "./StarField";

function GlowingGeometry() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.15;
      meshRef.current.rotation.y = t * 0.2;
    }
    if (wireRef.current) {
      wireRef.current.rotation.x = t * 0.15;
      wireRef.current.rotation.y = t * 0.2;
    }
    if (outerRef.current) {
      outerRef.current.rotation.x = -t * 0.1;
      outerRef.current.rotation.y = -t * 0.15;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <group>
        {/* Inner solid geometry */}
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.8, 1]} />
          <MeshTransmissionMaterial
            backside
            samples={6}
            thickness={0.5}
            chromaticAberration={0.3}
            anisotropy={0.3}
            distortion={0.2}
            distortionScale={0.3}
            temporalDistortion={0.1}
            color="#6366F1"
            transmission={0.95}
            roughness={0.1}
            metalness={0}
          />
        </mesh>

        {/* Wireframe overlay */}
        <mesh ref={wireRef}>
          <icosahedronGeometry args={[1.82, 1]} />
          <meshBasicMaterial
            color="#8B5CF6"
            wireframe
            transparent
            opacity={0.3}
          />
        </mesh>

        {/* Outer rotating ring */}
        <mesh ref={outerRef}>
          <torusGeometry args={[2.8, 0.02, 16, 64]} />
          <meshBasicMaterial
            color="#06B6D4"
            transparent
            opacity={0.3}
          />
        </mesh>

        {/* Glow sphere */}
        <mesh>
          <sphereGeometry args={[2.5, 32, 32]} />
          <meshBasicMaterial
            color="#6366F1"
            transparent
            opacity={0.02}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Corner particles */}
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const r = 2.2;
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * r,
                Math.sin(angle * 1.5) * r * 0.6,
                Math.sin(angle) * r,
              ]}
            >
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshBasicMaterial color="#06B6D4" transparent opacity={0.6} />
            </mesh>
          );
        })}
      </group>
    </Float>
  );
}

export default function HeroScene() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        style={{ background: "transparent" }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <pointLight position={[5, 5, 5]} intensity={0.6} color="#6366F1" />
          <pointLight position={[-5, -5, -5]} intensity={0.3} color="#06B6D4" />
          <GlowingGeometry />
          <StarField count={800} />
        </Suspense>
      </Canvas>
    </div>
  );
}
