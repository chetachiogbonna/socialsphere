"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "./ui/button"
import { Settings as LucideSettings } from 'lucide-react';
import { useEffect, useState } from "react";
import { Switch } from "./ui/switch";
import SpeechRecognition from "react-speech-recognition";

function Settings() {
  let mode = false
  const [open, setOpen] = useState(false)
  const [lazyMode, setLazyMode] = useState(mode)

  useEffect(() => {
    if (typeof window !== "undefined") {
      mode = JSON.parse(localStorage.getItem("lazy-mode") || "true")
    } else {
      mode = true;
    }

    localStorage.setItem("lazy-mode", `${lazyMode}`)

    if (!lazyMode) SpeechRecognition.stopListening()
  }, [lazyMode])

  console.log(mode);
  console.log("lazyMode", lazyMode);

  return (
    <div>
      <Button
        className="flex justify-start gap-2 w-[94%] mx-auto bg-blue hover:bg-blue cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <LucideSettings />
        Settings
      </Button>

      {open && (
        <Dialog open={open}>
          <DialogContent className="bg-dark-2" showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>Choose your preferences</DialogTitle>
              <DialogDescription>
                <p className="text-gray-300 flex justify-between items-center mb-3">
                  Lazy Mode
                  <Switch
                    className="bg-black"
                    checked={lazyMode}
                    onCheckedChange={() => setLazyMode(prev => !prev)}
                    aria-readonly
                  />
                </p>

                <p className="text-gray-300 flex justify-between items-center">
                  Auto-Create Post
                  <Switch
                    className="bg-black"
                    checked={lazyMode}
                    onCheckedChange={() => setLazyMode(prev => !prev)}
                    aria-readonly
                  />
                </p>

                <div className="flex justify-end mt-10">
                  <Button
                    className="bg-blue hover:bg-blue cursor-pointer"
                    onClick={() => {
                      setOpen(false)
                      if (lazyMode) SpeechRecognition.startListening({ continuous: mode, language: "en-US" })
                    }}
                  >
                    Save
                  </Button>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default Settings