import { FC, useState } from "react"
import useSettingsStore from "@/store/settingsStore"
import { RootState, useFrame } from "@react-three/fiber"
import * as THREE from "three"

type ControlsProps = {
  clickedCV: boolean
  cvPosition: THREE.Vector3
  clickedFirstScreen: boolean
  hoveredCV: boolean
  firstScreenPos: THREE.Vector3
  isMobile: boolean
}

const Controls: FC<ControlsProps> = ({
  clickedCV,
  clickedFirstScreen,
  cvPosition,
  hoveredCV,
  firstScreenPos,
  isMobile,
}: ControlsProps) => {
  const { faceControls, eyeControls } = useSettingsStore()
  const [isDev] = useState(process.env.NODE_ENV === "development")
  const maxDelta = 0.066 // 15 fps
  if (isDev) {
    const leva = require("leva")
    var { orbitActive } = leva.useControls({
      orbitActive: false,
    })
  }
  useFrame((state, delta) => {
    if (orbitActive || faceControls || eyeControls) return
    updateXYPos(state, state.camera, Math.min(delta, maxDelta))

    // Camera distance from CV screen
    updateZPos(state, state.camera, Math.min(delta, maxDelta))
    updateLookAt(state.camera, Math.min(delta, maxDelta))
  })

  const updateLookAt = (
    camera:
      | (THREE.OrthographicCamera & { manual?: boolean })
      | (THREE.PerspectiveCamera & { manual?: boolean }),
    delta: number
  ) => {
    const tempCam = camera.clone()

    if (clickedCV) {
      tempCam.lookAt(cvPosition)
      camera.quaternion.slerp(tempCam.quaternion, delta * 1.3)
      return
    }
    if (hoveredCV && !clickedFirstScreen) {
      const posToLook = cvPosition.clone()
      posToLook.x += 0.3
      tempCam.lookAt(posToLook)
      camera.quaternion.slerp(tempCam.quaternion, delta * 1.3)
      return
    }

    tempCam.lookAt(firstScreenPos)
    camera.quaternion.slerp(tempCam.quaternion, delta * 4)
  }

  const updateXYPos = (
    state: RootState,
    camera:
      | (THREE.OrthographicCamera & { manual?: boolean })
      | (THREE.PerspectiveCamera & { manual?: boolean }),
    delta: number
  ) => {
    // dofRef.current.blur = camera.position.x
    if (clickedFirstScreen) {
      camera.position.x += (firstScreenPos.x + -camera.position.x) * delta * 2
      camera.position.y += (firstScreenPos.y - camera.position.y) * delta * 2
      return
    }
    if (clickedCV) {
      camera.position.x += (cvPosition.x + 0.14 - camera.position.x) * delta * 2
      camera.position.y += (cvPosition.y - camera.position.y) * delta * 2
      return
    }
    if (hoveredCV) {
      camera.position.x += (state.pointer.x / 4 - camera.position.x) * delta * 2
      camera.position.y += (state.pointer.y / 4 - camera.position.y) * delta * 2
      return
    }
    camera.position.x += (state.pointer.x / 4 - camera.position.x) * delta * 2.5
    camera.position.y += (state.pointer.y / 4 - camera.position.y) * delta * 2.5
  }

  const updateZPos = (
    state: RootState,
    camera:
      | (THREE.OrthographicCamera & { manual?: boolean })
      | (THREE.PerspectiveCamera & { manual?: boolean }),
    delta: number
  ) => {
    if (clickedFirstScreen) {
      camera.position.z += (cvPosition.z + 0.23 - camera.position.z) * delta * 2
      return
    }
    if (clickedCV) {
      camera.position.z += (cvPosition.z + 0.25 - camera.position.z) * delta * 2
      return
    }
    if (hoveredCV && !isMobile) {
      camera.position.z += (-0.2 - camera.position.z) * delta * 2
      return
    }
    camera.position.z += (0 - camera.position.z) * delta * 2
  }

  return <></>
}

export default Controls
