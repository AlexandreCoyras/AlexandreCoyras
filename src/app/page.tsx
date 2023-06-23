"use client"

import React, { lazy, Suspense, useRef, useState } from "react"
import Link from "next/link"
import useSettingsStore from "@/store/settingsStore"
import Contact from "@components/contact"
import Settings from "@components/settings"
import Effect from "@components/three/effect"
import Scene from "@components/three/scene"
import Title from "@components/title"
import {
  FaceLandmarker,
  PerformanceMonitor,
  useProgress,
} from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { AiFillGithub } from "react-icons/ai"
import { BiCode } from "react-icons/bi"
import { FiExternalLink } from "react-icons/fi"

import { Progress } from "@/components/ui/progress"

const Scene3d = lazy(() => import("@components/three/scene"))
const SceneLoad = lazy(() => import("@components/three/scene-load"))

export default function Home() {
  const DepthOfFieldRef = useRef(null)
  const cvLinkRef = useRef(null)
  const [dpr, setDpr] = useState(1.5)
  const { shaders, setShaders } = useSettingsStore()

  const Loading = () => {
    const { progress } = useProgress()
    return (
      <>
        <div
          className={
            "mx-10 flex h-screen flex-col items-center justify-center gap-5"
          }
        >
          <div className={"text-center text-xl font-semibold"}>
            Loading: {Math.round(progress)}%...
          </div>
          <Progress value={progress} className="max-w-lg" />
        </div>
      </>
    )
  }

  return (
    <>
      <Suspense fallback={<Loading />}>
        <div className={"relative h-screen w-screen"}>
          <Canvas
            dpr={dpr}
            camera={{ position: 0, fov: 50 }}
            className={"absolute left-0 top-0 z-0"}
          >
            <PerformanceMonitor
              onIncline={() => {
                setDpr(2)
              }}
              onDecline={() => {
                setDpr(1)
                setShaders(false)
              }}
            >
              <FaceLandmarker>
                <Scene cvLinkRef={cvLinkRef} dofRef={DepthOfFieldRef} />
                {shaders && <Effect ref={DepthOfFieldRef} />}
              </FaceLandmarker>
            </PerformanceMonitor>
          </Canvas>
        </div>

        <div
          className={`flex items-center justify-center opacity-0 duration-1000 ease-in-out`}
          ref={cvLinkRef}
        >
          <Link
            href="/AlexandreCoyrasCV.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={"flex items-center justify-center"}
          >
            <div className="button-fade-in absolute bottom-16 z-50 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-black bg-white text-black transition-colors duration-200 ease-in-out hover:bg-black hover:text-white">
              <FiExternalLink size={25} />
            </div>
          </Link>
        </div>

        <Settings className={"fixed bottom-10 left-6 z-50"} />

        <Link
          href={"https://github.com/AlexandreCoyras/AlexandreCoyras"}
          target="_blank"
          rel="noopener noreferrer"
          className={""}
        >
          <div className="fixed bottom-8 right-20 z-50 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-black bg-white text-black transition-colors duration-200 ease-in-out hover:bg-black hover:text-white">
            <BiCode size={30} />
          </div>
        </Link>
        <Link
          href={"https://github.com/AlexandreCoyras"}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="fixed bottom-8 right-6 z-50 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-black bg-white text-black transition-colors duration-200 ease-in-out hover:bg-black hover:text-white">
            <AiFillGithub size={30} />
          </div>
        </Link>
        <div className={"z-10"}>
          <Contact />
          <Title />
        </div>
      </Suspense>
    </>
  )
}
