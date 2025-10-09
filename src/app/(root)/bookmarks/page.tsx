"use client";

import Postbox from "@/components/Postbox"
import useCurrentUserStore from "@/stores/useCurrentUserStore";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Loader from "@/components/Loader";
import { Link } from "lucide-react";
import { Button } from "@/components/ui/button";

function Bookmarks() {
  const { currentUser } = useCurrentUserStore();

  const userId = currentUser ? currentUser._id : undefined;

  const posts = useQuery(api.post.getUserSavedPosts, { userId });

  if (!posts) {
    return <Loader className="mx-auto" />
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-[80vh]">
        <h1 className="text-2xl">You havn&apos;t saved any post</h1>
        <p className="text-sm text-light">Save one now.</p>
        <Button asChild className="bg-blue hover:bg-blue">
          <Link href="/" className="mt-4">
            Browse Home
          </Link>
        </Button>
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