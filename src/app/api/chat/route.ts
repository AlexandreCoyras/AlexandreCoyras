import fs from "fs"
import path from "path"
import util from "util"
import { NextApiResponse } from "next"
import { Ratelimit } from "@upstash/ratelimit"
import { kv } from "@vercel/kv"
import { OpenAIStream, StreamingTextResponse } from "ai"
import { Configuration, OpenAIApi } from "openai-edge"

import prePront from "./pre-prompt"

const ElevenLabs = require("elevenlabs-node")

const Mp32Wav = require("mp3-to-wav")

const exec = util.promisify(require("child_process").exec)

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(config)
const elevenLabsApiKey = process.env.ELEVEN_LABS_API_KEY!
const voiceID = "epyqkhUWYjoOPDho1jZk" // Markus
const voice = new ElevenLabs({
  apiKey: elevenLabsApiKey,
  voiceId: voiceID,
})

type ResponseData = {
  message: string
  audio: string
}

// export const runtime = "edge"

export async function POST(req: Request, res: NextApiResponse<ResponseData>) {
  if (
    process.env.NODE_ENV !== "development" &&
    process.env.KV_REST_API_URL &&
    process.env.KV_REST_API_TOKEN
  ) {
    const ip = req.headers.get("x-forwarded-for")
    const ratelimit = new Ratelimit({
      redis: kv,
      limiter: Ratelimit.slidingWindow(
        200, // 50
        "1 d"
      ),
    })

    const { success, limit, reset, remaining } = await ratelimit.limit(
      `chathn_ratelimit_${ip}`
    )

    if (!success) {
      return new Response("You have reached your request limit for the day.", {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      })
    }
  }
  const { messages } = await req.json()
  messages.unshift({
    role: "system",
    content: prePront,
  })

  // check if the conversation requires a function call to be made
  const initialResponse = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-0613",
    messages,
  })
  const initialResponseJson = await initialResponse.json()
  const initialResponseMessage = initialResponseJson?.choices?.[0]?.message

  const chunks = initialResponseMessage.content.split(" ")

  const numberRand = Math.floor(Math.random() * 10)
  const filePathMp3 = path.join(
    process.cwd(),
    "audios",
    `message_${numberRand}.mp3`
  )
  const filePathWav = path.join(
    process.cwd(),
    "audios",
    `message_${numberRand}.wav`
  )
  const filePathLipSync = path.join(
    process.cwd(),
    "audios",
    `message_${numberRand}.json`
  )

  await voice.textToSpeech({
    // Required Parameters
    fileName: filePathMp3,
    textInput: initialResponseMessage.content,

    // Optional Parameters
    modelId: "eleven_multilingual_v2",
  })

  const lipSyncMessage = async () => {
    const time = new Date().getTime()
    await execCommand(
      `ffmpeg -y -i ${filePathMp3} ${filePathWav}`
      // -y to overwrite the file
    )
    console.log(`Conversion done in ${new Date().getTime() - time}ms`)

    const rhubarbPath =
      process.platform === "win32"
        ? path.join(
            // depending on the OS, the path is different
            process.cwd(),
            "bin",
            "rhubarb-windows",
            "rhubarb.exe"
          )
        : path.join(process.cwd(), "bin", "rhubarb-linux", "rhubarb")

    await execCommand(
      `${rhubarbPath} -f json -o ${filePathLipSync} ${filePathWav} -r phonetic`
    )
    // -r phonetic is faster but less accurate
    console.log(`Lip sync done in ${new Date().getTime() - time}ms`)
  }

  await lipSyncMessage()

  // check if the file wav exists
  if (!fs.existsSync(filePathWav)) {
    console.error("File wav not found")
    return
  }
  const stream = new ReadableStream({
    async start(controller) {
      for (const chunk of chunks) {
        const bytes = new TextEncoder().encode(chunk + " ")
        controller.enqueue(bytes)
        await new Promise((r) =>
          setTimeout(
            r,
            // get a random number between 10ms and 30ms to simulate a random delay
            Math.floor(Math.random() * 20 + 10)
          )
        )
      }
      controller.close()
    },
  })
  return new StreamingTextResponse(stream)

  // const audioFileToBase64 = async (filepath: string) => {
  //   const data = fs.readFileSync(filepath)
  //   return data.toString("base64")
  // }
  //
  // res.status(200).json({
  //   message: initialResponseMessage.content,
  //   audio: await audioFileToBase64(filePathMp3),
  // })
}

const execCommand = (command: string) => {
  return new Promise((resolve, reject) => {
    exec(command, (error: any, stdout: any) => {
      if (error) reject(error)
      resolve(stdout)
    })
  })
}
