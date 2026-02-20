"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

function GlobeConnections() {
  const linesRef = useRef<THREE.Group>(null);

  const connections = useMemo(() => {
    const conns: { start: THREE.Vector3; end: THREE.Vector3 }[] = [];
    const cities = [
      [40.7, -74.0], [51.5, -0.1], [25.2, 55.3], [35.7, 139.7],
      [1.3, 103.8], [-33.9, 151.2], [22.3, 114.2], [48.9, 2.3],
      [55.8, 37.6], [19.1, 72.9], [-23.5, -46.6], [37.6, -122.4],
      [24.7, 46.7], [31.2, 121.5], [41.0, 28.9], [30.0, 31.2],
    ];

    for (let i = 0; i < cities.length; i++) {
      for (let j = i + 1; j < cities.length; j++) {
        if (Math.random() > 0.7) {
          const [lat1, lng1] = cities[i];
          const [lat2, lng2] = cities[j];
          const r = 2.05;
          const phi1 = (90 - lat1) * (Math.PI / 180);
          const theta1 = (lng1 + 180) * (Math.PI / 180);
          const phi2 = (90 - lat2) * (Math.PI / 180);
          const theta2 = (lng2 + 180) * (Math.PI / 180);

          conns.push({
            start: new THREE.Vector3(
              -r * Math.sin(phi1) * Math.cos(theta1),
              r * Math.cos(phi1),
              r * Math.sin(phi1) * Math.sin(theta1)
            ),
            end: new THREE.Vector3(
              -r * Math.sin(phi2) * Math.cos(theta2),
              r * Math.cos(phi2),
              r * Math.sin(phi2) * Math.sin(theta2)
            ),
          });
        }
      }
    }
    return conns;
  }, []);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={linesRef}>
      {connections.map((conn, i) => {
        const mid = new THREE.Vector3()
          .addVectors(conn.start, conn.end)
          .multiplyScalar(0.5)
          .normalize()
          .multiplyScalar(3.0);

        const curve = new THREE.QuadraticBezierCurve3(conn.start, mid, conn.end);
        const points = curve.getPoints(32);

        return (
          <Line
            key={i}
            points={points.map((p) => [p.x, p.y, p.z] as [number, number, number])}
            color="#00D4FF"
            transparent
            opacity={0.25}
            lineWidth={1}
          />
        );
      })}
    </group>
  );
}

function CityDots() {
  const dotsRef = useRef<THREE.Group>(null);

  const cities = useMemo(() => {
    const cityCoords = [
      [40.7, -74.0], [51.5, -0.1], [25.2, 55.3], [35.7, 139.7],
      [1.3, 103.8], [-33.9, 151.2], [22.3, 114.2], [48.9, 2.3],
      [55.8, 37.6], [19.1, 72.9], [-23.5, -46.6], [37.6, -122.4],
      [24.7, 46.7], [31.2, 121.5], [41.0, 28.9], [30.0, 31.2],
    ];

    return cityCoords.map(([lat, lng]) => {
      const r = 2.05;
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
      );
    });
  }, []);

  useFrame((state) => {
    if (dotsRef.current) {
      dotsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={dotsRef}>
      {cities.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#FFD700" />
        </mesh>
      ))}
    </group>
  );
}

export default function Globe() {
  const globeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  const wireframeGeo = useMemo(() => {
    return new THREE.SphereGeometry(2, 36, 36);
  }, []);

  return (
    <group>
      <mesh ref={globeRef} geometry={wireframeGeo}>
        <meshBasicMaterial
          color="#4A90E2"
          wireframe
          transparent
          opacity={0.08}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[2.1, 32, 32]} />
        <meshBasicMaterial
          color="#4A90E2"
          transparent
          opacity={0.03}
          side={THREE.BackSide}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[2.3, 32, 32]} />
        <meshBasicMaterial
          color="#00D4FF"
          transparent
          opacity={0.02}
          side={THREE.BackSide}
        />
      </mesh>

      <CityDots />
      <GlobeConnections />
    </group>
  );
}
