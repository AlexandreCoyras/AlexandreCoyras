import { FC, useEffect, useRef, useState } from "react"
import { Gltf, useAnimations, useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import useSceneStore from "@store/sceneStore"
import { Group } from "three"
import * as THREE from "three"

const animationNames = {
  idle: "idle",
  talking: "talking",
  shrug: "shrug",
  head_no: "head_no",
  head_yes: "head_yes",
  waving: "waving",
}

const corresponding = {
  A: "viseme_PP",
  B: "viseme_kk",
  C: "viseme_I",
  D: "viseme_AA",
  E: "viseme_O",
  F: "viseme_U",
  G: "viseme_FF",
  H: "viseme_TH",
  X: "viseme_PP",
}

const Avatar: FC<any> = (props) => {
  const { nodes, materials } = useGLTF("/3d_models/alexandre_morph.glb") as any
  const { animations } = useGLTF("/3d_models/animations.glb")
  const group = useRef<Group>()
  const headRef = useRef<any>()
  const { actions, mixer } = useAnimations(animations, group) as any
  const [animation, setAnimation] = useState(
    animations.find((a) => a.name === animationNames.idle)
      ? animationNames.idle
      : animations[0].name // Check if Idle animation exists otherwise use first animation
  )

  useEffect(() => {
    actions[animation]
      ?.reset()
      .fadeIn(mixer.stats.actions.inUse === 0 ? 0 : 0.5)
      ?.play()
    return () => {
      actions[animation]?.fadeOut(0.5)
    }
  }, [actions, animation])

  useSceneStore.subscribe((state) => {
    if (state.hoveredFirstScreen && !state.clickedFirstScreen) {
      setAnimation(animationNames.waving)
    } else {
      setAnimation(animationNames.idle)
    }
  })

  useFrame((state, delta) => {
    const objTemp = new THREE.Object3D()
    objTemp.position.set(
      headRef.current?.position.x,
      headRef.current?.position.y,
      headRef.current?.position.z
    )
    objTemp.lookAt(state.camera.position)
    headRef.current?.quaternion.slerp(objTemp.quaternion, 0.1)
  })

  return (
    <>
      <group {...props} dispose={null} ref={group}>
        <primitive object={nodes.Hips} />
        <skinnedMesh
          name="EyeLeft"
          geometry={nodes.EyeLeft.geometry}
          material={materials.Wolf3D_Eye}
          skeleton={nodes.EyeLeft.skeleton}
          morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
          morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
        />
        <skinnedMesh
          name="EyeRight"
          geometry={nodes.EyeRight.geometry}
          material={materials.Wolf3D_Eye}
          skeleton={nodes.EyeRight.skeleton}
          morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
          morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
        />
        <skinnedMesh
          name="Wolf3D_Head"
          geometry={nodes.Wolf3D_Head.geometry}
          material={materials.Wolf3D_Skin}
          skeleton={nodes.Wolf3D_Head.skeleton}
          morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
          morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
          ref={headRef}
        />
        <skinnedMesh
          name="Wolf3D_Teeth"
          geometry={nodes.Wolf3D_Teeth.geometry}
          material={materials.Wolf3D_Teeth}
          skeleton={nodes.Wolf3D_Teeth.skeleton}
          morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
          morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
        />
        <skinnedMesh
          geometry={nodes.Wolf3D_Body.geometry}
          material={materials.Wolf3D_Body}
          skeleton={nodes.Wolf3D_Body.skeleton}
        />
        <skinnedMesh
          geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
          material={materials.Wolf3D_Outfit_Bottom}
          skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
        />
        <skinnedMesh
          geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
          material={materials.Wolf3D_Outfit_Footwear}
          skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
        />
        <skinnedMesh
          geometry={nodes.Wolf3D_Outfit_Top.geometry}
          material={materials.Wolf3D_Outfit_Top}
          skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
        />
        <skinnedMesh
          geometry={nodes.Wolf3D_Hair.geometry}
          material={materials.Wolf3D_Hair}
          skeleton={nodes.Wolf3D_Hair.skeleton}
        />
        <skinnedMesh
          geometry={nodes.Wolf3D_Glasses.geometry}
          material={materials.Wolf3D_Glasses}
          skeleton={nodes.Wolf3D_Glasses.skeleton}
        />
      </group>
    </>
  )
}

useGLTF.preload("/3d_models/alexandre_morph.glb")
useGLTF.preload("/3d_models/animations.glb")
export default Avatar
