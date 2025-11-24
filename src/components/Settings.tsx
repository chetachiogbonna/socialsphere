"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { useAIAction } from '@/context/AIAction';

interface SettingsProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

function Settings({ open, setOpen }: SettingsProps) {
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

export default Settings