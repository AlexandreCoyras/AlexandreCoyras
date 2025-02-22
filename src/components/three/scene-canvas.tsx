import React, { FC, useState } from "react"
import Scene from "@components/three/scene"
import { PerformanceMonitor } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import useSettingsStore from "@store/settingsStore"

import Effect from "./effect"

const SceneCanvas: FC = () => {
  const [dpr, setDpr] = useState(1.5)
  const { shaders, setShaders, faceControls } = useSettingsStore()
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
        <Scene />
        {/* {shaders && <Effect />} */}
      </Canvas>
    </>
  )
}

export default SceneCanvas
