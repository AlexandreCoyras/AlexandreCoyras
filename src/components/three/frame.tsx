import React, { useRef, useState } from "react"
import {
  MeshPortalMaterial,
  PortalMaterialType,
  useCursor,
} from "@react-three/drei"
import { useFrame } from "@react-three/fiber"

const GOLDENRATIO = 1.61803398875

function Frame({
  id,
  width = 1,
  height = GOLDENRATIO,
  children,
  selected,
  setClickedFirstScreen,
  ...props
}: any & {
  id: string
  width?: number
  height?: number
  setClickedFirstScreen: (clickedFirstScreen: boolean) => void
  children: React.ReactNode
}) {
  const portal = useRef<PortalMaterialType>(null)
  const [hovered, hover] = useState(false)
  useCursor(hovered)
  useFrame((state, dt) => {
    if (!portal.current?.blend) return
    // easing.damp(portal.current, 'blend', selected ? 1 : 0, 0.2, dt);
  })
  return (
    <group {...props}>
      <mesh
        name={id}
        position={[0, GOLDENRATIO / 2, 0]}
        onPointerOver={(e) => hover(true)}
        onPointerOut={() => hover(false)}
        onClick={() =>
          setClickedFirstScreen(
            (clickedFirstScreen: any) => !clickedFirstScreen
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
