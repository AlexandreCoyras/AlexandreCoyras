import fs from "fs"
import path from "path"
import util from "util"
import { NextApiResponse } from "next"
import { NextResponse } from "next/server"
import { Ratelimit } from "@upstash/ratelimit"
import { kv } from "@vercel/kv"
import OpenAI from "openai"

import { ChatResponseData } from "@/types/api"

import prePront from "./pre-prompt"

const ElevenLabs = require("elevenlabs-node")

const exec = util.promisify(require("child_process").exec)
const openai = new OpenAI()
const elevenLabsApiKey = process.env.ELEVEN_LABS_API_KEY!
const voiceID = "epyqkhUWYjoOPDho1jZk" // Markus

// const voice = new ElevenLabs({
//   apiKey: elevenLabsApiKey,
//   voiceId: voiceID,
// })

export async function POST(req: Request) {
  console.log(process.env.NODE_ENV)
  if (process.env.NODE_ENV !== "development") {
    const ip = req.headers.get("x-forwarded-for")
    // only in production
    const ratelimit = new Ratelimit({
      redis: kv,
      limiter: Ratelimit.slidingWindow(
        50, // 50
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
  const initialResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0613",
    messages,
  })
  // const initialResponseJson = await initialResponse.json()
  const initialResponseJson = initialResponse
  const initialResponseMessage = initialResponseJson?.choices?.[0]?.message

  const tempFilePath = process.platform === "win32" ? process.cwd() : "/tmp"
  const numberRand = Math.floor(Math.random() * 10)

  // if tempFilePath + /audios doesn't exist, create it
  if (!fs.existsSync(path.join(tempFilePath, "audios"))) {
    fs.mkdirSync(path.join(tempFilePath, "audios"))
  }
  const filePathMp3 = path.join(
    tempFilePath,
    "audios",
    `message_${numberRand}.mp3`
  )
  const filePathWav = path.join(
    tempFilePath,
    "audios",
    `message_${numberRand}.wav`
  )
  const filePathLipSync = path.join(
    tempFilePath,
    "audios",
    `message_${numberRand}.json`
  )

  // await voice.textToSpeech({
  //   fileName: filePathMp3,
  //   textInput: initialResponseMessage.content,
  //   modelId: "eleven_multilingual_v2",
  //   apiKey: elevenLabsApiKey,
  // })
  await ElevenLabs.textToSpeech(
    elevenLabsApiKey,
    voiceID,
    filePathMp3,
    initialResponseMessage.content,
    1,
    1,
    "eleven_multilingual_v2"
  )

  // only on vercel
  if (process.env.VERCEL) {
    const audioBase64 = await audioFileToBase64(filePathMp3)

    removeFile(filePathMp3)
    return NextResponse.json<ChatResponseData>(
      {
        message: initialResponseMessage,
        audio: audioBase64,
        lipSync: undefined,
      },
      {
        status: 200,
      }
    )
  }

  const ffmpegPath =
    process.platform === "win32"
      ? path.join(
          // depending on the OS, the path is different
          process.cwd(),
          "bin",
          "ffmpeg-windows",
          "bin",
          "ffmpeg.exe"
        )
      : path.join(process.cwd(), "bin", "ffmpeg-linux", "ffmpeg")

  const lipSyncMessage = async () => {
    const time = new Date().getTime()
    await execCommand(
      `${ffmpegPath} -y -i ${filePathMp3} ${filePathWav}`
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
  const lipSyncJson = await readJsonTranscript(filePathLipSync)

  removeFile(filePathMp3)
  removeFile(filePathWav)
  removeFile(filePathLipSync)

  return NextResponse.json<ChatResponseData>(
    {
      message: initialResponseMessage,
      audio: audioBase64,
      lipSync: lipSyncJson,
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

async function readJsonTranscript(file: string) {
  const data = fs.readFileSync(file, "utf8")
  return JSON.parse(data)
}
