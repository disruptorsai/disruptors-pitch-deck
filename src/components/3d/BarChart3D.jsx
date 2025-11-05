import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Text } from '@react-three/drei'
import { Suspense, useRef, useState } from 'react'
import { useSpring, animated } from '@react-spring/three'
import * as THREE from 'three'

function AnimatedBar({ position, targetHeight, color, label }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  // Animate height
  const { scale } = useSpring({
    scale: [1, targetHeight, 1],
    config: { mass: 1, tension: 180, friction: 12 }
  })

  useFrame((state) => {
    if (meshRef.current && hovered) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1 + targetHeight / 2
    }
  })

  return (
    <group position={position}>
      <animated.mesh
        ref={meshRef}
        scale-y={scale}
        position-y={targetHeight / 2}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[0.8, 1, 0.8]} />
        <meshStandardMaterial
          color={hovered ? '#FFD700' : color}
          metalness={0.5}
          roughness={0.2}
        />
      </animated.mesh>

      {label && (
        <Text
          position={[0, -0.3, 0]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      )}
    </group>
  )
}

export default function BarChart3D({ data, width = '100%', height = 500 }) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-gray-900/20 rounded-lg">
        <p className="text-white/50">No data available</p>
      </div>
    )
  }

  return (
    <div style={{ width, height }} className="rounded-lg overflow-hidden">
      <Canvas shadows>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[5, 5, 5]} />
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <spotLight
            position={[-10, 10, -5]}
            angle={0.3}
            penumbra={1}
            intensity={0.5}
            castShadow
          />

          <OrbitControls
            enableZoom={true}
            enablePan={false}
            maxPolarAngle={Math.PI / 2.2}
            minPolarAngle={Math.PI / 6}
          />

          {data.map((item, i) => {
            const normalizedHeight = (item.value / Math.max(...data.map(d => d.value))) * 3
            return (
              <AnimatedBar
                key={i}
                position={[i * 1.5 - (data.length * 1.5) / 2, 0, 0]}
                targetHeight={normalizedHeight}
                color={item.color || '#D4AF37'}
                label={item.label}
              />
            )
          })}

          <gridHelper args={[10, 10, '#D4AF37', '#555']} position={[0, 0, 0]} />

          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <shadowMaterial opacity={0.3} />
          </mesh>
        </Suspense>
      </Canvas>
    </div>
  )
}
