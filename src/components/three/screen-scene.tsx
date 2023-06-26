import React, { FC } from "react"
import Frame from "@components/three/frame"
import { Gltf } from "@react-three/drei"
import useSceneStore from "@store/sceneStore"
import * as THREE from "three"

interface ScreenProps {
  firstScreenPos: THREE.Vector3
}

const ScreenScene: FC<ScreenProps> = ({ firstScreenPos }) => {
  const {
    clickedFirstScreen,
    hoveredFirstScreen,
    setClickedFirstScreen,
    setHoveredFirstScreen,
  } = useSceneStore()

  return (
    <>
      <Frame
        id="firstScreen"
        position={[
          firstScreenPos.x,
          firstScreenPos.y - 0.137,
          firstScreenPos.z,
        ]}
        width={0.5}
        height={(0.5 / 16) * 9}
        selected={clickedFirstScreen}
        setClicked={setClickedFirstScreen}
        setHover={setHoveredFirstScreen}
        hovered={hoveredFirstScreen}
        clicked={clickedFirstScreen}
      >
        <Gltf
          src="/3d_models/fiesta_tea-transformed.glb"
          // src="/3d_models/fantasy_island-transformed.glb"
          rotation={[0, 0, 0]}
          position={[0, -2, -5]}
        />
      </Frame>
    </>
  )
}

export default ScreenScene
