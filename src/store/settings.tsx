import { create } from 'zustand';

type settingsStore = {
    faceControl: boolean;
    setFaceControl: (newFaceControl: boolean) => void;
    eyeControl: boolean;
    setEyeControl: (newEyeControl: boolean) => void;
};

const useSettingsStore = create<settingsStore>()((set) => ({
    faceControl: false,
    setFaceControl: (newFaceControl: boolean) =>
        set((state) => ({
            faceControl: newFaceControl,
            eyeControl: newFaceControl ? false : state.eyeControl,
        })),
    eyeControl: false,
    setEyeControl: (newEyeControl: boolean) =>
        set((state) => ({
            eyeControl: newEyeControl,
            faceControl: newEyeControl ? false : state.faceControl,
        })),
}));

export default useSettingsStore;
