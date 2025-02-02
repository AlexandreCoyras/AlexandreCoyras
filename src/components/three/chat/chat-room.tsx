"use client"

import React, { Suspense } from "react"
import Avatar from "@components/three/chat/avatar"
import { Backdrop, Environment } from "@react-three/drei"

const ChatRoom = (props: any) => {
  return (
    <>
      <Suspense>
        <Avatar scale={0.105} position={[0, -0.12, -0.05]} />
      </Suspense>
      <ambientLight intensity={1} castShadow={true} />
      <directionalLight
        position={[10, 40, 0]}
        intensity={4}
        castShadow={true}
      />
      {/* <Environment preset={"warehouse"} /> */}
    </>
  )
}

export default ChatRoom
