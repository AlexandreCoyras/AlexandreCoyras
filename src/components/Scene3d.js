import {useFrame, useLoader, Cam} from "@react-three/fiber";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import {Suspense, useEffect, useRef, useState} from 'react'
import dynamic from 'next/dynamic'
const OrbitControls = dynamic(import('@react-three/drei').then((module) => module.OrbitControls ) , { ssr: false })
const { useHelper } = dynamic(() => import('@react-three/drei'), { ssr: false });
import ImageMesh from "./ImageMesh";


export default function Scene3d() {
    useFrame(() => {
        // Ajoutez une boucle infinie ici pour empêcher le composant de se charger complètement
        // while (true) {
        //     console.log('Loading...');
        // }
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
        // console.log(test)
    }, [])
    const LoadModel = () => {
        const { scene } = useLoader(GLTFLoader, "3d_models/room2.glb")
        console.log(scene)
        return <primitive object={scene} position={[0, -1, 0]} scale={0.5} receiveShadow={true}/>
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
    // const lightRef = useRef()
    // useHelper(lightRef,  THREE.PointLightHelper)

    return <>
        <ambientLight intensity={0.02}/>
        <pointLight position={lightPos}  intensity={0.15} castShadow={true}/>
        {/*<Box position={lightPos} />*/}
        <pointLight position={lightPos2}  intensity={0.15} castShadow={true}/>
        {/*<Box position={lightPos2} />*/}
        <ImageMesh src="CV.png" width={4.5/9} height={4.5/16} position={[-0.25, -0.304, -0.852]}/>
        <LoadModel/>
        {/*<OrbitControls/>*/}
    </>
}