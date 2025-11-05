/**
 * DisruptorBot 3D Canvas
 *
 * Renders the 3D particle visualization that reacts to audio
 */

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { ParticleEntity } from './ParticleEntity';

export function DisruptorBotCanvas({ audioLevel, isSpeaking, isListening, isConnected }) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          {/* Ambient lighting */}
          <ambientLight intensity={0.2} />

          {/* Key light */}
          <pointLight position={[10, 10, 10]} intensity={0.5} color="#00ffff" />
          <pointLight position={[-10, -10, -10]} intensity={0.3} color="#ff00ff" />

          {/* The particle entity */}
          <ParticleEntity
            audioLevel={audioLevel}
            isSpeaking={isSpeaking}
            isListening={isListening}
            isConnected={isConnected}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
