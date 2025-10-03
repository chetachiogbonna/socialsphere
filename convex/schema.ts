import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerk_userId: v.string(),
    first_name: v.string(),
    last_name: v.string(),
    username: v.string(),
    email: v.string(),
    profile_pic: v.string(),
  }).index("byClerkId", ["clerk_userId"]),

  posts: defineTable({
    ownerId: v.id("users"),
    title: v.string(),
    imageUrl: v.string(),
    imageId: v.string(),
    location: v.string(),
    tags: v.array(v.string()),
    likes: v.array(v.id("users")),
    comments: v.array(v.object({
      userId: v.id("users"),
      text: v.string()
    })),
    saves: v.array(v.id("users")),
  }).searchIndex("byTitle", { searchField: "title" }),
});