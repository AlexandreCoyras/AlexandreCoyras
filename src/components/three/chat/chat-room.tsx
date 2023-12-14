"use client"

import React, { FC, Suspense } from "react"
import Avatar from "@components/three/chat/avatar"
import { Environment } from "@react-three/drei"

const ChatRoom: FC<any> = (props) => {
  return (
    <>
      <Suspense>
        <Avatar scale={0.1} position={[0, -0.105, 0]} />
      </Suspense>
      {/*<ambientLight intensity={0.9} castShadow={true} />*/}

      <Environment preset={"warehouse"} />
    </>
  )
}

export default ChatRoom