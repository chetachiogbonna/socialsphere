import MessageLeftBar from "@/components/shared/MessageLeftBar";
import TopBar from "@/components/shared/TopBar"
import { changePageTitle } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

function MessageLayout() {
  const { pathname } = useLocation();
  const [startChatting, setStartChatting] = useState(false);

  useEffect(() => {
    setStartChatting(pathname === "/messages" ? false : true)

    changePageTitle(pathname)
  }, [pathname, startChatting])
  
  return (
    <>
      <TopBar />

      <section className="mt-[60px] flex max-w-screen-2xl mx-auto">
        <MessageLeftBar />

        {startChatting
          ? <Outlet />
          : (
            <div className="hidden flex-1 md:flex justify-center items-center">
              Select a friend to chat with.
            </div>
          )
        }
      </section>
    </>
  )
}

export default MessageLayout