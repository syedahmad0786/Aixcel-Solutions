"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

export default function NeuralNetwork({ scale = 1 }: { scale?: number }) {
  const groupRef = useRef<THREE.Group>(null);

  const { nodes, edges } = useMemo(() => {
    const n: THREE.Vector3[] = [];
    const e: [number, number][] = [];

    const layers = [4, 6, 8, 6, 4];
    let nodeIndex = 0;

    layers.forEach((count, layerIdx) => {
      for (let i = 0; i < count; i++) {
        const x = (layerIdx - 2) * 1.5;
        const y = (i - (count - 1) / 2) * 0.8;
        const z = (Math.random() - 0.5) * 0.5;
        n.push(new THREE.Vector3(x, y, z));

        if (layerIdx > 0) {
          const prevStart = nodeIndex - count - layers[layerIdx - 1];
          for (let j = 0; j < layers[layerIdx - 1]; j++) {
            if (Math.random() > 0.3) {
              e.push([prevStart + j + count, nodeIndex]);
            }
          }
        }
        nodeIndex++;
      }
    });

    return { nodes: n, edges: e };
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      {/* Nodes */}
      {nodes.map((pos, i) => (
        <mesh key={`node-${i}`} position={pos}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial
            color="#00D4FF"
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}

      {/* Edges */}
      {edges.map(([from, to], i) => {
        if (!nodes[from] || !nodes[to]) return null;
        return (
          <Line
            key={`edge-${i}`}
            points={[
              [nodes[from].x, nodes[from].y, nodes[from].z],
              [nodes[to].x, nodes[to].y, nodes[to].z],
            ]}
            color="#4A90E2"
            transparent
            opacity={0.15}
            lineWidth={1}
          />
        );
      })}
    </group>
  );
}
