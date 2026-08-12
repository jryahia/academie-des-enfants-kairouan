import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'
import { Owlie, Blobby, Pip } from './three'
/**
 * TEMP dev preview — visual check that the 3D character system renders.
 * Open http://localhost:5173/?stage to view. Delete after verification.
 */
export default function Stage() {
  return (
    <div className="w-full h-screen bg-brand-bg">
      <Canvas camera={{ position: [0, 1.2, 5], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 5, 4]} intensity={1.2} />
        <Suspense fallback={null}>
          <Owlie position={[-1.8, 0, 0]} scale={1} idle="breathing" />
          <Blobby position={[0, 0, 0]} scale={0.9} pulse />
          <Pip position={[1.8, 0.5, 0]} scale={1.2} orbitRadius={0.4} speed={1.2} />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  )
}
