import { useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import {
    Html,
    OrbitControls,
    PerspectiveCamera,
    useCursor,
    useHelper,
} from '@react-three/drei';
import ImageMesh from './ImageMesh';
import UAParser from 'ua-parser-js';
import Model from './RoomLoad';
import { BoxHelper, PointLightHelper, SpotLightHelper } from 'three';

export default function Scene3d({
    cvLinkRef,
    dofRef,
}: {
    cvLinkRef: MutableRefObject<any>;
    dofRef: MutableRefObject<null>;
}) {
    const [clickedCV, setClickedCV] = useState(false);
    const [hoveredCV, setHoveredCV] = useState(false);
    const [clickedFirstScreen, setClickedFirstScreen] = useState(false);
    const [hoveredFirstScreen, setHoveredFirstScreen] = useState(false);
    const [lightIntensity, setLightIntensity] = useState(1.2);
    const [mouseX, setMouseX] = useState(0);
    const [mouseY, setMouseY] = useState(0);
    const [isMobile, setIsMobile] = useState(true);
    const lightPos: any = [-0.11, -0.16, -0.9];
    const lightPos2: any = [-0.56, -0.16, -0.94];
    const cvPosition = new THREE.Vector3(-0.575, -0.138, -0.955);
    const firstScreenPos = new THREE.Vector3(-0.104, -0.156, -1.0535);
    const modelPos = new THREE.Vector3(0.15, -0.85, -0.2025);
    const [focusVector] = useState(() => new THREE.Vector3());
    const camera = useThree((state) => state.camera);
    const lightRef1 = useRef<any>(null);
    const lightRef2 = useRef<any>(null);
    useHelper(lightRef1, PointLightHelper, 0.1, 'cyan');
    useHelper(lightRef2, PointLightHelper, 0.1, 'red');
    if (process.env.NODE_ENV === 'development') {
        const leva = require('leva');
        var { orbitActive, lightPosH1, lightPosH2, lightIntensityH } =
            leva.useControls({
                orbitActive: false,
                lightPosH1: lightPos,
                lightPosH2: lightPos2,
                lightIntensityH: lightIntensity,
            });
    }

    useCursor(hoveredCV);

    useFrame((state, delta) => {
        if (orbitActive) return;
        updateXYPos(state.camera);

        // Camera distance from CV screen
        updateZPos(state.camera);
        updateLookAt(state.camera);
    });

    const updateLookAt = (
        camera:
            | (THREE.OrthographicCamera & { manual?: boolean })
            | (THREE.PerspectiveCamera & { manual?: boolean })
    ) => {
        const tempCam = camera.clone();

        if (clickedCV && !hoveredFirstScreen) {
            tempCam.lookAt(cvPosition);
            camera.quaternion.slerp(tempCam.quaternion, 0.01);
            return;
        }
        if (hoveredCV && !hoveredFirstScreen && !clickedFirstScreen) {
            const posToLook = cvPosition.clone();
            posToLook.x += 0.3;
            tempCam.lookAt(posToLook);
            camera.quaternion.slerp(tempCam.quaternion, 0.01);
            return;
        }

        tempCam.lookAt(firstScreenPos);
        camera.quaternion.slerp(tempCam.quaternion, 0.03);
    };

    const updateXYPos = (
        camera:
            | (THREE.OrthographicCamera & { manual?: boolean })
            | (THREE.PerspectiveCamera & { manual?: boolean })
    ) => {
        // dofRef.current.blur = camera.position.x
        if (clickedFirstScreen) {
            camera.position.x +=
                (firstScreenPos.x + -camera.position.x) * 0.015;
            camera.position.y += (firstScreenPos.y - camera.position.y) * 0.015;
            return;
        }
        if (clickedCV) {
            camera.position.x +=
                (cvPosition.x + 0.14 - camera.position.x) * 0.015;
            camera.position.y += (cvPosition.y - camera.position.y) * 0.015;
            return;
        }
        if (hoveredCV && !hoveredFirstScreen) {
            camera.position.x += (mouseX / 4 - camera.position.x) * 0.015;
            camera.position.y += (mouseY / 4 - camera.position.y) * 0.015;
            return;
        }
        camera.position.x += (mouseX / 4 - camera.position.x) * 0.015;
        camera.position.y += (mouseY / 4 - camera.position.y) * 0.015;
    };

    const updateZPos = (
        camera:
            | (THREE.OrthographicCamera & { manual?: boolean })
            | (THREE.PerspectiveCamera & { manual?: boolean })
    ) => {
        if (clickedFirstScreen) {
            camera.position.z +=
                (cvPosition.z + 0.23 - camera.position.z) * 0.015;
            return;
        }
        if (clickedCV) {
            camera.position.z +=
                (cvPosition.z + 0.25 - camera.position.z) * 0.015;
            return;
        }
        if (hoveredFirstScreen && !isMobile) {
            camera.position.z += (-0.2 - camera.position.z) * 0.015;
            return;
        }
        if (hoveredCV && !isMobile) {
            camera.position.z += (-0.2 - camera.position.z) * 0.015;
            return;
        }
        camera.position.z += (0 - camera.position.z) * 0.015;
    };
    const TestBox = ({ pos }: { pos: THREE.Vector3 }) => {
        return (
            <mesh position={pos} scale={0.03}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color={'orange'} />
            </mesh>
        );
    };

    useEffect(() => {
        addEventListener('scroll', (_) => {
            const newIntensity =
                1 + (-window.scrollY * 1.3) / window.innerHeight;
            setLightIntensity(newIntensity < 0 ? 0 : newIntensity);
        });

        addEventListener('mousemove', (e) => {
            setMouseX((e.clientX / window.innerWidth - 0.5) * 2);
            setMouseY(-(e.clientY / window.innerHeight - 0.5) * 2);
        });

        const parser = new UAParser();
        const deviceType = parser.getDevice().type;
        setIsMobile(deviceType === 'mobile');
    }, []);
    const clickOnCV = () => {
        // when the user clicks on CV screen
        setClickedCV(!clickedCV);
        if (!cvLinkRef.current) return;
        cvLinkRef.current.style.opacity = clickedCV ? 0 : 1;
        cvLinkRef.current.style.visibility = clickedCV ? 'hidden' : 'visible';
    };

    const Loading = () => {
        return <div className={'bg-black'}></div>;
    };

    return (
        <>
            <ambientLight intensity={lightIntensity * 0.03} />
            <pointLight
                position={lightPosH1 ?? lightPos}
                intensity={lightIntensity * 0.3}
                castShadow={true}
                ref={process.env.NODE_ENV === 'development' ? lightRef1 : null}
            />
            <pointLight
                position={lightPosH2 ?? lightPos2}
                intensity={lightIntensity * 0.0}
                castShadow={true}
                ref={process.env.NODE_ENV === 'development' ? lightRef2 : null}
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
            <Html
                center
                transform
                occlude="blending"
                position={firstScreenPos}
                scale={0.0104}
            >
                <div
                    className={
                        'pointer-events-auto justify-center items-center'
                    }
                    onPointerEnter={() => setClickedFirstScreen(true)}
                    onPointerOut={() => setClickedFirstScreen(false)}
                >
                    <iframe
                        src={'/projects'}
                        width="1920px"
                        height="1080px"
                        className={'inline-block pointer-events-auto p-3'}
                    />
                </div>
            </Html>
            <Model
                position={modelPos}
                scale={0.5}
                onClick={(e) => {
                    console.log(e);
                }}
            />
            <PerspectiveCamera makeDefault />
            {/*<Stats/>*/}
            {orbitActive && <OrbitControls camera={camera} zoomSpeed={3} />}
        </>
    );
}
