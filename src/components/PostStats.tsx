"use client";

import React, { useEffect, useState } from 'react'
import { CardFooter } from './ui/card'
import { Bookmark, Heart, MessageCircle } from 'lucide-react'
import CommentSection from './CommentSection'
import { Post } from '@/types'
import { includesId } from '@/lib/utils'
import useCurrentUserStore from '@/stores/useCurrentUserStore'
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { toast } from 'sonner';

function PostStats({ post, showComment }: { post: Post, showComment: boolean }) {
  const { currentUser } = useCurrentUserStore();

  const [likes, setLikes] = useState(post.likes);
  const [saves, setSaves] = useState(post.saves)

  useEffect(() => {
    setLikes(post.likes);
    setSaves(post.saves);
  }, [post.likes, post.saves])

  const toggleLikeMutation = useMutation(api.post.toggleLike);
  const toggleSaveMutation = useMutation(api.post.toggleSave);

  const likePost = (userId: Id<"users">) => {
    const alreadyLiked = likes.includes(userId);

    let updatedLikes;
    if (alreadyLiked) {
      updatedLikes = likes.filter((u) => u !== userId);
    } else {
      updatedLikes = [...likes, userId];
    }

    setLikes(updatedLikes);
    toggleLikeMutation({ postId: post._id, userId });
  }

  const savePost = (userId: Id<"users">) => {
    const alreadySaved = saves.includes(userId);

    let updatedSaves;
    if (alreadySaved) {
      updatedSaves = saves.filter((u) => u !== userId);
    } else {
      updatedSaves = [...saves, userId];
    }

    setSaves(updatedSaves);
    toggleSaveMutation({ postId: post._id, userId });
  }

  if (!currentUser) return null;

  return (
    <CardFooter className="flex flex-col gap-3 px-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4 [&>div]:flex [&>div]:items-center [&>div]:justify-center [&>div]:gap-1">
          <div
            className="flex items-center gap-1"
            onClick={() => likePost(currentUser._id)}
          >
            {includesId(likes, currentUser._id)
              ? <Heart color="#A23AF9" className="w-6 h-6 cursor-pointer fill-[#A23AF9]" />
              : <Heart color="#A23AF9" className="w-6 h-6 cursor-pointer" />
            }
            <p className="font-serif">{likes.length}</p>
          </div>
          <div>
            {includesId(saves, "userId")
              ? <MessageCircle color="#A23AF9" className="w-6 h-6 cursor-pointer fill-[#A23AF9]" />
              : <MessageCircle color="#A23AF9" className="w-6 h-6 cursor-pointer" />
            }
            <p className="font-serif">{post.comments.length}</p>
          </div>
        </div>

        <div
          className="flex items-center gap-1"
          onClick={() => savePost(currentUser._id)}
        >
          {includesId(saves, currentUser._id)
            ? <Bookmark color="#A23AF9" className="w-6 h-6 cursor-pointer fill-[#A23AF9]" />
            : <Bookmark color="#A23AF9" className="w-6 h-6 cursor-pointer" />
          }
          <p className="font-serif">{saves.length}</p>
        </div>
      </div >

      {showComment && <CommentSection post={post} />}
    </CardFooter >
  )
}

export default PostStats