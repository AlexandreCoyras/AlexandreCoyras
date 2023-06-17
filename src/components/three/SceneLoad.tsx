import React, { FC, useState } from 'react';
import { FaceLandmarker, PerformanceMonitor } from '@react-three/drei';
import Effect from '@/components/three/Effect';
import { Canvas } from '@react-three/fiber';
import Scene from '@/components/three/Scene';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

type SceneLoadProps = {
    shaders?: boolean;
    cvLinkRef: React.MutableRefObject<null>;
    DepthOfFieldRef: React.MutableRefObject<null>;
};

const SceneLoad: FC<SceneLoadProps> = ({
    DepthOfFieldRef,
    cvLinkRef,
    shaders,
}: SceneLoadProps) => {
    const [dpr, setDpr] = useState(1.5);
    return (
        <>
            <Dialog defaultOpen={true}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when
                            you&apos;re done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                                Username
                            </Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Canvas
                dpr={dpr}
                camera={{ position: 0, fov: 50 }}
                className={'absolute left-0 top-0 z-0'}
            >
                <PerformanceMonitor
                    onIncline={() => setDpr(2)}
                    onDecline={() => setDpr(1)}
                >
                    <FaceLandmarker>
                        <Scene cvLinkRef={cvLinkRef} dofRef={DepthOfFieldRef} />
                        {shaders && <Effect ref={DepthOfFieldRef} />}
                    </FaceLandmarker>
                </PerformanceMonitor>
            </Canvas>
        </>
    );
};

export default SceneLoad;
