import React from 'react'
import { Canvas, useFrame, useThree } from 'react-three-fiber'
import { Physics, useSphere, useBox, usePlane } from 'use-cannon'
import './styles.css'

export const Ball = ({ args = [0.5, 32, 32] }) => {
  const { viewport } = useThree()
  const [ref, api] = useSphere(() => ({ args: 0.5, mass: 1 })) // size & mass

  usePlane(() => ({
    position: [0, -viewport.height, 0],
    rotation: [-Math.PI / 2, 0, 0],
    onCollide: () => {
      api.position.set(0, 0, 0)
      api.velocity.set(0, 0, 0)
    }
  }))

  return (
    <mesh {...{ ref }}>
      <sphereBufferGeometry {...{ args }} />
      <meshStandardMaterial color="white" />
    </mesh>
  )
}

export const Paddel = ({ args = [2, 0.5, 1] }) => {
  // args [radius : Float, widthSegments : Integer, heightSegments : Integer]
  const [ref, api] = useBox(() => ({ args }))

  useFrame((state) => {
    api.position.set(state.mouse.x * (state.viewport.width / 2), -state.viewport.height / 3, 0)
    api.rotation.set(0, 0, (state.mouse.x * Math.PI) / 5)
  }) // need to use it if we depend of physic => frame at 60 fps, it's loop

  return (
    <mesh {...{ ref }}>
      <boxBufferGeometry {...{ args }} />
      <meshStandardMaterial color="lightblue" />
    </mesh>
  )
}

export const Enemy = ({ color, args = [2, 0.5, 1], ...props }) => {
  // args [radius : Float, widthSegments : Integer, heightSegments : Integer]
  const [ref, api] = useBox(() => ({ ...props, args }))

  return (
    <mesh {...{ ref }}>
      <boxBufferGeometry {...{ args }} />
      <meshStandardMaterial {...{ color }} />
    </mesh>
  )
}

export default function App() {
  return (
    <Canvas camera={{ position: [0, 5, 12], fov: 50 }}>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 5]} />
      <pointLight position={[-10, -10, -5]} />
      <Physics gravity={[0, -30, 0]} defaultContactMaterial={{ restitution: 1.1 }}>
        <Ball />
        <Paddel />
        <Enemy color="orange" position={[1, 1, 0]} />
        <Enemy color="pink" position={[-1, 3, 0]} />
      </Physics>
    </Canvas>
  )
}
