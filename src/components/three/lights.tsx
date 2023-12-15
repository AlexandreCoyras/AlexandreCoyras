import React, { FC, useEffect, useState } from "react"
import { useControls } from "leva"

const Lights: FC = () => {
  const [lightIntensity, setLightIntensity] = useState(1)
  const { lightPosH1, lightPosH2 } = useControls({
    lightPosH1: [-0.11, -0.16, -0.9],
    lightPosH2: [-0.56, -0.16, -0.94],
  })

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
        position={lightPosH1}
        intensity={lightIntensity * 0.3}
        castShadow={true}
      />
      <pointLight
        position={lightPosH2}
        intensity={lightIntensity * 0.05}
        castShadow={true}
      />
    </>
  )
}

export default Lights
