"use client";

import { Settings as LucideSettings } from 'lucide-react';
import { useEffect, useState } from "react";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

function Settings() {
  const [open, setOpen] = useState(false)
  const [lazyMode, setLazyMode] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try { return JSON.parse(localStorage.getItem("lazy-mode") ?? "false"); } catch { return false; }
  })
  const [autoCreatePost, setAutoCreatePost] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try { return JSON.parse(localStorage.getItem("auto-create-post") ?? "false"); } catch { return false; }
  })
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
          <DialogContent showCloseButton={true}>
            <DialogHeader>
              <DialogTitle>Choose your preferences</DialogTitle>
              <DialogDescription>
                <p className="text-gray-300 flex justify-between items-center mb-3">
                  Lazy Mode
                  <Switch
                    className="bg-black"
                    checked={lazyMode}
                    onCheckedChange={() => setLazyMode(prev => !prev)}
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
                </p>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default Settings