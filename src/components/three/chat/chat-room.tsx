"use client"

import { FC } from "react"
import Avatar from "@components/three/chat/Avatar"

const ChatRoom: FC<any> = (props) => {
  return (
    <>
      <Avatar scale={0.1} position={[0, -0.1, 0]} />
    </>
  )
}

export default ChatRoom
