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
  const mode = typeof window !== "undefined" ? JSON.parse(window?.localStorage?.getItem("lazy-mode") ?? "true") as boolean : true;

  const [open, setOpen] = useState(false)
  const [lazyMode, setLazyMode] = useState(mode)

  useEffect(() => {
    localStorage.setItem("lazy-mode", `${lazyMode}`)

    if (!lazyMode) SpeechRecognition.stopListening()
  }, [lazyMode])

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
                      if (lazyMode) SpeechRecognition.startListening({ continuous: false, language: "en-US" })
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