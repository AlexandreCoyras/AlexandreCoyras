import { create } from "zustand"

type sceneStore = {
  clickedFirstScreen: boolean
  setClickedFirstScreen: (newClickedFirstScreen: boolean) => void
  clickedSecondScreen: boolean
  setClickedSecondScreen: (newClickedSecondScreen: boolean) => void
  hoveredFirstScreen: boolean
  setHoveredFirstScreen: (newHoveredFirstScreen: boolean) => void
  hoveredSecondScreen: boolean
  setHoveredSecondScreen: (newHoveredSecondScreen: boolean) => void
}

const useSceneStore = create<sceneStore>()((set) => ({
  clickedFirstScreen: false,
  clickedSecondScreen: false,
  hoveredFirstScreen: false,
  hoveredSecondScreen: false,
  setClickedFirstScreen: (newClickedFirstScreen: boolean) =>
    set(() => ({ clickedFirstScreen: newClickedFirstScreen })),
  setClickedSecondScreen: (newClickedSecondScreen: boolean) =>
    set(() => ({ clickedSecondScreen: newClickedSecondScreen })),
  setHoveredFirstScreen: (newHoveredFirstScreen: boolean) =>
    set(() => ({ hoveredFirstScreen: newHoveredFirstScreen })),
  setHoveredSecondScreen: (newHoveredSecondScreen: boolean) =>
    set(() => ({ hoveredSecondScreen: newHoveredSecondScreen })),
}))

export default useSceneStore
