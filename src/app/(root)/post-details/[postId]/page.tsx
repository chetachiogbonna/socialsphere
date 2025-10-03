"use client";

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Edit, Trash } from "lucide-react"
import Image from "next/image"
import { useParams } from "next/navigation"
import useCurrentUserStore from "@/stores/useCurrentUserStore"
import { convertToReadableDateString } from "@/lib/utils"
import { api } from '../../../../../convex/_generated/api'
import { Id } from '../../../../../convex/_generated/dataModel'
import { useQuery } from "convex/react";
import PostStats from "@/components/PostStats";
import Link from "next/link";
import Loader from "@/components/Loader";

function PostDetails() {
  const { postId } = useParams();
  const { currentUser } = useCurrentUserStore()

  const post = useQuery(api.post.getPostById, {
    postId: postId as Id<"posts">,
  })

  if (!post) {
    return <Loader />
  }

  if (Object.entries(post).length < 0) {
    return <div>Post not found</div>
  }

  return (
    <section className="max-w-3xl mx-auto py-8 px-4">
      <Card className="bg-[#0a0a0a] text-white border border-neutral-800 rounded-2xl overflow-hidden shadow-md py-3 gap-2">
        {/* HEADER */}
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="flex flex-row items-center gap-3">
            <Avatar>
              <AvatarImage src={post.user.profileImage} alt={post.user.username} />
              <AvatarFallback>{post.user.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              <CardTitle className="text-sm font-semibold">{post.user?.username}</CardTitle>
              <CardDescription className="text-gray-500 text-xs">
                {convertToReadableDateString(post._creationTime)}
                <span className="font-bold"> • </span>
                <span className="capitalize">{post.location}</span>
              </CardDescription>
            </div>
          </div>

          {currentUser?._id === post.ownerId && (
            <div className="flex flex-row gap-2">
              <Link
                href={`/edit-post/${post._id}`}
              >
                <Edit color="#A23AF9" size={18} className="text-primary" />
              </Link>
              {/* <Button variant="ghost" size="icon"> */}
              <Trash size={18} className="text-red-500" />
              {/* </Button> */}
            </div>
          )}
        </CardHeader>

        <CardContent className="px-4">
          <Separator className="my-2 bg-neutral-800" />
          <p className="text-sm">{post.title}</p>
        </CardContent>

        <CardContent className="px-4 py-2">
          <div className="h-[400px] w-full relative">
            <Image
              src={post.imageUrl}
              alt="post image"
              fill
              className="object-cover rounded-2xl"
            />
          </div>
        </CardContent>

        {post.tags.length > 0 && (
          <CardContent className="flex flex-wrap gap-2 px-4 pb-2">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </CardContent>
        )}

        <CardContent className="px-4">
          <PostStats post={post} showComment={true} />
        </CardContent>
      </Card>
    </section>
  )
}

export default PostDetails