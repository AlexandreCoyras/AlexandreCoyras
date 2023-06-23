import React, { MutableRefObject, useEffect, useRef, useState } from "react"
import useSettingsStore from "@/store/settingsStore"
import Controls from "@components/three/controls"
import Frame from "@components/three/frame"
import Lights from "@components/three/lights"
import { FaceControls, Gltf, useCursor, useScroll } from "@react-three/drei"
import { extend } from "@react-three/fiber"
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

export default function Scene({
  cvLinkRef,
  dofRef,
}: {
  cvLinkRef: MutableRefObject<any>
  dofRef: MutableRefObject<null>
}) {
  const [clickedCV, setClickedCV] = useState(false)
  const [hoveredCV, setHoveredCV] = useState(false)
  const [clickedFirstScreen, setClickedFirstScreen] = useState(false)
  const [hoveredFirstScreen, setHoveredFirstScreen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { faceControls, eyeControls } = useSettingsStore()
  // useHelper(lightRef1, PointLightHelper, 0.1, 'cyan');
  // useHelper(lightRef2, PointLightHelper, 0.1, 'red');
  const [isDev] = useState(process.env.NODE_ENV === "development")
  if (isDev) {
    const leva = require("leva")
    var { performance } = leva.useControls({
      performance: true,
    })
  }
  const maxDelta = 0.066 // 15 fps

  useCursor(hoveredCV)

  useEffect(() => {
    const parser = new UAParser()
    const deviceType = parser.getDevice().type
    setIsMobile(deviceType === "mobile")
  }, [])

  // when the user clicks on CV screen
  const clickOnCV = () => {
    setClickedCV(!clickedCV)
    if (!cvLinkRef.current) return
    cvLinkRef.current.style.opacity = clickedCV ? 0 : 1
    cvLinkRef.current.style.visibility = clickedCV ? "hidden" : "visible"
  }

  console.log("render")

  return (
    <>
      {performance && (
        <Perf position="bottom-left" style={{ zIndex: 999999999 }} />
      )}
      <Controls
        clickedCV={clickedCV}
        cvPosition={cvPosition}
        clickedFirstScreen={clickedFirstScreen}
        hoveredCV={hoveredCV}
        hoveredFirstScreen={hoveredFirstScreen}
        firstScreenPos={firstScreenPos}
        isMobile={isMobile}
      />
      <Lights />
      <ImageMesh
        src="CV.png"
        width={4.1 / 9}
        height={4.1 / 16}
        position={cvPosition}
        rotation={[0, 0.5, 0]}
        onClick={() => clickOnCV()}
        onPointerOver={() => setHoveredCV(true)}
        onPointerOut={() => setHoveredCV(false)}
      />

      {/*<Model position={modelPos} scale={0.5} />*/}
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
