"use client";

import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import PostCard from '@/components/PostCard';
import { useEffect, useRef } from 'react';
import { Post } from '@/types';
import usePostStore from '@/stores/usePostStore';

export default function Home() {
  const posts = useQuery(api.post.getAllPosts)

  const { currentViewingPost, setCurrentViewingPost } = usePostStore()
  const postRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(et => {
        if (et.isIntersecting) {
          const post = et.target.getAttribute("data-post");
          if (post) {
            const p = JSON.parse(post) as Post
            setCurrentViewingPost(p)
          }
        }
      })
    }, {
      threshold: 0.5
    })

    postRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      postRefs.current.forEach(ref => {
        if (ref) observer.unobserve(ref)
      })
    }
  }, [posts, setCurrentViewingPost])

  return (
    <section className="flex justify-center items-center pb-20">
      <div className="flex flex-col gap-10 w-[500px]">
        {posts?.map((post, i) => {
          return (
            <PostCard
              ref={(el) => {
                postRefs.current[i] = el!;
              }}
              key={post._id}
              post={post}
              currentViewingPost={currentViewingPost!}
            />
          )
        })}
      </div>
    </section>
  );
}
