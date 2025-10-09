"use client";

import Logo from "./Logo";
import { UserButton } from "@clerk/nextjs";
import useAIAction from "@/hooks/useAIAction";
import { motion, AnimatePresence } from "framer-motion";
import RobotIcon from "./RobotIcon";
import { usePathname } from "next/navigation";

function Header() {
  const pathname = usePathname()
  const { transcript, listening } = useAIAction();

  const mode = typeof window !== "undefined" && JSON.parse(window?.localStorage?.getItem("lazy-mode") ?? "true")

  return (
    <>
      <header className="bg-[#1A1A1A] z-10000 h-[60px] mb-4 fixed top-0 right-0 left-0 shadow-md">
        <div className="max-w-screen-2xl mx-auto flex justify-between items-center px-4">
          <Logo />

          <div className="flex items-center gap-3">
            <UserButton />
          </div>
        </div>
      </header>

      {/* Floating transcript textarea */}
      <AnimatePresence>
        {(mode ? transcript : listening) && (
          <div className="fixed inset-0 z-1000 bg-[rgba(0,0,0,0.5)]">
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md"
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

      {pathname !== "/" && <RobotIcon />}
    </>
  );
}

export default Header;