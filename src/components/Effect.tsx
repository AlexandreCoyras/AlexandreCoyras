import { FC, ForwardedRef, forwardRef } from 'react';
import { useThree } from '@react-three/fiber';
import {
    EffectComposer,
    DepthOfField,
    Vignette,
} from '@react-three/postprocessing';

const Effects = forwardRef((props, ref: ForwardedRef<any>) => {
    return (
        <>
            <EffectComposer multisampling={0}>
                {/*<DepthOfField ref={ref} bokehScale={4} focalLength={0.1} />*/}
                <Vignette />
            </EffectComposer>
        </>
    );
});

Effects.displayName = 'Effects';
export default Effects;
