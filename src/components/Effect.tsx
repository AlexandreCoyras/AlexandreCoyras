import {FC, ForwardedRef, forwardRef} from 'react';
import dynamic from "next/dynamic";
import {useThree} from "@react-three/fiber";
// import EffectComposer from "@react-three/postprocessing/dist/EffectComposer";

const EffectComposer = dynamic(import('@react-three/postprocessing').then((module) => module.EffectComposer ) , { ssr: false })
const DepthOfField = dynamic(import('@react-three/postprocessing').then((module) => module.DepthOfField ) , { ssr: false })
const Vignette = dynamic(import('@react-three/postprocessing').then((module) => module.Vignette ) , { ssr: false })


const Effects = forwardRef((props, ref : ForwardedRef<any>) => {
    return (
        <>
        <EffectComposer
            multisampling={0}
        >
            <DepthOfField ref={ref} bokehScale={4} focalLength={0.1} />
            <Vignette />
        </EffectComposer>
        </>
    )
});

Effects.displayName = "Effects";
export default Effects;