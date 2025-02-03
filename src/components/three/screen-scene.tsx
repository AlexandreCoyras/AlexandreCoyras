import React, { FC, Suspense } from "react"
import ChatOverlay from "@components/three/chat/chat-overlay"
import ChatRoom from "@components/three/chat/chat-room"
import Frame from "@components/three/frame"
import { Backdrop } from "@react-three/drei"
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
        blend={false}
      >
        <ChatRoom />
      </Frame>

      <Suspense fallback={null}>
      <ChatOverlay
        position={[
          firstScreenPos.x,
          firstScreenPos.y + 0.003,
          firstScreenPos.z + 0.001,
        ]}
      />
      </Suspense>
    </>
  )
}

export default ScreenScene
