import React, { useRef } from "react"
import { useLoader } from "@react-three/fiber"
import * as THREE from "three"

function ImageMesh(props: any) {
  const meshRef = useRef(null)
  const texture = useLoader(THREE.TextureLoader, props.src)

  return (
    <>
      {texture instanceof THREE.Texture && (
        <mesh
          ref={meshRef}
          position={props.position}
          onPointerEnter={props.onPointerOver}
          rotation={props.rotation}
          onPointerOut={props.onPointerOut}
          onClick={props.onClick}
        >
          <planeGeometry args={[props.width, props.height]} />
          <meshBasicMaterial map={texture} color={"white"} />
        </mesh>
      )}
    </>
  )
}

export default ImageMesh
