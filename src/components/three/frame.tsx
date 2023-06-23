import React, { useRef, useState } from "react"
import {
  MeshPortalMaterial,
  PortalMaterialType,
  useCursor,
  useScroll,
} from "@react-three/drei"
import { useFrame } from "@react-three/fiber"

const GOLDENRATIO = 1.61803398875

interface FrameProps {
  id: string
  width?: number
  height?: number
  setClickedFirstScreen: React.Dispatch<React.SetStateAction<boolean>>
  children: React.ReactNode
  setHoveredFirstScreen: React.Dispatch<React.SetStateAction<boolean>>
  hoveredFirstScreen: boolean
  [key: string]: any
}

function Frame({
  id,
  width = 1,
  height = GOLDENRATIO,
  children,
  setClickedFirstScreen,
  setHoveredFirstScreen,
  hoveredFirstScreen,
  ...props
}: FrameProps & {
  id: string
  width?: number
  height?: number
  setClickedFirstScreen: (clickedFirstScreen: boolean) => void
  children: React.ReactNode
}) {
  const portal = useRef<PortalMaterialType>(null)
  useCursor(hoveredFirstScreen)
  useFrame((state, dt) => {
    if (!portal.current?.blend) return
    // easing.damp(portal.current, 'blend', selected ? 1 : 0, 0.2, dt);
  })
  return (
    <group {...props}>
      <mesh
        name={id}
        position={[0, GOLDENRATIO / 2, 0]}
        onPointerOver={(e) => setHoveredFirstScreen(true)}
        onPointerOut={() => setHoveredFirstScreen(false)}
        onClick={() =>
          setClickedFirstScreen(
            (clickedFirstScreen: boolean) => !clickedFirstScreen
          )
        }
      >
        <planeGeometry args={[width, height]} />
        <MeshPortalMaterial ref={portal} events={false}>
          <color attach="background" />
          {children}
        </MeshPortalMaterial>
      </mesh>
    </group>
  )
}

export default Frame
