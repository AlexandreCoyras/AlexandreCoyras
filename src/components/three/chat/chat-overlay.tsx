import React, { FC, Suspense, useEffect, useRef, useState } from "react"
import { LoadingCircle, SendIcon } from "@components/chat/icons"
import SpeechBubble from "@components/three/chat/speech-bubble"
import { cn } from "@lib/utils"
import { Html, Text } from "@react-three/drei"
import useChatStore from "@store/chatStore"
import useSceneStore from "@store/sceneStore"
import { track } from "@vercel/analytics/react"
import Textarea from "react-textarea-autosize"
import { DoubleSide } from "three"

import useChat from "@/hooks/use-chat"

const Dots = (props: any) => {
  const [loadingText, setLoadingText] = useState("")
  useEffect(() => {
    if (props.loading) {
      const interval = setInterval(() => {
        setLoadingText((loadingText) => {
          if (loadingText.length > 2) {
            return "."
          }
          return loadingText + "."
        })
      }, 800)
      return () => clearInterval(interval)
    } else {
      setLoadingText("")
    }
  }, [props.loading])
  if (!props.loading) return null
  return (
    <Text fontSize={0.08} anchorX={"left"} anchorY={"bottom"} {...props}>
      {loadingText}
      <meshBasicMaterial attach="material" color="black" />
    </Text>
  )
}

const ChatOverlay: FC = (props: any) => {
  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [input, setInput] = useState("")
  const { data, isPending, mutate } = useChat()
  const disabled = isPending || input.length === 0
  const [visibleIndex, setVisibleIndex] = useState(0)
  const { clickedFirstScreen } = useSceneStore()
  const { setAnimation, setAudio, setLipsync } = useChatStore()

  const [datas, setDatas] = useState<Array<any>>([])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    track("Chat submitted", { input })
    const messages = [...datas, { content: input, role: "user" }]
    mutate(messages)
    setDatas(messages)
    setInput("")
    inputRef.current?.focus()
  }

  useEffect(() => {
    if (data) {
      const audio = new Audio("data:audio/mp3;base64," + data.audio)
      audio.play().then(() => setAnimation("talking"))
      audio.addEventListener("ended", () => setAnimation("idle"))
      setAudio(audio)
      setLipsync(data.lipSync)

      setDatas((datas) => [...datas, data.message])
      setVisibleIndex(0)
      const interval = setInterval(() => {
        if (!data) return
        const words = data.message.content.split(" ")
        setVisibleIndex((index) =>
          data.message.role === "assistant" && index < words.length
            ? index + 1
            : index
        )
      }, 80)
      return () => clearInterval(interval)
    }
  }, [data])

  const dotsPosition = [
    props.position[0] - 0.038,
    props.position[1] + 0.07,
    props.position[2],
  ]

  return (
    <>
      <Suspense>
        <Dots loading={isPending} position={dotsPosition} />
      </Suspense>
      <Html
        transform
        scale={0.01}
        pointerEvents={clickedFirstScreen ? "auto" : "none"}
        {...props}
      >
        <div className={"w-[125rem] h-[70.5rem] relative"}>
          {data?.message?.content && (
            <div className="absolute top-8 flex flex-col items-center justify-center left-1/2 transform -translate-x-1/2">
              <SpeechBubble text={data?.message?.content} />
            </div>
          )}
          <div className="fixed bottom-0 flex w-full mx-auto flex-col items-center space-y-3 p-5 pb-3 sm:px-0">
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="relative w-full max-w-screen-md rounded-xl border border-gray-200 bg-background px-4 pb-2 pt-3 shadow-lg sm:pb-3 sm:pt-4"
            >
              <Textarea
                ref={inputRef}
                tabIndex={0}
                required
                rows={1}
                autoFocus
                placeholder="Send a message"
                onChange={(e) => setInput(e.target.value)}
                value={input}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    formRef.current?.requestSubmit()
                    e.preventDefault()
                  }
                }}
                spellCheck={false}
                className="w-full pr-10 focus:outline-none bg-background"
              />
              <button
                className={cn(
                  "absolute inset-y-0 right-3 my-auto flex h-8 w-8 items-center justify-center rounded-md transition-all",
                  disabled
                    ? "cursor-not-allowed bg-background"
                    : "bg-foreground/80  hover:bg-foreground"
                )}
                disabled={disabled}
              >
                {isPending ? (
                  <LoadingCircle />
                ) : (
                  <SendIcon
                    className={cn(
                      "h-4 w-4",
                      input.length === 0 ? "text-gray-700" : "text-background"
                    )}
                  />
                )}
              </button>
            </form>
          </div>
        </div>
      </Html>
    </>
  )
}

export default ChatOverlay
