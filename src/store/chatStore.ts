import { create } from "zustand"

type Animation =
  | "idle"
  | "talking"
  | "shrug"
  | "head_no"
  | "head_yes"
  | "waving"

type chatStore = {
  animation: Animation
  setAnimation: (newAnimation: Animation) => void
  audio: any
  setAudio: (newAudio: any) => void
  lipsync: any
  setLipsync: (newLipsync: any) => void
}

const useChatStore = create<chatStore>((set, getState) => ({
  animation: "idle",
  setAnimation: (newAnimation: Animation) => {
    if (newAnimation === getState().animation) return
    set(() => ({ animation: newAnimation }))
  },
  audio: undefined,
  setAudio: (newAudio: any) => set(() => ({ audio: newAudio })),
  lipsync: undefined,
  setLipsync: (newLipsync: any) => set(() => ({ lipsync: newLipsync })),
}))

export default useChatStore
