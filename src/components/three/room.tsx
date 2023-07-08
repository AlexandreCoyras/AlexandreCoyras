import { FC } from "react"
import { useGLTF } from "@react-three/drei"

const Room: FC<any> = (props: any) => {
  const { scene } = useGLTF("/3d_models/room-transformed.glb")
  return <primitive object={scene} {...props} />
}

useGLTF.preload("/3d_models/room-transformed.glb")
export default Room
