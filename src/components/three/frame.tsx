import React, { useRef } from "react"
import { MeshPortalMaterial, PortalMaterialType } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { easing } from "maath"
import * as THREE from "three"

interface FrameProps {
  id: string
  width: number
  height: number
  setClicked: (clickedFirstScreen: boolean) => void
  children: React.ReactNode
  setHover: (hoveredFirstScreen: boolean) => void
  hovered: boolean
  clicked: boolean
  blend?: boolean
  [key: string]: any
}

function Frame({
  id,
  width = 1,
  height,
  children,
  setClicked,
  setHover,
  hovered,
  clicked,
  blend = true,
  ...props
}: FrameProps & {
  id: string
  width?: number
  height?: number
  setClicked: (clickedFirstScreen: boolean) => void
  children: React.ReactNode
}) {
  const portal = useRef<PortalMaterialType>(null)
  useFrame((_, delta) => {
    if (!portal.current || !blend) return
    easing.damp(portal.current, "blend", clicked ? 1 : 0, 0.5, delta)
  })
  return (
    <group {...props}>
      <mesh
        name={id}
        position={[0, height / 2, 0]}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        onClick={() => setClicked(!clicked)}
      >
        <planeGeometry args={[width, height]} />
        <MeshPortalMaterial ref={portal} side={THREE.FrontSide}>
          <color attach="background" />
          {children}
        </MeshPortalMaterial>
      </mesh>
    </group>
  )
}

export default Frame
