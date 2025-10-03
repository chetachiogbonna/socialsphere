"use client"

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import DeletePostAlert from "@/components/DeletePostAlert"
import Image from "next/image"
import { convertToReadableDateString } from "@/lib/utils"
import { Post } from "@/types"
import PostStats from "./PostStats"
import { Edit } from "lucide-react"
import useCurrentUserStore from "@/stores/useCurrentUserStore"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { forwardRef } from "react"
import RobotIcon from "./RobotIcon"

const PostCard = forwardRef<HTMLDivElement, {
  post: Post, currentViewingPost: Post
}
>(({ post, currentViewingPost }, ref) => {
  const router = useRouter();
  const { currentUser } = useCurrentUserStore();

  return (
    <Card ref={ref} data-post={JSON.stringify(post)} className="bg-[#0a0a0a] text-white border border-neutral-800 gap-3 post-card relative">
      <CardHeader className="flex justify-between items-center">
        <div className="flex flex-row items-center gap-3">
          <Image
            src={post.user.profileImage}
            alt={post.user.username}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />

          <div>
            <p className="font-semibold">{post.user?.username}</p>
            <p
              className="text-gray-600 text-xs"
            >
              {convertToReadableDateString(post._creationTime)}
              <span className="font-bold"> &bull; </span>
              <span className="capitalize">{post.location}</span>
            </p>
          </div>
        </div>

        <div className="flex">
          <div className="relative">
            {currentViewingPost?._id === post?._id && (
              <RobotIcon />
            )}
          </div>

          {currentUser?._id === post.ownerId &&
            (
              <div className="flex flex-row gap-2">
                <Edit
                  onClick={() => router.push(`/edit-post/${post._id}`)}
                  size={20}
                  color="#A23AF9"
                  className="cursor-pointer"
                />

                <DeletePostAlert postId={post._id} />
              </div>
            )}
        </div>
      </CardHeader>

      <CardTitle className="flex flex-col gap-2 pt-0">
        <hr className="border-light w-[98%] mx-auto" />

        <div className="px-4">
          <p className="text-sm">{post.title}</p>
        </div>
      </CardTitle>

      <CardContent className="px-4 h-[350px] relative">
        <Link href={`/post-details/${post._id}`} className="absolute inset-0" />
        <Image
          src={post.imageUrl}
          alt="Post Image"
          width={500}
          height={500}
          className="w-full h-full object-cover rounded-2xl"
        />
      </CardContent>

      <div>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 px-4">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-dark-2 text-white text-xs px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <PostStats post={post} showComment={true} />
    </Card>
  )
})

PostCard.displayName = "PostCard";

export default PostCard;