import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("messages")
      .order("asc")
      .take(100);
  },
});

export const send = mutation({
  args: {
    content: v.string(),
    author: v.string(),
  },
  handler: async (ctx, args) => {
    const { content, author } = args;
    
    await ctx.db.insert("messages", {
      content,
      author,
      createdAt: Date.now(),
    });
  },
}); 