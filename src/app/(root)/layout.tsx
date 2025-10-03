"use client";

import Bottombar from "@/components/Bottombar";
import Header from "@/components/Header";
import LeftSidebar from "@/components/LeftSidebar";
import useCurrentUserStore from "@/stores/useCurrentUserStore";
import { useQuery } from "convex/react";
import { useEffect } from "react";
import { api } from "../../../convex/_generated/api";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { setCurrentUser } = useCurrentUserStore()
  const currentUser = useQuery(api.user.getForCurrentUser);

  useEffect(() => {
    if (currentUser) {
      setCurrentUser(currentUser!);
    }
  }, [currentUser, setCurrentUser]);

  return (
    <main className="max-w-screen-2xl mx-auto h-screen overflow-hidden flex">
      <Header />
      <LeftSidebar />
      <section className="flex-1 overflow-y-auto pt-[70px]">
        {children}
      </section>
      <Bottombar />
    </main>
  );
}