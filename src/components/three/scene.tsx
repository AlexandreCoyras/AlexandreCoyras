import React from "react"
import useSettingsStore from "@/store/settingsStore"
import Controls from "@components/three/controls"
import Frame from "@components/three/frame"
import Lights from "@components/three/lights"
import { FaceControls, Gltf, useCursor, useScroll } from "@react-three/drei"
import { extend } from "@react-three/fiber"
import useSceneStore from "@store/sceneStore"
import { geometry } from "maath"
import { Perf } from "r3f-perf"
import * as THREE from "three"
import UAParser from "ua-parser-js"

import ImageMesh from "./image-mesh"

extend(geometry)

// constants
const cvPosition = new THREE.Vector3(-0.575, -0.138, -0.955)
const firstScreenPos = new THREE.Vector3(-0.104, -0.156, -1.0535)
const modelPos = new THREE.Vector3(0.15, -0.85, -0.2025)

const GOLDENRATIO = 1.61803398875

export default function Scene() {
  const {
    clickedFirstScreen,
    clickedSecondScreen,
    hoveredFirstScreen,
    hoveredSecondScreen,
    setClickedFirstScreen,
    setClickedSecondScreen,
    setHoveredFirstScreen,
    setHoveredSecondScreen,
  } = useSceneStore()
  const isDev = process.env.NODE_ENV === "development"
  if (isDev) {
    const leva = require("leva")
    var { performance } = leva.useControls({
      performance: true,
    })
  }
  useCursor(hoveredSecondScreen)

  // when the user clicks on CV screen
  const clickOnCV = () => {
    if (clickedFirstScreen) return
    setClickedSecondScreen(!clickedSecondScreen)
  }

  console.log("render")

  return (
    <>
      {performance && (
        <Perf position="bottom-left" style={{ zIndex: 999999999 }} />
      )}
      <Controls cvPosition={cvPosition} firstScreenPos={firstScreenPos} />
      <Lights />
      <ImageMesh
        src="CV.png"
        width={4.1 / 9}
        height={4.1 / 16}
        position={cvPosition}
        rotation={[0, 0.5, 0]}
        onClick={() => clickOnCV()}
        onPointerOver={() => setHoveredSecondScreen(true)}
        onPointerOut={() => setHoveredSecondScreen(false)}
      />

      <Gltf
        src={"/3d_models/room-transformed.glb"}
        position={modelPos}
        scale={0.5}
      />

      <Frame
        id="firstScreen"
        position={[
          firstScreenPos.x,
          firstScreenPos.y - 0.807,
          firstScreenPos.z,
        ]}
        width={0.5}
        height={(0.5 / 16) * 9}
        selected={clickedFirstScreen}
        setClickedFirstScreen={setClickedFirstScreen}
        setHoveredFirstScreen={setHoveredFirstScreen}
        hoveredFirstScreen={hoveredFirstScreen}
        clickedFirstScreen={clickedFirstScreen}
      >
        <Gltf
          src="/3d_models/fiesta_tea-transformed.glb"
          // src="/3d_models/fantasy_island-transformed.glb"
          rotation={[0, 0, 0]}
          position={[0, -2, -5]}
        />
      </Frame>

      {/*<Html*/}
      {/*    center*/}
      {/*    transform*/}
      {/*    occlude="blending"*/}
      {/*    position={firstScreenPos}*/}
      {/*    scale={0.0106}*/}
      {/*>*/}
      {/*    <div*/}
      {/*        className={*/}
      {/*            'pointer-events-auto items-center justify-center'*/}
      {/*        }*/}
      {/*        onPointerEnter={() => setClickedFirstScreen(true)}*/}
      {/*        onPointerOut={() => setClickedFirstScreen(false)}*/}
      {/*    >*/}
      {/*        <iframe*/}
      {/*            src={'/projects'}*/}
      {/*            width="1920px"*/}
      {/*            height="1080px"*/}
      {/*            className={'pointer-events-auto inline-block p-3'}*/}
      {/*        />*/}
      {/*    </div>*/}
      {/*</Html>*/}
    </>
  )
}
