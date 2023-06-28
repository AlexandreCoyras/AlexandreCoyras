"use client"

import React, { FC, useRef } from "react"
import Image from "next/image"
import { cn } from "@lib/utils"
import { useChat } from "ai/react"
import { Bot, User } from "lucide-react"
import ReactMarkdown from "react-markdown"
import Textarea from "react-textarea-autosize"
import remarkGfm from "remark-gfm"
import { toast } from "sonner"

import {
  GithubIcon,
  LoadingCircle,
  SendIcon,
  VercelIcon,
} from "@/components/chat/icons"

const examples = [
  "What technologies do you use?",
  "For how long have you been working in the tech industry?",
  "What is your favorite programming language?",
]

const Page: FC = () => {
  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const { messages, input, setInput, handleSubmit, isLoading } = useChat({
    onResponse: (response) => {
      if (response.status === 429) {
        toast.error("You have reached your request limit for the day.")
        // va.track("Rate limited")
        return
      } else {
        // va.track("Chat initiated")
      }
    },
    onError: (error) => {
      // va.track("Chat errored", {
      //   input,
      //   error: error.message,
      // })
    },
  })

  const disabled = isLoading || input.length === 0
  return (
    <main className="flex flex-col items-center justify-between pb-40">
      <div className="absolute top-5 hidden w-full justify-end px-5 sm:flex">
        <a
          href="https://github.com/AlexandreCoyras"
          target="_blank"
          className="rounded-lg p-2 transition-colors duration-200 hover:bg-stone-800 sm:bottom-auto"
        >
          <GithubIcon />
        </a>
      </div>
      {messages.length > 0 ? (
        messages.map((message, i) => (
          <div
            key={i}
            className={cn(
              "flex w-full items-center justify-center border-b border-gray-200 py-8",
              message.role === "user" ? "bg-background" : "bg-gray-900"
            )}
          >
            <div className="flex w-full max-w-screen-md items-start space-x-4 px-5 sm:px-0">
              <div
                className={cn(
                  "text-background",
                  message.role === "assistant"
                    ? "bg-foreground"
                    : "bg-foreground p-1 px-1.5"
                )}
              >
                {message.role === "user" ? (
                  <User width={20} />
                ) : (
                  <Image
                    src={"/alexandre-coyras.png"}
                    alt={"Alexandre Coyras"}
                    className={"w-full"}
                    width={32}
                    height={32}
                    priority
                  />
                )}
              </div>
              <ReactMarkdown
                className="prose mt-1 w-full break-words prose-p:leading-relaxed"
                remarkPlugins={[remarkGfm]}
                components={{
                  // open links in new tab
                  a: (props) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" />
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
        ))
      ) : (
        <div className="border-accent sm:mx-0 mx-5 mt-20 max-w-screen-md rounded-md border sm:w-full">
          <div className="flex flex-col space-y-4 p-7 sm:p-10">
            <h1 className="text-lg font-semibold text-foreground">
              Welcome to Alex&apos;s Chatbot!
            </h1>
            <p className="text-secondary-foreground">
              This is a chatbot made with OpenAI&apos;s GPT-3.5 API. It can
              answer most questions you may have about me
            </p>
          </div>
          <div className="flex flex-col space-y-4 border-t border-gray-800 bg-background p-7 sm:p-10">
            {examples.map((example, i) => (
              <button
                key={i}
                className="rounded-md border border-gray-200 bg-background px-5 py-3 text-left text-sm text-secondary-foreground transition-all duration-75 hover:border-accent hover:text-secondary-foreground/80 active:bg-secondary"
                onClick={() => {
                  setInput(example)
                  inputRef.current?.focus()
                }}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="fixed bottom-0 flex w-full flex-col items-center space-y-3 bg-gradient-to-b from-transparent via-background to-background p-5 pb-3 sm:px-0">
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
            defaultValue={""}
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
                : "bg-green-500 hover:bg-green-600"
            )}
            disabled={disabled}
          >
            {isLoading ? (
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
        <p className="text-center text-xs text-gray-400">
          Built with{" "}
          <a
            href="https://sdk.vercel.ai/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            Vercel AI SDK
          </a>
          .
        </p>
      </div>
    </main>
  )
}

export default Page
