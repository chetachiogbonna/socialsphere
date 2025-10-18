import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getForCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return;
    }

    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .first();
  },
})

export const createUser = mutation({
  args: {
    clerk_userId: v.string(),
    first_name: v.string(),
    last_name: v.string(),
    username: v.string(),
    email: v.string(),
    profile_pic: v.string()
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("users", {
      clerk_userId: args.clerk_userId,
      first_name: args.first_name,
      last_name: args.last_name,
      username: args.username,
      email: args.email,
      profile_pic: args.profile_pic,
      cover_photo: "",
      bio: "",
      followers: [],
      following: []
    });
  },
});

export const updateUser = mutation({
  args: {
    clerk_userId: v.string(),
    first_name: v.string(),
    last_name: v.string(),
    username: v.string(),
    email: v.string(),
    profile_pic: v.string()
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.query("users").withIndex("byClerkId", q => q.eq("clerk_userId", args.clerk_userId)).first()

    if (!user) {
      throw new Error("User not found");
    }

    return ctx.db.patch(user._id, {
      first_name: args.first_name,
      last_name: args.last_name,
      username: args.username,
      email: args.email,
      profile_pic: args.profile_pic
    });
  }
});

export const deleteUser = mutation({
  args: {
    clerk_userId: v.string()
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.query("users").withIndex("byClerkId", q => q.eq("clerk_userId", args.clerk_userId)).first();

    if (!user) {
      throw new Error("User not found");
    }

    return ctx.db.delete(user._id);
  }
});

export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    const allUsers = await ctx.db.query("users").collect()
    return allUsers;
  }
})

export const getUserById = query({
  args: {
    userId: v.id("users")
  },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId)
    return user;
  }
})

// export const toggleFollow = mutation({
//   args: {
//     postId: v.id("posts"),
//     userId: v.id("users"),
//   },
//   handler: async (ctx, args) => {
//     const { postId, userId } = args;
//     if (!postId || !userId) throw new Error("Not authenticated");

//     const post = await ctx.db.get(args.postId);
//     if (!post) throw new Error("Post not found");

//     const alreadyLiked = post.likes.includes(userId);

//     let updatedLikes;
//     if (alreadyLiked) {
//       updatedLikes = post.likes.filter((u) => u !== userId);
//     } else {
//       updatedLikes = [...post.likes, userId];
//     }

//     await ctx.db.patch(args.postId, { likes: updatedLikes });
//   }
// })