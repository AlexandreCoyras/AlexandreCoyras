import {useFrame, useLoader, useThree} from "@react-three/fiber";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import React, {Suspense, useEffect, useRef, useState} from 'react'
import dynamic from 'next/dynamic'
const OrbitControls = dynamic(import('@react-three/drei').then((module) => module.OrbitControls ) , { ssr: false })
import ImageMesh from "./ImageMesh";
import {PerspectiveCamera} from "@react-three/drei";
import UAParser from 'ua-parser-js';

export default function Scene3d( { cvLinkRef }) {
    const [clickedCV, setClickedCV] = useState(false)
    const [hoveredCV, setHoveredCV] = useState(false)
    const [lightIntensity, setLightIntensity] = useState(1)
    const cvPosition = new THREE.Vector3(-0.104, -0.204, -1.253)
    const camera = useThree((state) => state.camera)
    const [isMobile, setIsMobile] = useState(true);

    useFrame((state, delta) => {

        if (clickedCV) {
            state.camera.position.x += ( -0.1 - state.camera.position.x)  * 0.015
            state.camera.position.y += (-0.18  - state.camera.position.y ) * 0.015
        } else {
            state.camera.position.x += (state.mouse.x / 2 - state.camera.position.x) * 0.015
            state.camera.position.y += (state.mouse.y / 2 - state.camera.position.y) * 0.015
        }

        // Camera distance from CV screen
        if (clickedCV)
            state.camera.position.z += (-0.92 - state.camera.position.z) * 0.01
        else if (hoveredCV && !isMobile)
            state.camera.position.z += (-0.2 - state.camera.position.z) * 0.01
        else
            state.camera.position.z += (0 - state.camera.position.z) * 0.01
        state.camera.lookAt(cvPosition)

    });

    function Box(props) {
        const mesh = useRef()
        const [hovered, setHover] = useState(false)
        const [active, setActive] = useState(false)
        useFrame((state, delta) => (mesh.current.rotation.x += delta))
        return (
            <mesh
                {...props}
                ref={mesh}
                scale={active ? 1.5 : 0.1}
                onClick={(event) => setActive(!active)}
                onPointerOver={(event) => setHover(true)}
                onPointerOut={(event) => setHover(false)}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
            </mesh>
        )
    }

    useEffect(() => {
        addEventListener('scroll', _ => {
            const newIntensity = 1 + (-window.scrollY * 1.3) / window.innerHeight
            setLightIntensity( newIntensity < 0 ? 0 : newIntensity)
        })
        const parser = new UAParser();
        const deviceType = parser.getDevice().type;
        setIsMobile(deviceType === 'mobile');
    }, [])

    const LoadModel = (props) => {
        const { scene } = useLoader(GLTFLoader, "3d_models/room2.glb")
        return <primitive object={scene} position={props.position} scale={0.5} receiveShadow={true}/>
    }


    const Loading = () => {
        return (
            <>
            </>
        )

    }
    const lightPos = [-0.3, -0.3, -0.8]
    const lightPos2 = [-0.7, -0.3, -0.70]

    const texture = useLoader(THREE.TextureLoader, "CV.png");

    const clickOnScreen = () => {
        // when the user clicks on CV screen
        setClickedCV(!clickedCV);
        cvLinkRef.current.style.opacity = clickedCV ? 0 : 1
        cvLinkRef.current.style.visibility = clickedCV ? "hidden" : "visible";
    }


    return <>
        <ambientLight intensity={lightIntensity * 0.02}/>
        <pointLight position={lightPos}  intensity={lightIntensity * 0.15} castShadow={true}/>
        {/*<Box position={lightPos} />*/}
        <pointLight position={lightPos2}  intensity={lightIntensity * 0.15} castShadow={true}/>
        {/*<Box position={lightPos2} />*/}
        <ImageMesh src="CV.png" width={4.5/9} height={4.5/16} position={cvPosition}
                        onClick={_ => clickOnScreen()}
                        onPointerOver={_ => {document.querySelector("body").style.cursor = "pointer"; setHoveredCV(true); }}
                        onPointerOut={_ => {document.querySelector("body").style.cursor = "auto"; setHoveredCV(false);}}/>
        <ImageMesh src="code.png" width={4.1/9} height={4.1/16} position={[-0.575, -0.188, -1.155]} rotation={[0, 0.5, 0]}/>
        <LoadModel position={[0.15, -0.9, -0.4]}/>
        <PerspectiveCamera makeDefault />
        {/*<OrbitControls/>*/}
    </>
}