"use client";

import Postbox from "@/components/Postbox";
import { useQuery } from "convex/react";
import { Bookmark, Home } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import useCurrentUserStore from "@/stores/useCurrentUserStore";
import Link from "next/link";
import BookmarksSkeleton from "@/components/skeletons/BookmarksSkeleton";

function Bookmarks() {
  const { currentUser } = useCurrentUserStore();

  const userId = currentUser ? currentUser._id : undefined;

  const posts = useQuery(api.post.getUserSavedPosts, { userId });

  if (!posts) {
    return <BookmarksSkeleton />
  }

  return (
    <section className="pt-3 pb-20 max-w-5xl mx-auto px-4">
      <div className="flex justify-start mb-6">
        <h2 className="font-bold text-2xl md:text-3xl">Bookmarks</h2>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Bookmark className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No saved posts yet</h3>
          <p className="text-gray-500 text-center max-w-md mb-6">
            Start bookmarking posts you want to read later. They'll appear here.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue text-white rounded-lg font-medium transition-colors"
          >
            <Home className="w-4 h-4" />
            Browse Home
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {posts.map(post => <Postbox key={post._id} post={post} />)}
        </div>
      )}
    </section>
  );
}

export default Bookmarks;