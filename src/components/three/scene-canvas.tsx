import React, { FC, useState } from "react"
import Scene from "@components/three/scene"
import { FaceLandmarker, PerformanceMonitor } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import useSettingsStore from "@store/settingsStore"

const SceneCanvas: FC = () => {
  const [dpr, setDpr] = useState(1.5)
  const { shaders, setShaders } = useSettingsStore()
  return (
    <>
      <Canvas
        dpr={dpr}
        camera={{ position: 0, fov: 50 }}
        className={"absolute left-0 top-0 z-0"}
      >
        <PerformanceMonitor
          onIncline={() => {
            setDpr(2)
          }}
          onDecline={() => {
            setDpr(1)
            setShaders(false)
          }}
        />
        <FaceLandmarker>
          <Scene />
        </FaceLandmarker>
        {/*{shaders && <Effect />}*/}
      </Canvas>
    </>
  )
}

export default SceneCanvas
