import { Post } from "@/types";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createPost = mutation({
  args: {
    ownerId: v.id("users"),
    title: v.string(),
    imageUrl: v.string(),
    imageId: v.string(),
    location: v.string(),
    tags: v.array(v.string())
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("posts", {
      ownerId: args.ownerId,
      title: args.title,
      imageUrl: args.imageUrl,
      imageId: args.imageId,
      tags: args.tags,
      location: args.location,
      likes: [],
      comments: [],
      saves: []
    });
  }
})

export const updatePost = mutation({
  args: {
    postId: v.id("posts"),
    title: v.string(),
    imageId: v.id("_storage"),
    imageUrl: v.string(),
    location: v.string(),
    tags: v.array(v.string())
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.postId, {
      title: args.title,
      imageUrl: args.imageUrl,
      tags: args.tags,
      location: args.location,
      imageId: args.imageId
    });
  }
});

export const getAllPosts = query({
  handler: async (ctx) => {
    const posts = await ctx.db.query("posts").collect();

    const postsWithUser = await Promise.all(
      posts.map(async (post) => {
        const postOwner = await ctx.db.get(post.ownerId);

        return {
          ...post,
          user: {
            username: postOwner?.username!,
            profileImage: postOwner?.profile_pic!,
            clerkId: postOwner?.clerk_userId!
          }
        };
      })
    );

    return postsWithUser.reverse() as Post[];
  }
})

export const getPostById = query({
  args: {
    postId: v.id("posts")
  },
  handler: async (ctx, args) => {
    try {

      const post = await ctx.db.get(args.postId);
      if (!post) throw new Error;

      const postOwner = await ctx.db.get(post.ownerId);

      const postWithUser = {
        ...post,
        user: {
          username: postOwner?.username!,
          profileImage: postOwner?.profile_pic!,
          clerkId: postOwner?.clerk_userId!
        }
      }

      return postWithUser;
    } catch {
      return {} as Post
    }
  }
})

export const toggleLike = mutation({
  args: {
    postId: v.id("posts"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { postId, userId } = args;
    if (!postId || !userId) throw new Error("Not authenticated");

    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

    const alreadyLiked = post.likes.includes(userId);

    let updatedLikes;
    if (alreadyLiked) {
      updatedLikes = post.likes.filter((u) => u !== userId);
    } else {
      updatedLikes = [...post.likes, userId];
    }

    await ctx.db.patch(args.postId, { likes: updatedLikes });
  }
})

export const toggleSave = mutation({
  args: {
    postId: v.id("posts"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { postId, userId } = args;
    if (!postId || !userId) throw new Error("Not authenticated");

    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

    const alreadySaved = post.saves.includes(userId);

    let updatedSaves;
    if (alreadySaved) {
      updatedSaves = post.saves.filter((u) => u !== userId);
    } else {
      updatedSaves = [...post.saves, userId];
    }

    await ctx.db.patch(args.postId, { saves: updatedSaves });
  }
})

export const comment = mutation({
  args: {
    comment: v.object({
      userId: v.id("users"),
      text: v.string()
    }),
    postId: v.id("posts")
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    const existingComments = post?.comments ?? [];
    const updatedComments = [...existingComments, args.comment];
    await ctx.db.patch(args.postId, { comments: updatedComments });
  }
})

export const getUserSavedPosts = query({
  args: {
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, { userId }) => {
    if (!userId) return;

    const posts = await ctx.db.query("posts").collect();

    const postsWithUser: Post[] = [];

    for (const post of posts) {
      if (post.saves?.includes(userId)) {
        const postOwner = await ctx.db.get(post.ownerId);
        postsWithUser.push({
          ...post,
          user: {
            username: postOwner?.username!,
            profileImage: postOwner?.profile_pic!,
            clerkId: postOwner?.clerk_userId!
          }
        });
      }
    }

    return postsWithUser;
  },
});


export const deletePost = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.postId);
  }
})

export const search = query({
  args: {
    searchTerm: v.string(),
  },
  handler: async (ctx, args) => {
    const searchTerm = args.searchTerm.trim().toLowerCase();
    // Search posts
    const searchedPosts = await ctx.db.query("posts").withSearchIndex("byTitle", q => q.search("title", searchTerm)).collect();
    const searchedPostWithUsers: Post[] = [];

    for (const searchedPost of searchedPosts) {
      const user = await ctx.db.get(searchedPost.ownerId);
      if (user) {
        searchedPostWithUsers.push({
          ...searchedPost,
          user: {
            username: user.username,
            profileImage: user.profile_pic,
            clerkId: user.clerk_userId
          }
        });
      }
    }

    return searchedPostWithUsers
  },
})