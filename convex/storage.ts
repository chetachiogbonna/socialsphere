import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const getImageUrl = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const deleteById = mutation({
  args: {
    imageIds: v.array(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    try {
      for (const storageId of args.imageIds) {
        await ctx.storage.delete(storageId);
      }

      return null;
    } catch (err) {
      throw err;
    }
  },
});