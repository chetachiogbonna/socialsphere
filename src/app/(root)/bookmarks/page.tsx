"use client";

import Postbox from "@/components/Postbox";
import { useQuery } from "convex/react";
import { Bookmark, Home } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import useCurrentUserStore from "@/stores/useCurrentUserStore";
import Loader from "@/components/Loader";
import Link from "next/link";

function Bookmarks() {
  const { currentUser } = useCurrentUserStore();

  const userId = currentUser ? currentUser._id : undefined;

  const posts = useQuery(api.post.getUserSavedPosts, { userId });

  if (!posts) {
    return <Loader className="mx-auto" />
  }

  if (posts.length === 0) {
    return (
      <section className="mx-auto space-y-4 w-[98%] md:w-[80%] lg:w-[60%] max-sm:last:mb-14 pb-20">
        <div id="scroll-title" className="scroll-m-10" />

        <div className="mb-6 flex gap-1 items-center">
          <Bookmark className="w-10 h-10 text-gray-700" />
          <h2 className="text-2xl font-medium">Bookmarks</h2>
        </div>

        <div className="flex flex-col justify-center items-center py-20 rounded-lg">
          <Bookmark className="w-16 h-16 text-gray-300 mb-4" />
          <h1 className="text-xl font-semibold mb-2">You haven&apos;t saved any post</h1>
          <p className="text-sm text-gray-500 mb-6">Save one now.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            <Home className="w-4 h-4" />
            Browse Home
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-3 pb-20 max-w-5xl mx-auto px-4">
      <div className="mb-6 flex gap-1 items-center">
        <Bookmark className="w-10 h-10 text-gray-700" />
        <h2 className="text-2xl font-medium">Bookmarks</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {posts?.map(post => <Postbox key={post._id} post={post} />)}
      </div>
    </section>
  );
}

export default Bookmarks;