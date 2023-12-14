"use client"

import { FC, useEffect } from "react"
import { Progress } from "@components/ui/progress"
import { Loader, useProgress } from "@react-three/drei"
import { AnimatePresence, motion } from "framer-motion"

interface LoadingProps {
  isLoading: boolean
  setLoading: (isLoading: boolean) => void
}

const Loading: FC<LoadingProps> = ({ isLoading, setLoading }) => {
  const { progress } = useProgress()
  useEffect(() => {
    if (progress >= 100) setLoading(false)
  }, [progress, setLoading])

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <>
            <motion.div
              className={
                "z-40 text-foreground absolute bg-background flex left-0 top-0 w-screen h-screen flex-col items-center justify-center "
              }
              initial={{ opacity: 1 }}
              exit={{
                opacity: 0,
                transition: { duration: 1, delay: 0.2, ease: "easeIn" },
              }}
              key={"loading"}
            >
              <motion.div
                className={"w-full max-w-lg gap-5 flex-col flex"}
                initial={{ opacity: 1 }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.5, delay: 0.2 },
                }}
              >
                <div className={"text-center text-xl font-semibold"}>
                  Loading: {Math.round(progress)}%...
                </div>
                <Progress value={progress} className="max-w-lg" />
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Loading
