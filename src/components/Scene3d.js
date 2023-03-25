import {useFrame, useLoader, Cam, useThree} from "@react-three/fiber";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import {Suspense, useEffect, useRef, useState} from 'react'
import dynamic from 'next/dynamic'
const OrbitControls = dynamic(import('@react-three/drei').then((module) => module.OrbitControls ) , { ssr: false })
const { useHelper } = dynamic(() => import('@react-three/drei'), { ssr: false });
import ImageMesh from "./ImageMesh";
import {PerspectiveCamera} from "@react-three/drei";
import { Object3D } from "three";

export default function Scene3d(props) {
    const [mouseX, setMouseX] = useState(0)
    const [mouseY, setMouseY] = useState(0)
    const cvPosition = new THREE.Vector3(-0.1, -0.204, -1.253)
    const camera = useThree((state) => state.camera)

    useFrame(() => {
        // Ajoutez une boucle infinie ici pour empêcher le composant de se charger complètement
        // while (true) {
        //     console.log('Loading...');
        // }
        camera.position.x += ( mouseX  / 2- camera.position.x)  * 0.01
        camera.position.y += (-mouseY / 2  - camera.position.y ) * 0.01;
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
            console.log(event)
            setMouseX((event.clientX - window.innerWidth / 2) / window.innerWidth * 2)
            setMouseY((event.clientY - window.innerHeight / 2) / window.innerHeight * 2)
        })

    }, [camera])
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

    const cameraRef = useRef();


    const lightPos = [-0.3, -0.3, -0.8]
    const lightPos2 = [-0.7, -0.3, -0.70]

    return <>
        <ambientLight intensity={0.02}/>
        <pointLight position={lightPos}  intensity={0.15} castShadow={true}/>
        {/*<Box position={lightPos} />*/}
        <pointLight position={lightPos2}  intensity={0.15} castShadow={true}/>
        {/*<Box position={lightPos2} />*/}
        <ImageMesh src="CV.png" width={4.5/9} height={4.5/16} position={cvPosition}/>
        <LoadModel position={[0.15, -0.9, -0.4]}/>
        <PerspectiveCamera
            // position={[0, 0, 0.5]}
                           makeDefault />
        {/*<OrbitControls/>*/}
    </>
}