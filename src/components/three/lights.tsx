import React, { FC, useEffect, useState } from "react"
import { useScroll } from "@react-three/drei"
import leva from "leva"

type LightsProps = {}

const lightPos: number[] = [-0.11, -0.16, -0.9]
const lightPos2: number[] = [-0.56, -0.16, -0.94]

const Lights: FC<LightsProps> = () => {
  const [lightIntensity, setLightIntensity] = useState(1)
  const [isDev] = useState(process.env.NODE_ENV === "development")
  if (isDev) {
    const leva = require("leva")
    var { lightPosH1, lightPosH2 } = leva.useControls({
      lightPosH1: lightPos,
      lightPosH2: lightPos2,
    })
  }

  function handleScroll() {
    const newIntensity = 1 + (-window.scrollY * 1.3) / window.innerHeight
    setLightIntensity(newIntensity < 0 ? 0 : newIntensity)
  }

  useEffect(() => {
    addEventListener("scroll", handleScroll)

    return () => removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <ambientLight intensity={lightIntensity * 0.03} castShadow={true} />
      <pointLight
        position={lightPosH1 ?? lightPos}
        intensity={lightIntensity * 0.3}
        castShadow={true}
      />
      <pointLight
        position={lightPosH2 ?? lightPos2}
        intensity={lightIntensity * 0.05}
        castShadow={true}
      />
    </>
  )
}

export default Lights
