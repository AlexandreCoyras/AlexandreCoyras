import {useFrame, useLoader, useThree} from "@react-three/fiber";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import React, {MutableRefObject, Suspense, useEffect, useRef, useState} from 'react'
import dynamic from 'next/dynamic'
import { Html } from '@react-three/drei'
// const OrbitControls = dynamic(import('@react-three/drei').then((module) => module.OrbitControls ) , { ssr: false })
import ImageMesh from "./ImageMesh";
import {PerspectiveCamera} from "@react-three/drei";
import UAParser from 'ua-parser-js';

export default function Scene3d({cvLinkRef}: { cvLinkRef: MutableRefObject<any> }) {
    const [clickedCV, setClickedCV] = useState(false)
    const [hoveredCV, setHoveredCV] = useState(false)
    const [clickedFirstScreen, setClickedFirstScreen] = useState(false)
    const [hoveredFirstScreen, setHoveredFirstScreen] = useState(false)
    const [lightIntensity, setLightIntensity] = useState(1)
    const [mouseX, setMouseX] = useState(0)
    const [mouseY, setMouseY] = useState(0)
    const [isMobile, setIsMobile] = useState(true);
    const iFrame = useRef(null)

    const lightPos: any = [-0.3, -0.3, -0.8]
    const lightPos2: any = [-0.7, -0.3, -0.70]
    const cvPosition = new THREE.Vector3(-0.575, -0.138, -0.955)
    const firstScreenPos = new THREE.Vector3(-0.104, -0.154, -1.0535)
    const modelPos = new THREE.Vector3(0.15, -0.85, -0.2)

    useFrame((state, delta) => {
        updateXYPos(state.camera)

        // Camera distance from CV screen
        updateZPos(state.camera)

        updateLookAt(state.camera)
    });

    const updateLookAt = (camera: (THREE.OrthographicCamera & {manual?: boolean}) | (THREE.PerspectiveCamera & {manual?: boolean})) => {
        if (clickedCV && !hoveredFirstScreen) {
            const tempCam = camera.clone()
            tempCam.lookAt(cvPosition)
            camera.quaternion.slerp(tempCam.quaternion, 0.01)
            return
        }
        if (hoveredCV && !hoveredFirstScreen && !clickedFirstScreen) {
            const posToLook = cvPosition.clone()
            posToLook.x += 0.3
            const tempCam = camera.clone()
            tempCam.lookAt(posToLook)
            camera.quaternion.slerp(tempCam.quaternion, 0.01)
            return
        }

        const tempCam = camera.clone()
        tempCam.lookAt(firstScreenPos)
        camera.quaternion.slerp(tempCam.quaternion, 0.03)
    }

    const updateXYPos = (camera: (THREE.OrthographicCamera & {manual?: boolean}) | (THREE.PerspectiveCamera & {manual?: boolean})) => {
        if (clickedFirstScreen) {
            camera.position.x += (firstScreenPos.x + - camera.position.x) * 0.015
            camera.position.y += (firstScreenPos.y - camera.position.y) * 0.015
            return
        }
        if (clickedCV) {
            camera.position.x += (cvPosition.x + 0.14 - camera.position.x) * 0.015
            camera.position.y += (cvPosition.y - camera.position.y) * 0.015
            return
        }
        if (hoveredCV && !hoveredFirstScreen) {
            camera.position.x += (mouseX / 4 - camera.position.x) * 0.015
            camera.position.y += (mouseY / 4 - camera.position.y) * 0.015
            return
        }
        camera.position.x += (mouseX / 4 - camera.position.x) * 0.015
        camera.position.y += (mouseY / 4 - camera.position.y) * 0.015
    }

    const updateZPos = (camera: (THREE.OrthographicCamera & {manual?: boolean}) | (THREE.PerspectiveCamera & {manual?: boolean})) => {
        if (clickedFirstScreen) {
            camera.position.z += (cvPosition.z + 0.23 - camera.position.z) * 0.015
            return
        }
        if (clickedCV) {
            camera.position.z += (cvPosition.z + 0.25 - camera.position.z) * 0.015
            return
        }
        if (hoveredFirstScreen && !isMobile) {
            camera.position.z += (-0.2 - camera.position.z) * 0.015
            return
        }
        if (hoveredCV && !isMobile) {
            camera.position.z += (-0.2 - camera.position.z) * 0.015
            return
        }
        camera.position.z += (0 - camera.position.z) * 0.015
    }
    const TestBox = ({pos}: any) => {
        return (
        <mesh
        position={pos}
        scale={0.03}
        >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={'orange'} />
        </mesh>
        )
    }

    useEffect(() => {
        addEventListener('scroll', _ => {
            const newIntensity = 1 + (-window.scrollY * 1.3) / window.innerHeight
            setLightIntensity(newIntensity < 0 ? 0 : newIntensity)
        })

        addEventListener('mousemove', (e) => {
            setMouseX((e.clientX / window.innerWidth - 0.5) * 2)
            setMouseY(-(e.clientY / window.innerHeight - 0.5) * 2)
        })

        const parser = new UAParser();
        const deviceType = parser.getDevice().type;
        setIsMobile(deviceType === 'mobile');
    }, [])

    const LoadModel = (props: any) => {
        const {scene} = useLoader(GLTFLoader, "3d_models/room2.glb")
        return <primitive object={scene} position={props.position} scale={0.5} receiveShadow={true}/>
    }

    const texture = useLoader(THREE.TextureLoader, "CV.png");

    const clickOnCV = () => {
        // when the user clicks on CV screen
        setClickedCV(!clickedCV);
        if (!cvLinkRef.current) return
        cvLinkRef.current.style.opacity = clickedCV ? 0 : 1
        cvLinkRef.current.style.visibility = clickedCV ? "hidden" : "visible";
    }

    return <>
        <ambientLight intensity={lightIntensity * 0.02}/>
        <pointLight position={lightPos} intensity={lightIntensity * 0.15} castShadow={true}/>
        <pointLight position={lightPos2} intensity={lightIntensity * 0.15} castShadow={true}/>
        <ImageMesh src="CV.png" width={4.1 / 9} height={4.1 / 16} position={cvPosition}
                   rotation={[0, 0.5, 0]}
                   onClick={() => clickOnCV()}
                   onPointerOver={() => {
                       const body = document.querySelector("body");
                       if (body !== null)
                           body.style.cursor = "pointer";
                       setHoveredCV(true);
                   }}
                   onPointerOut={() => {
                       const body = document.querySelector("body");
                       if (body  !== null)
                           body.style.cursor = "auto";
                       setHoveredCV(false);
                   }}/>
            {/*<TestBox pos={firstScreenPos}/>*/}
        <Html center transform  occlude="blending" position={firstScreenPos} scale={0.0104}>
            <div className={"pointer-events-auto justify-center items-center"} onPointerEnter={() => setClickedFirstScreen(true)}  onPointerOut={() => setClickedFirstScreen(false)} onClick={() => {}}>
                <iframe ref={iFrame} src={"/pc"} width="1920px" height="1080px" className={"inline-block pointer-events-auto"}/>
            </div>
        </Html>
        <LoadModel position={modelPos}/>
        <PerspectiveCamera makeDefault/>
        {/*<OrbitControls/>*/}
    </>
}