"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { useAIAction } from '@/context/AIAction';

interface SettingsProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

function Settings({ open, setOpen }: SettingsProps) {
  const { lazyMode, setLazyMode, autoCreatePost, setAutoCreatePost, stopListening } = useAIAction()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={true}
        className="bg-dark/90 border border-gray-700 max-w-lg flex flex-col"
      >
        <DialogHeader>
          <DialogTitle>Choose your preferences</DialogTitle>
          <DialogDescription className="text-[13px]">
            Configure how you interact with the AI assistant. Lazy Mode enables continuous voice listening, while Auto-Create Post automatically publishes your posts.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex flex-col gap-6">
          <div className="text-gray-300 flex justify-between items-center">
            Lazy Mode
            <Switch
              className="bg-black"
              checked={lazyMode}
              onCheckedChange={() => {
                if (lazyMode) {
                  stopListening()
                }

                localStorage.setItem("lazy-mode", JSON.stringify(!lazyMode))
                setLazyMode(!lazyMode)
              }}
              aria-disabled="false"
            />
          </div>
          <div className="text-gray-300 flex justify-between items-center">
            Auto-Create Post
            <Switch
              className="bg-black"
              checked={autoCreatePost}
              onCheckedChange={() => {
                localStorage.setItem("auto-create-post", JSON.stringify(!autoCreatePost))
                setAutoCreatePost(!autoCreatePost)
              }}
              aria-readonly="true"
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  )
}

export default Settings