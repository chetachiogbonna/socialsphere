"use client";

import { useState } from "react";
import { LucideSendHorizontal } from "lucide-react";
import { Input } from "./ui/input";
import Image from "next/image";
import { Post } from "@/types";
import useCurrentUserStore from "@/stores/useCurrentUserStore";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

function CommentSection({ post }: { post: Post }) {
  const pathname = usePathname()

  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser } = useCurrentUserStore();

  const handleComment = useMutation(api.post.comment)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) return toast.error("No session found.")

    try {
      handleComment({
        comment: {
          userId: currentUser?._id,
          text: comment
        },
        postId: post._id
      })
      toast.success("Comment added successfully");
      setComment("");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to add comment",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto p-2 border border-neutral-800 rounded-lg">
        {post.comments && post.comments.length > 0 ? (
          pathname === "/"
            ? (
              <div
                className="flex items-start gap-2 justify-end"
              >
                <div
                  className="px-3 py-2 rounded-lg max-w-[70%] text-sm bg-neutral-800 text-gray-200 rounded-bl-none"
                >
                  {post.comments.at(-1)?.text}
                </div>

                <Image
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                  src={"/assets/images/profile-placeholder.jpg"}
                  alt="profile"
                />
              </div>
            ) : post.comments.map((c, i) => {
              return (
                <div
                  key={i}
                  className="flex items-start gap-2 justify-end"
                >
                  <div
                    className="px-3 py-2 rounded-lg max-w-[70%] text-sm bg-neutral-800 text-gray-200 rounded-bl-none"
                  >
                    {c.text}
                  </div>

                  <Image
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                    src={"/assets/images/profile-placeholder.jpg"}
                    alt="profile"
                  />
                </div>
              );
            })
        ) : (
          <p className="text-center text-sm text-gray-500">
            No comments yet — be the first to comment!
          </p>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full flex items-center gap-3 border-t border-neutral-800 pt-3"
      >
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <Image
            width={40}
            height={40}
            className="rounded-full object-cover bg-neutral-900"
            src={"/assets/images/profile-placeholder.jpg"}
            alt="profile pic"
          />
        </div>

        <div className="flex items-center flex-1 border border-neutral-700 rounded-lg bg-neutral-900">
          <Input
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="h-9 bg-transparent border-none text-sm focus-visible:ring-0 focus-visible:ring-offset-0 placeholder-gray-500"
            placeholder="Write a comment..."
            type="text"
          />
          <button
            type="submit"
            disabled={loading}
            className="p-2 hover:opacity-80 disabled:opacity-50"
          >
            {loading && "ok..."}
            <LucideSendHorizontal size={20} color="#9CA3AF" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default CommentSection;