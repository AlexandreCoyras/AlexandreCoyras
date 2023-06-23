import React, { MutableRefObject, useEffect, useRef, useState } from "react"
import useSettingsStore from "@/store/settingsStore"
import Controls from "@components/three/controls"
import Frame from "@components/three/frame"
import { FaceControls, Gltf, useCursor } from "@react-three/drei"
import { extend } from "@react-three/fiber"
import { geometry } from "maath"
import { Perf } from "r3f-perf"
import * as THREE from "three"
import UAParser from "ua-parser-js"

import ImageMesh from "./image-mesh"

extend(geometry)

// constants
const lightPos: number[] = [-0.11, -0.16, -0.9]
const lightPos2: number[] = [-0.56, -0.16, -0.94]
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
  const [lightIntensity, setLightIntensity] = useState(1)
  // const [mouseX, setMouseX] = useState(0);
  // const [mouseY, setMouseY] = useState(0);
  const [isMobile, setIsMobile] = useState(false)
  const lightRef1 = useRef<any>(null)
  const lightRef2 = useRef<any>(null)
  const { faceControls, eyeControls } = useSettingsStore()
  // useHelper(lightRef1, PointLightHelper, 0.1, 'cyan');
  // useHelper(lightRef2, PointLightHelper, 0.1, 'red');
  const [isDev] = useState(process.env.NODE_ENV === "development")
  if (isDev) {
    const leva = require("leva")
    var { performance, helperActive, lightPosH1, lightPosH2 } =
      leva.useControls({
        performance: true,
        helperActive: false,
        lightPosH1: lightPos,
        lightPosH2: lightPos2,
      })
    helperActive = true
  }
  const maxDelta = 0.066 // 15 fps

  useCursor(hoveredCV)

  function handleScroll() {
    const newIntensity = 1 + (-window.scrollY * 1.3) / window.innerHeight
    setLightIntensity(newIntensity < 0 ? 0 : newIntensity)
  }

  useEffect(() => {
    addEventListener("scroll", handleScroll)

    const parser = new UAParser()
    const deviceType = parser.getDevice().type
    setIsMobile(deviceType === "mobile")

    return () => {
      removeEventListener("scroll", handleScroll)
    }
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
        firstScreenPos={firstScreenPos}
        isMobile={isMobile}
      />
      {(faceControls || eyeControls) && (
        <FaceControls
          facemesh={{
            position: [0, 0, -0.4],
          }}
          offsetScalar={200}
          eyes={eyeControls}
        />
      )}

      <ambientLight intensity={lightIntensity * 0.03} castShadow={true} />
      <pointLight
        position={lightPosH1 ?? lightPos}
        intensity={lightIntensity * 0.3}
        castShadow={true}
        ref={helperActive ? lightRef1 : null}
      />
      <pointLight
        position={lightPosH2 ?? lightPos2}
        intensity={lightIntensity * 0.05}
        castShadow={true}
        ref={helperActive ? lightRef2 : null}
      />
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
