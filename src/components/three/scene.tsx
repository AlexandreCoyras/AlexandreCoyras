import React, { useEffect } from "react"
import Controls from "@components/three/controls"
import Lights from "@components/three/lights"
import Room from "@components/three/room"
import ScreenScene from "@components/three/screen-scene"
import { extend, useThree } from "@react-three/fiber"
import useSceneStore from "@store/sceneStore"
import { useControls } from "leva"
import { geometry } from "maath"
import { Perf } from "r3f-perf"
import * as THREE from "three"

import ImageMesh from "./image-mesh"

extend(geometry)

// constants
const cvPosition = new THREE.Vector3(-0.575, -0.138, -0.955)
const firstScreenPos = new THREE.Vector3(-0.104, -0.156, -1.0535)
const modelPos = new THREE.Vector3(0.15, -0.85, -0.2025)

const GOLDENRATIO = 1.61803398875

const FirstScreen = () => {
  const {
    clickedFirstScreen,
    clickedSecondScreen,
    setClickedSecondScreen,
    setHoveredSecondScreen,
  } = useSceneStore()


  return (
    // <ImageMesh
    //   src="CV.png"
    //   width={4.1 / 9}
    //   height={4.1 / 16}
    //   position={cvPosition}
    //   rotation={[0, 0.5, 0]}
    //   onClick={() =>
    //     !clickedFirstScreen && setClickedSecondScreen(!clickedSecondScreen)
    //   }
    //   onPointerOver={() => setHoveredSecondScreen(true)}
    //   onPointerOut={() => setHoveredSecondScreen(false)}
    // />
    //   Balck screen
    <mesh
      position={cvPosition}
      rotation={[0, 0.5, 0]}
      onClick={() =>
        !clickedFirstScreen && setClickedSecondScreen(!clickedSecondScreen)
      }
      onPointerOver={() => setHoveredSecondScreen(true)}
      onPointerOut={() => setHoveredSecondScreen(false)}
    >
      <planeGeometry args={[4.1 / 9, 4.1 / 16]} />
      <meshBasicMaterial color={"black"} />
    </mesh>
  )
}

export default function Scene() {
  const { performance } = useControls({
    performance: false,
  })

  const camera = useThree((state) => state.camera)
  
  useEffect(() => {
    camera.lookAt(firstScreenPos)
  }, [])

  return (
    <>
      {performance && (
        <Perf position="bottom-left" style={{ zIndex: 99999999999 }} />
      )}
      <Controls cvPosition={cvPosition} firstScreenPos={firstScreenPos} />
      <Lights />
      <FirstScreen />
      <Room position={modelPos} scale={0.5} />
      <ScreenScene firstScreenPos={firstScreenPos} />
    </>
  )
}
