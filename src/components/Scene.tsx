import { RootState, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import {
    FaceControls,
    Gltf,
    Html,
    OrbitControls,
    useCursor,
} from '@react-three/drei';
import ImageMesh from './ImageMesh';
import UAParser from 'ua-parser-js';
import { Perf } from 'r3f-perf';
import useSettingsStore from '@/store/settings';

// constants
const lightPos: number[] = [-0.11, -0.16, -0.9];
const lightPos2: number[] = [-0.56, -0.16, -0.94];
const cvPosition = new THREE.Vector3(-0.575, -0.138, -0.955);
const firstScreenPos = new THREE.Vector3(-0.104, -0.156, -1.0535);
const modelPos = new THREE.Vector3(0.15, -0.85, -0.2025);

export default function Scene({
    cvLinkRef,
    dofRef,
}: {
    cvLinkRef: MutableRefObject<any>;
    dofRef: MutableRefObject<null>;
}) {
    const [clickedCV, setClickedCV] = useState(false);
    const [hoveredCV, setHoveredCV] = useState(false);
    const [clickedFirstScreen, setClickedFirstScreen] = useState(false);
    const [lightIntensity, setLightIntensity] = useState(1);
    // const [mouseX, setMouseX] = useState(0);
    // const [mouseY, setMouseY] = useState(0);
    const [isMobile, setIsMobile] = useState(true);
    const lightRef1 = useRef<any>(null);
    const lightRef2 = useRef<any>(null);
    const { faceControls, eyeControls } = useSettingsStore();
    // useHelper(lightRef1, PointLightHelper, 0.1, 'cyan');
    // useHelper(lightRef2, PointLightHelper, 0.1, 'red');
    const [isDev] = useState(process.env.NODE_ENV === 'development');
    if (isDev) {
        const leva = require('leva');
        var { performance, orbitActive, helperActive, lightPosH1, lightPosH2 } =
            leva.useControls({
                performance: true,
                orbitActive: false,
                helperActive: false,
                lightPosH1: lightPos,
                lightPosH2: lightPos2,
            });
        helperActive = true;
    }
    const maxDelta = 0.066; // 15 fps

    useCursor(hoveredCV);

    useFrame((state, delta) => {
        if (orbitActive || faceControls || eyeControls) return;
        updateXYPos(state, state.camera, Math.min(delta, maxDelta));

        // Camera distance from CV screen
        updateZPos(state, state.camera, Math.min(delta, maxDelta));
        updateLookAt(state.camera, Math.min(delta, maxDelta));
    });

    const updateLookAt = (
        camera:
            | (THREE.OrthographicCamera & { manual?: boolean })
            | (THREE.PerspectiveCamera & { manual?: boolean }),
        delta: number
    ) => {
        const tempCam = camera.clone();

        if (clickedCV) {
            tempCam.lookAt(cvPosition);
            camera.quaternion.slerp(tempCam.quaternion, delta * 1.3);
            return;
        }
        if (hoveredCV && !clickedFirstScreen) {
            const posToLook = cvPosition.clone();
            posToLook.x += 0.3;
            tempCam.lookAt(posToLook);
            camera.quaternion.slerp(tempCam.quaternion, delta * 1.3);
            return;
        }

        tempCam.lookAt(firstScreenPos);
        camera.quaternion.slerp(tempCam.quaternion, delta * 4);
    };

    const updateXYPos = (
        state: RootState,
        camera:
            | (THREE.OrthographicCamera & { manual?: boolean })
            | (THREE.PerspectiveCamera & { manual?: boolean }),
        delta: number
    ) => {
        // dofRef.current.blur = camera.position.x
        if (clickedFirstScreen) {
            camera.position.x +=
                (firstScreenPos.x + -camera.position.x) * delta * 2;
            camera.position.y +=
                (firstScreenPos.y - camera.position.y) * delta * 2;
            return;
        }
        if (clickedCV) {
            camera.position.x +=
                (cvPosition.x + 0.14 - camera.position.x) * delta * 2;
            camera.position.y += (cvPosition.y - camera.position.y) * delta * 2;
            return;
        }
        if (hoveredCV) {
            camera.position.x +=
                (state.pointer.x / 4 - camera.position.x) * delta * 2;
            camera.position.y +=
                (state.pointer.y / 4 - camera.position.y) * delta * 2;
            return;
        }
        camera.position.x +=
            (state.pointer.x / 4 - camera.position.x) * delta * 2.5;
        camera.position.y +=
            (state.pointer.y / 4 - camera.position.y) * delta * 2.5;
    };

    const updateZPos = (
        state: RootState,
        camera:
            | (THREE.OrthographicCamera & { manual?: boolean })
            | (THREE.PerspectiveCamera & { manual?: boolean }),
        delta: number
    ) => {
        if (clickedFirstScreen) {
            camera.position.z +=
                (cvPosition.z + 0.23 - camera.position.z) * delta * 2;
            return;
        }
        if (clickedCV) {
            camera.position.z +=
                (cvPosition.z + 0.25 - camera.position.z) * delta * 2;
            return;
        }
        if (hoveredCV && !isMobile) {
            camera.position.z += (-0.2 - camera.position.z) * delta * 2;
            return;
        }
        camera.position.z += (0 - camera.position.z) * delta * 2;
    };

    // function handleMouseMove(e: MouseEvent) {
    //     setMouseX((e.clientX / window.innerWidth - 0.5) * 2);
    //     setMouseY(-(e.clientY / window.innerHeight - 0.5) * 2);
    // }

    function handleScroll() {
        const newIntensity = 1 + (-window.scrollY * 1.3) / window.innerHeight;
        setLightIntensity(newIntensity < 0 ? 0 : newIntensity);
    }

    useEffect(() => {
        addEventListener('scroll', handleScroll);

        const parser = new UAParser();
        const deviceType = parser.getDevice().type;
        setIsMobile(deviceType === 'mobile');

        return () => {
            removeEventListener('scroll', handleScroll);
        };
    }, []);

    // when the user clicks on CV screen
    const clickOnCV = () => {
        setClickedCV(!clickedCV);
        if (!cvLinkRef.current) return;
        cvLinkRef.current.style.opacity = clickedCV ? 0 : 1;
        cvLinkRef.current.style.visibility = clickedCV ? 'hidden' : 'visible';
    };
    console.log('render');

    return (
        <>
            {performance && (
                <Perf position="bottom-left" style={{ zIndex: 999999999 }} />
            )}
            {orbitActive && <OrbitControls zoomSpeed={3} />}
            {(faceControls || eyeControls) && (
                <FaceControls
                    facemesh={{
                        position: [0, 0, -0.4],
                    }}
                    offsetScalar={200}
                    eyes={eyeControls}
                />
            )}

            <ambientLight intensity={lightIntensity * 0.03} castShadow={true} />
            <pointLight
                position={lightPosH1 ?? lightPos}
                intensity={lightIntensity * 0.3}
                castShadow={true}
                ref={helperActive ? lightRef1 : null}
            />
            <pointLight
                position={lightPosH2 ?? lightPos2}
                intensity={lightIntensity * 0.05}
                castShadow={true}
                ref={helperActive ? lightRef2 : null}
            />
            <ImageMesh
                src="CV.png"
                width={4.1 / 9}
                height={4.1 / 16}
                position={cvPosition}
                rotation={[0, 0.5, 0]}
                onClick={() => clickOnCV()}
                onPointerOver={() => setHoveredCV(true)}
                onPointerOut={() => setHoveredCV(false)}
            />

            {/*<Model position={modelPos} scale={0.5} />*/}
            <Gltf
                src={'/3d_models/room-transformed.glb'}
                position={modelPos}
                scale={0.5}
            />

            <Html
                center
                transform
                occlude="blending"
                position={firstScreenPos}
                scale={0.0106}
            >
                <div
                    className={
                        'pointer-events-auto items-center justify-center'
                    }
                    onPointerEnter={() => setClickedFirstScreen(true)}
                    onPointerOut={() => setClickedFirstScreen(false)}
                >
                    <iframe
                        src={'/projects'}
                        width="1920px"
                        height="1080px"
                        className={'pointer-events-auto inline-block p-3'}
                    />
                </div>
            </Html>
        </>
    );
}
