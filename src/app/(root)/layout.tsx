"use client";

import Bottombar from "@/components/Bottombar";
import Header from "@/components/Header";
import LeftSidebar from "@/components/LeftSidebar";
import useCurrentUserStore from "@/stores/useCurrentUserStore";
import { useQuery } from "convex/react";
import { useEffect } from "react";
import { api } from "../../../convex/_generated/api";
import OnboardingModal from "@/components/OnboardingModal";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { setCurrentUser } = useCurrentUserStore()
  const currentUser = useQuery(api.user.getForCurrentUser);

  useEffect(() => {
    if (currentUser) {
      console.log(currentUser._id)
      setCurrentUser({
        ...currentUser,
        profile_pic_id: currentUser.profile_pic_id || undefined,
        cover_photo: currentUser.cover_photo || undefined,
        cover_photo_id: currentUser.profile_pic_id || undefined,
        bio: currentUser.bio || undefined,
        followers: currentUser.followers || [],
        following: currentUser.following || []
      });
    }
  }, [currentUser, setCurrentUser]);

  if (currentUser && !currentUser.bio) {
    return (
      <OnboardingModal
        isOpen={true}
        user={{
          ...currentUser,
          profile_pic_id: currentUser.profile_pic_id || undefined,
          cover_photo: currentUser.cover_photo || undefined,
          cover_photo_id: currentUser.profile_pic_id || undefined,
          bio: currentUser.bio || undefined,
          followers: currentUser.followers || [],
          following: currentUser.following || []
        }}
      />
    )
  }

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