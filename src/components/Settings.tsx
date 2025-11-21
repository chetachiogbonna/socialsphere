"use client";

import { Settings as LucideSettings } from 'lucide-react';
import { useEffect, useState } from "react";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { useAIAction } from '@/context/AIAction';

function Settings() {
  const [open, setOpen] = useState(false)
  const { lazyMode, setLazyMode, stopListening } = useAIAction()
  const [autoCreatePost, setAutoCreatePost] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("lazy-mode", JSON.stringify(lazyMode))
  }, [lazyMode])

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("auto-create-post", JSON.stringify(autoCreatePost))
  }, [autoCreatePost])

  return (
    <div>
      <Button
        className="flex justify-start gap-2 w-[94%] mx-auto bg-blue hover:bg-blue-700 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <LucideSettings />
        Settings
      </Button>

      {open && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent
            showCloseButton={true}
            className="bg-dark/90 border border-gray-700 max-w-lg flex flex-col"
          >
            <DialogHeader>
              <DialogTitle>Choose your preferences</DialogTitle>
              <DialogDescription className="mt-4 flex flex-col gap-6">
                <p className="text-gray-300 flex justify-between items-center">
                  Lazy Mode
                  <Switch
                    className="bg-black"
                    checked={lazyMode}
                    onCheckedChange={() => {
                      if (lazyMode) {
                        stopListening()
                      }
                      setLazyMode(!lazyMode)
                    }}
                    aria-disabled="false"
                  />
                </p>
                <p className="text-gray-300 flex justify-between items-center">
                  Auto-Create Post
                  <Switch
                    className="bg-black"
                    checked={autoCreatePost}
                    onCheckedChange={() => setAutoCreatePost(prev => !prev)}
                    aria-readonly="true"
                  />
                </p>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <div className="flex justify-end mt-10">
                <Button
                  className="bg-blue hover:bg-blue cursor-pointer"
                  onClick={() => {
                    setOpen(false)
                  }}
                >
                  Save
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )
      }
    </div >
  )
}

export default Settings