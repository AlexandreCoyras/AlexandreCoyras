import { FC, useEffect, useState } from "react"

interface SpeechBubbleProps {
  text: string
}

// https://codepen.io/perossing/pen/WZorxv <- bubble design
const SpeechBubble: FC<SpeechBubbleProps> = ({ text }) => {
  const [visibleIndex, setVisibleIndex] = useState(0)
  const words = text.split(" ")

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleIndex((index) => (index < words.length ? index + 1 : index))
    }, 130)
    return () => clearInterval(interval)
  }, [text, words.length])

  return (
    <>
      <div>
        <div className="min-w-[30rem] max-w-3xl mx-auto bg-[#FFFEEE] p-8 rounded-lg shadow-2xl text-[2rem] text-center text-gray-700">
          <div className={"relative z-10"}>
            {words.slice(0, visibleIndex).join(" ")}
          </div>
        </div>
        <div className="h-10 w-10 bg-[#FFFEEE] z-0 shadow-2xl mx-auto transform left-1/2 -translate-x-1/2 rotate-45 -mt-8" />
      </div>
    </>
  )
}

export default SpeechBubble
