import { create } from "zustand"

type settingsStore = {
  faceControls: boolean
  setFaceControls: (newFaceControl: boolean) => void
  eyeControls: boolean
  setEyeControls: (newEyeControl: boolean) => void
  shaders: boolean
  setShaders: (newShaders: boolean) => void
}

const useSettingsStore = create<settingsStore>()((set) => ({
  faceControls: false,
  setFaceControls: (newFaceControl: boolean) =>
    set((state) => ({
      faceControls: newFaceControl,
      eyeControls: newFaceControl ? false : state.eyeControls,
    })),
  eyeControls: false,
  setEyeControls: (newEyeControl: boolean) =>
    set((state) => ({
      eyeControls: newEyeControl,
      faceControls: newEyeControl ? false : state.faceControls,
    })),
  shaders: true,
  setShaders: (newShaders: boolean) => set(() => ({ shaders: newShaders })),
}))

export default useSettingsStore
