"use client"

import React, { Suspense } from "react"
import Avatar from "@components/three/chat/avatar"
import { Environment } from "@react-three/drei"

const ChatRoom = (props: any) => {
  return (
    <>
      <Suspense>
        <Avatar scale={0.1} position={[0, -0.105, 0]} />
      </Suspense>
      <ambientLight intensity={0.5} castShadow={true} />
      <directionalLight
        position={[50, 100, 0]}
        intensity={1.2}
        castShadow={true}
      />
      {/* <Environment preset={"warehouse"} /> */}
    </>
  )
}

export default ChatRoom
