"use client";

import Logo from "./Logo";
import { UserButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import useCurrentUserStore from "@/stores/useCurrentUserStore";
import Link from "next/link";
import { useState } from "react";
import { useAIAction } from "@/context/AIAction";
import { X } from "lucide-react";
import Settings from "./Settings";
import LogOutModal from "./LogOutModal";

function Header() {
  const { transcript, listening, lazyMode, resetTranscript, stopListening, startListening } = useAIAction();
  const { currentUser } = useCurrentUserStore()
  const [wantToLogOut, setWantToLogOut] = useState(false)
  const [openSettings, setOpenSettings] = useState(false)

  return (
    <>
      <header className="bg-[#1A1A1A] z-[100] h-[60px] mb-4 fixed top-0 right-0 left-0 shadow-md">
        <div className="max-w-screen-2xl mx-auto flex justify-between items-center px-4">
          <Logo />

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger className="mt-3">
                <UserButton />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="z-[2000] bg-[#404040] border-[#3B3C3C] text-[#E9E9E9]">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[#262626]" />
                {currentUser && (
                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer"
                  >
                    <Link href={`/profile/${currentUser?._id}`}>
                      Profile
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  className="cursor-pointer"
                  asChild
                >
                  <button
                    onClick={() => setOpenSettings(true)}
                    className="w-full"
                  >
                    Settings
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setWantToLogOut(true)}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {(lazyMode ? transcript : listening) && (
          <div className="fixed inset-0 z-[1000] bg-[rgba(0,0,0,0.5)]">
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              className="fixed bottom-12 md:bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md"
            >
              <div
                className=" w-full rounded-2xl border border-transparent  bg-white/10 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.3)] px-5 py-3 text-base font-medium text-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-300 ease-in-out min-h-[70px] flex justify-between items-center"
              >
                {transcript ? (
                  <p className="whitespace-pre-wrap">{transcript}</p>
                ) : (
                  <div className="flex gap-1 items-center">
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce" />
                    <span
                      className="w-2 h-2 bg-white rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <span
                      className="w-2 h-2 bg-white rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </div>
                )}

                <button
                  onClick={() => {
                    stopListening();
                    resetTranscript();
                    if (lazyMode) {
                      startListening();
                    }
                  }}
                  className="text-white hover:text-gray-300 ml-4"
                >
                  <X />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <LogOutModal wantToLogOut={wantToLogOut} setWantToLogOut={setWantToLogOut} />

      <Settings open={openSettings} setOpen={setOpenSettings} />
    </>
  );
}

export default Header;