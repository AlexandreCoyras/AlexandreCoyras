import React, { FC, useEffect, useRef, useState } from "react"
import { LoadingCircle, SendIcon } from "@components/chat/icons"
import { cn } from "@lib/utils"
import { Html } from "@react-three/drei"
import useSceneStore from "@store/sceneStore"
import Textarea from "react-textarea-autosize"
import { DoubleSide } from "three"

import useChat from "@/hooks/use-chat"

const ChatOverlay: FC = (props: any) => {
  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [input, setInput] = useState("")
  const { data, isPending, mutate } = useChat()
  const disabled = isPending || input.length === 0
  const [visibleIndex, setVisibleIndex] = useState(0)
  const { clickedFirstScreen } = useSceneStore()

  const [datas, setDatas] = useState<Array<any>>([])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // va.track("Chat submitted", { input })
    const messages = [...datas, { content: input, role: "user" }]
    mutate(messages)
    setDatas(messages)
    setInput("")
    // inputRef.current?.focus()
  }

  useEffect(() => {
    if (data) {
      // play base64 mp3 audio in data.audio
      const audio = new Audio("data:audio/mp3;base64," + data.audio)
      audio.play()

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

  return (
    <>
      <Html
        transform
        scale={0.01}
        pointerEvents={clickedFirstScreen ? "auto" : "none"}
        {...props}
      >
        <div className={"w-[125rem] h-[70.5rem] relative"}>
          <div className="fixed bottom-0 flex w-full flex-col items-center space-y-3 p-5 pb-3 sm:px-0">
            {/*bg-gradient-to-b from-transparent via-background to-background*/}
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
