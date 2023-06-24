import React, { FC, useEffect, useState } from "react"
import useSettingsStore from "@/store/settingsStore"
import { CameraControls, FaceControls } from "@react-three/drei"
import { RootState, useFrame } from "@react-three/fiber"
import useSceneStore from "@store/sceneStore"
import * as easing from "maath/easing"
import * as THREE from "three"
import UAParser from "ua-parser-js"

type ControlsProps = {
  cvPosition: THREE.Vector3
  firstScreenPos: THREE.Vector3
}

const Controls: FC<ControlsProps> = ({
  cvPosition,
  firstScreenPos,
}: ControlsProps) => {
  const { faceControls, eyeControls } = useSettingsStore()
  const [isDev] = useState(process.env.NODE_ENV === "development")
  const [isMobile, setIsMobile] = useState(false)
  const {
    clickedFirstScreen,
    clickedSecondScreen,
    hoveredFirstScreen,
    hoveredSecondScreen,
  } = useSceneStore()
  const maxDelta = 0.066 // 15 fps
  if (isDev) {
    const leva = require("leva")
    var { orbitActive } = leva.useControls({
      orbitActive: false,
    })
  }

  useEffect(() => {
    const parser = new UAParser()
    const deviceType = parser.getDevice().type
    setIsMobile(deviceType === "mobile")
  }, [])

  useFrame((state, delta) => {
    if (orbitActive || faceControls || eyeControls) return

    updatePosition(state, state.camera, Math.min(delta, maxDelta))
    updateLookAt(state.camera, Math.min(delta, maxDelta))
  })

  const updateLookAt = (
    camera:
      | (THREE.OrthographicCamera & { manual?: boolean })
      | (THREE.PerspectiveCamera & { manual?: boolean }),
    delta: number
  ) => {
    const tempCam = camera.clone()

    if (clickedSecondScreen) {
      tempCam.lookAt(cvPosition)
      easing.dampQ(
        camera.quaternion,
        tempCam.quaternion,
        0.4,
        delta,
        Infinity,
        undefined,
        0.0001
      )
      return
    }
    if (hoveredSecondScreen && !clickedFirstScreen) {
      const posToLook = cvPosition.clone()
      posToLook.x += 0.3
      tempCam.lookAt(posToLook)
      easing.dampQ(
        camera.quaternion,
        tempCam.quaternion,
        0.5,
        delta,
        Infinity,
        undefined,
        0.0001
      )
      return
    }

    tempCam.lookAt(firstScreenPos)
    easing.dampQ(
      camera.quaternion,
      tempCam.quaternion,
      0.25,
      delta,
      Infinity,
      undefined,
      0.0001
    )
  }

  const updatePosition = (
    state: RootState,
    camera:
      | (THREE.OrthographicCamera & { manual?: boolean })
      | (THREE.PerspectiveCamera & { manual?: boolean }),
    delta: number
  ) => {
    if (clickedSecondScreen) {
      easing.damp3(
        camera.position,
        [cvPosition.x + 0.14, cvPosition.y, cvPosition.z + 0.25],
        0.6,
        delta,
        Infinity,
        undefined,
        0.0001
      )
      return
    }
    if (clickedFirstScreen) {
      easing.damp3(
        camera.position,
        [firstScreenPos.x, firstScreenPos.y, cvPosition.z + 0.23],
        0.6,
        delta,
        Infinity,
        undefined,
        0.0001
      )
      return
    }
    if (hoveredSecondScreen && !isMobile) {
      easing.damp3(
        camera.position,
        [state.pointer.x / 4, state.pointer.y / 4, -0.2],
        0.6,
        delta,
        Infinity,
        undefined,
        0.0001
      )
      return
    }
    if (hoveredFirstScreen && !isMobile) {
      easing.damp3(
        camera.position,
        [state.pointer.x / 4, state.pointer.y / 4, -0.2],
        0.6,
        delta,
        Infinity,
        undefined,
        0.0001
      )
      return
    }
    easing.damp3(
      camera.position,
      [state.pointer.x / 4, state.pointer.y / 4, 0],
      0.45,
      delta,
      Infinity,
      undefined,
      0.0001
    )
  }

  return (
    <>
      {orbitActive && <CameraControls />}
      {(faceControls || eyeControls) && !orbitActive && (
        <FaceControls
          facemesh={{
            position: [0, 0, -0.6],
          }}
          offsetScalar={200}
          eyes={eyeControls}
        />
      )}
    </>
  )
}

export default Controls
