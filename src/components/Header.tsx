"use client";

import Logo from "./Logo";
import { SignOutButton, UserButton } from "@clerk/nextjs";
import useAIAction from "@/hooks/useAIAction";
import { motion, AnimatePresence } from "framer-motion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import useCurrentUserStore from "@/stores/useCurrentUserStore";
import Link from "next/link";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";

function Header() {
  const { transcript, listening } = useAIAction();
  const { currentUser } = useCurrentUserStore()
  const [wantToLogOut, setWantToLogOut] = useState(false)

  const mode = typeof window !== "undefined"
    ? (() => { try { return JSON.parse(window?.localStorage?.getItem("lazy-mode") ?? "true"); } catch { return true; } })()
    : true;

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
              <DropdownMenuContent className="z-[200] bg-[#404040] border-[#3B3C3C] text-[#E9E9E9]">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[#262626]" />
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer"
                >
                  <Link href={`/profile/${currentUser?._id}`}>
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  Settings
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
        {(mode ? transcript : listening) && (
          <div className="fixed inset-0 z-[1000] bg-[rgba(0,0,0,0.5)]">
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              className="fixed bottom-12 md:bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md"
            >
              <div
                className=" w-full rounded-2xl border border-transparent  bg-white/10 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.3)] px-5 py-3 text-base font-medium text-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-300 ease-in-out min-h-[70px] flex items-center"
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
              </div>
            </motion.div>

          </div>
        )}
      </AnimatePresence>

      {wantToLogOut && (
        <AlertDialog open={wantToLogOut}>
          <AlertDialogContent className="bg-dark-3">
            <AlertDialogHeader>
              <AlertDialogTitle>Please log me out now.</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                className="bg-dark-2"
                onClick={() => setWantToLogOut(false)}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-blue hover:bg-blue"
                asChild
              >
                <SignOutButton />
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}

export default Header;