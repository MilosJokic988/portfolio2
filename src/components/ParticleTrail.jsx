import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function ParticleTrail({ camera }) {
  const particles = useRef();
  const count = 200;
  const positions = new Float32Array(count * 3);

  // inicijalna random pozicija
  for (let i = 0; i < count; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 1; // x
    positions[i * 3 + 1] = (Math.random() - 0.5) * 1; // y
    positions[i * 3 + 2] = (Math.random() - 0.5) * 1; // z
  }

  useFrame(() => {
    if (!particles.current || !camera) return;

    const positions = particles.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] += (Math.random() - 0.5) * 0.02;
      positions[i * 3 + 1] += (Math.random() - 0.5) * 0.02;
      positions[i * 3 + 2] += -0.1; // lagani pokret unazad
      // reset pozicije iza kamere
      if (positions[i * 3 + 2] < camera.position.z - 5) {
        positions[i * 3 + 0] = camera.position.x + (Math.random() - 0.5);
        positions[i * 3 + 1] = camera.position.y + (Math.random() - 0.5);
        positions[i * 3 + 2] = camera.position.z + 2;
      }
    }
    particles.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particles}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        attach="material"
        color="#66d3ff"
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.8}
      />
    </points>
  );
}
