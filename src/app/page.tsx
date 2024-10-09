"use client"

import React, { Suspense, useState } from "react"
import Link from "next/link"
import useSettingsStore from "@/store/settingsStore"
import Loading from "@components/loading"
import SceneCanvas from "@components/three/scene-canvas"
import { cn } from "@lib/utils"
import { FaceLandmarker, Loader, PerformanceMonitor } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import useSceneStore from "@store/sceneStore"
import { Leva } from "leva"
import { AiFillGithub } from "react-icons/ai"
import { BiCode } from "react-icons/bi"
import { FiExternalLink } from "react-icons/fi"

import Contact from "@/components/contact"
import Settings from "@/components/settings"
import Scene from "@/components/three/scene"
import Title from "@/components/title"

export default function Home() {
  const [isLoading, setLoading] = useState(true)
  const isDev = process.env.NODE_ENV === "development"

  return (
    <>
      <Loading isLoading={isLoading} setLoading={setLoading} />
      {/*<Loader />*/}
      <div className={"relative w-full h-full"}>
        <Leva hidden={!isDev} />
        <Suspense fallback={null}>
          {!isLoading && (
            <>
              <div className={"relative h-screen w-screen"}>
                <SceneCanvas />
              </div>
              {/*<div*/}
              {/*  className={cn(*/}
              {/*    `flex items-center absolute z-30 justify-center duration-1000 ease-in-out left-1/2 transform -translate-x-1/2`,*/}
              {/*    clickedSecondScreen ? "opacity-100" : "opacity-0",*/}
              {/*    clickedSecondScreen ? "visible" : "invisible"*/}
              {/*  )}*/}
              {/*>*/}
              {/*  <Link*/}
              {/*    href="/AlexandreCoyrasCV.pdf"*/}
              {/*    target="_blank"*/}
              {/*    rel="noopener noreferrer"*/}
              {/*    className={"flex items-center justify-center"}*/}
              {/*  >*/}
              {/*    <div className="button-fade-in absolute bottom-16 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-black bg-white text-black transition-colors duration-200 ease-in-out hover:bg-black hover:text-white">*/}
              {/*      <FiExternalLink size={25} />*/}
              {/*    </div>*/}
              {/*  </Link>*/}
              {/*</div>*/}

              <Settings className={"fixed bottom-10 left-6 z-30"} />

              <Link
                href={"https://github.com/AlexandreCoyras/AlexandreCoyras"}
                target="_blank"
                rel="noopener noreferrer"
                className={""}
              >
                <div className="fixed bottom-8 right-20 z-30 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-black bg-white text-black transition-colors duration-200 ease-in-out hover:bg-black hover:text-white">
                  <BiCode size={30} />
                </div>
              </Link>
              <Link
                href={"https://github.com/AlexandreCoyras"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="fixed bottom-8 right-6 z-30 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-black bg-white text-black transition-colors duration-200 ease-in-out hover:bg-black hover:text-white">
                  <AiFillGithub size={30} />
                </div>
              </Link>
              <div className={"z-10"}>
                <Suspense fallback={null}>
                  <Contact />
                </Suspense>
                <Title />
              </div>
            </>
          )}
        </Suspense>
      </div>
    </>
  )
}
