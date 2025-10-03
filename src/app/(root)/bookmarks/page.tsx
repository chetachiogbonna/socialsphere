"use client";

import Postbox from "@/components/Postbox"
import useCurrentUserStore from "@/stores/useCurrentUserStore";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

function Bookmarks() {
  const { currentUser } = useCurrentUserStore();

  const userId = currentUser ? currentUser._id : undefined;

  const posts = useQuery(api.post.getUserSavedPosts, { userId });

  if (!posts) {
    return (
      <div>
        Not Found
      </div>
    )
  }

  return (
    <>
      <h1 className="px-2 pb-8">Bookmarks</h1>

      <section className="flex justify-center items-center pb-20 px-2">
        <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full mx-auto">
          {posts?.map(post => <Postbox key={post._id} post={post} />)}
        </div>
      </section>
    </>
  )
}

export default Bookmarks