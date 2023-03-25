import React, { useRef } from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

function ImageMesh(props) {
    const meshRef = useRef();
    const texture = useLoader(THREE.TextureLoader, props.src);

    return (
        <mesh ref={meshRef} position={props.position} onPointerOver={props.onPointerOver} rotation={props.rotation} onPointerOut={props.onPointerOut} onClick={props.onClick}>
            <planeGeometry args={[props.width, props.height]}/>
            <meshBasicMaterial map={texture} color={""} />
        </mesh>
    );
}

export default ImageMesh;