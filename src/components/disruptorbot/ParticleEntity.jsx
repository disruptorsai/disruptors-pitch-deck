/**
 * Particle Entity - The visual representation of DisruptorBot
 *
 * A morphing particle system that reacts to audio and conversation state
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

export function ParticleEntity({ audioLevel = 0, isSpeaking, isListening, isConnected }) {
  const pointsRef = useRef();
  const particleCount = 2000;

  // Generate particle positions in a sphere
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Sphere distribution
      const radius = 1 + Math.random() * 0.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Gradient colors: cyan to orange
      const t = i / particleCount;
      colors[i * 3] = 0.2 + t * 0.8; // R: cyan to orange (increases to 1.0)
      colors[i * 3 + 1] = 0.8 - t * 0.4; // G: high for cyan, medium for orange
      colors[i * 3 + 2] = 1.0 - t * 1.0; // B: high for cyan, low for orange
    }

    return { positions, colors };
  }, []);

  // Animation loop
  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.elapsedTime;
    const positions = pointsRef.current.geometry.attributes.position.array;

    // Determine animation state
    let expansionFactor = 1.0;
    let rotationSpeed = 0.2;

    if (isSpeaking) {
      // Expand and pulse when speaking
      expansionFactor = 1.0 + audioLevel * 0.5 + Math.sin(time * 10) * 0.1;
      rotationSpeed = 0.5;
    } else if (isListening) {
      // Gentle contraction when listening
      expansionFactor = 0.9 + Math.sin(time * 3) * 0.05;
      rotationSpeed = 0.3;
    } else if (!isConnected) {
      // Slow breathing when not connected
      expansionFactor = 0.95 + Math.sin(time) * 0.05;
      rotationSpeed = 0.1;
    }

    // Update particle positions
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Get original sphere position
      const radius = Math.sqrt(
        particles.positions[i3] ** 2 +
        particles.positions[i3 + 1] ** 2 +
        particles.positions[i3 + 2] ** 2
      );

      // Apply expansion
      const scale = expansionFactor + audioLevel * 0.3;

      // Add wave motion
      const wave = Math.sin(time * 2 + radius * 3) * 0.1;

      positions[i3] = particles.positions[i3] * scale + wave;
      positions[i3 + 1] = particles.positions[i3 + 1] * scale + wave;
      positions[i3 + 2] = particles.positions[i3 + 2] * scale + wave;
    }

    // Rotate the entire particle system
    pointsRef.current.rotation.y = time * rotationSpeed;
    pointsRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;

    // Mark for update
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points
      ref={pointsRef}
      positions={particles.positions}
      colors={particles.colors}
      stride={3}
    >
      <PointMaterial
        transparent
        vertexColors
        size={0.015}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={isConnected ? 0.8 : 0.4}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}
