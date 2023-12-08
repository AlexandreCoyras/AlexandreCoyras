import fs from "fs"
import path from "path"
import util from "util"
import { NextApiResponse } from "next"
import { NextResponse } from "next/server"
import { Ratelimit } from "@upstash/ratelimit"
import { kv } from "@vercel/kv"
import { Configuration, OpenAIApi } from "openai-edge"

import { ChatResponseData } from "@/types/api"

import prePront from "./pre-prompt"

const ElevenLabs = require("elevenlabs-node")

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

export async function POST(
  req: Request,
  res: NextApiResponse<ChatResponseData>
) {
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

  const voices = await voice.getVoices()
  console.log(voices)
  // await voice.textToSpeech({
  //   // Required Parameters
  //   fileName: filePathMp3,
  //   textInput: initialResponseMessage.content,
  //
  //   // Optional Parameters
  //   modelId: "eleven_multilingual_v2",
  // })

  await voice.textToSpeech({
    fileName: filePathMp3,
    textInput: initialResponseMessage.content,
    modelId: "eleven_multilingual_v2",
    apiKey: elevenLabsApiKey,
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

  const audioBase64 = await audioFileToBase64(filePathMp3)
  const lipSyncBase64 = await audioFileToBase64(filePathLipSync)

  removeFile(filePathMp3)
  removeFile(filePathWav)
  removeFile(filePathLipSync)

  return NextResponse.json<ChatResponseData>(
    {
      message: initialResponseMessage,
      audio: audioBase64,
      lipSync: lipSyncBase64,
    },
    {
      status: 200,
    }
  )
}

const execCommand = (command: string) => {
  return new Promise((resolve, reject) => {
    exec(command, (error: any, stdout: any) => {
      if (error) reject(error)
      resolve(stdout)
    })
  })
}

function removeFile(filepath: string) {
  fs.unlink(filepath, (err) => {
    if (err) {
      console.error(err)
      return
    }
  })
}

async function audioFileToBase64(filepath: string) {
  const data = fs.readFileSync(filepath)
  return data.toString("base64")
}
