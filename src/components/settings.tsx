import { FC } from "react"
import useSettingsStore from "@/store/settingsStore"
import { Settings2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"

type SettingsProps = {
  className?: string
}

const Settings: FC<SettingsProps> = ({ className }) => {
  const {
    faceControls,
    setFaceControls,
    eyeControls,
    setEyeControls,
    shaders,
    setShaders,
  } = useSettingsStore()

  return (
    <div className={className}>
      <Popover>
        <PopoverTrigger asChild>
          <Button className="h-12 w-12 rounded-full p-0">
            <Settings2 className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="ml-1 w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Settings</h4>
              <p className="text-sm text-muted-foreground">
                Set the settings of the page
              </p>
            </div>
            <div className="grid gap-2">
              {/* <div className="flex items-center space-x-2">
                <Switch
                  id="face-control"
                  checked={faceControls}
                  onCheckedChange={setFaceControls}
                />
                <Label htmlFor="face-control">Face controls</Label>
              </div> */}
              {/* <div className="flex items-center space-x-2">
                <Switch
                  id="eye-control"
                  checked={eyeControls}
                  onCheckedChange={setEyeControls}
                />
                <Label htmlFor="eye-control">Eye controls</Label>
              </div> */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="shaders"
                  checked={shaders}
                  onCheckedChange={setShaders}
                />
                <Label htmlFor="shaders">Shaders</Label>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default Settings
