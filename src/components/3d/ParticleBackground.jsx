import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { usePerformanceMonitor } from '@/hooks/use-performance-monitor'

function ParticleField({ count }) {
  const pointsRef = useRef()

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
    }

    return positions
  }, [count])

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.05
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.075
    }
  })

  return (
    <Points ref={pointsRef} positions={particles} stride={3}>
      <PointMaterial
        transparent
        color="#D4AF37"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  )
}

export default function ParticleBackground({ className = '' }) {
  const { profile } = usePerformanceMonitor()

  // Don't render if particles are disabled
  if (!profile.enableParticles) {
    return null
  }

  return (
    <div className={`fixed inset-0 -z-10 opacity-30 ${className}`}>
      <Canvas camera={{ position: [0, 0, 5] }} frameloop="demand">
        <ParticleField count={profile.particleCount} />
      </Canvas>
    </div>
  )
}
