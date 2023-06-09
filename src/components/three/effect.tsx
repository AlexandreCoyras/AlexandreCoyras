import { ForwardedRef, forwardRef } from "react"
import { EffectComposer, Vignette } from "@react-three/postprocessing"

const Effects = forwardRef((props, ref: ForwardedRef<any>) => {
  return (
    <>
      <EffectComposer>
        {/*    /!*<DepthOfField ref={ref} bokehScale={4} focalLength={0.1} />*!/*/}
        <Vignette />
      </EffectComposer>
    </>
  )
})

Effects.displayName = "Effects"
export default Effects
