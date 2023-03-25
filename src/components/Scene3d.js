import {useFrame, useLoader, Cam, useThree} from "@react-three/fiber";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import React, {Suspense, useEffect, useRef, useState} from 'react'
import dynamic from 'next/dynamic'
const OrbitControls = dynamic(import('@react-three/drei').then((module) => module.OrbitControls ) , { ssr: false })
const { useHelper } = dynamic(() => import('@react-three/drei'), { ssr: false });
import ImageMesh from "./ImageMesh";
import {PerspectiveCamera} from "@react-three/drei";
import { Object3D } from "three";
import UAParser from 'ua-parser-js';
import gsap from 'gsap'

export default function Scene3d(props) {
    const [mouseX, setMouseX] = useState(0)
    const [mouseY, setMouseY] = useState(0)
    const [hoveredCV, setHoverCV] = useState(false)
    const cvPosition = new THREE.Vector3(-0.1, -0.204, -1.253)
    const camera = useThree((state) => state.camera)
    const [isMobile, setIsMobile] = useState(true);

    useFrame(() => {
        // Ajoutez une boucle infinie ici pour empêcher le composant de se charger complètement
        // while (true) {
        //     console.log('Loading...');
        // }
        if (hoveredCV) {
            camera.position.x += ( -0.1 - camera.position.x)  * 0.01
            camera.position.y += (-0.18  - camera.position.y ) * 0.01;
        } else {
            camera.position.x += (mouseX / 2 - camera.position.x) * 0.01
            camera.position.y += (-mouseY / 2 - camera.position.y) * 0.01;
        }
        camera.position.z += hoveredCV ? (-0.92 - camera.position.z) * 0.008 : (0 - camera.position.z) * 0.008
        camera.lookAt(cvPosition)

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

        addEventListener("mousemove", (event) => {
            setMouseX((event.clientX - window.innerWidth / 2) / window.innerWidth * 2)
            setMouseY((event.clientY - window.innerHeight / 2) / window.innerHeight * 2)
        })
        const parser = new UAParser();
        const deviceType = parser.getDevice().type;
        setIsMobile(deviceType === 'mobile');
        console.log(props.cvLinkRef.current)

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
        setHoverCV(!hoveredCV);
        props.cvLinkRef.current.style.opacity = hoveredCV ? 0 : 1
        props.cvLinkRef.current.style.visibility = hoveredCV ? "hidden" : "visible";
    }


    return <>
        <ambientLight intensity={0.02}/>
        <pointLight position={lightPos}  intensity={0.15} castShadow={true}/>
        {/*<Box position={lightPos} />*/}
        <pointLight position={lightPos2}  intensity={0.15} castShadow={true}/>
        {/*<Box position={lightPos2} />*/}
        {isMobile ?
            <ImageMesh src="CV.png" width={4.5/9} height={4.5/16} position={cvPosition} onClick={_ => clickOnScreen()}/>
        :    <ImageMesh src="CV.png" width={4.5/9} height={4.5/16} position={cvPosition} onClick={_ => clickOnScreen()}/>
        }
        <ImageMesh src="code.png" width={4.1/9} height={4.1/16} position={[-0.575, -0.188, -1.155]} rotation={[0, 0.5, 0]}/>
        <LoadModel position={[0.15, -0.9, -0.4]}/>
        <PerspectiveCamera
            // position={[0, 0, 0.5]}
                           makeDefault />
        {/*<OrbitControls/>*/}
    </>
}