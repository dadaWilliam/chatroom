import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

// Get the most recent messages (latest first)
export const get = query({
  handler: async (ctx) => {
    // Get the most recent 25 messages, sorted by newest first
    return await ctx.db
      .query("messages")
      .withIndex("byCreatedAt")
      .order("desc") // This orders messages newest to oldest
      .take(1);
  },
});

// Paginated query to get older messages
export const getPaginated = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    // Paginate through messages in reverse chronological order
    return await ctx.db
      .query("messages")
      .withIndex("byCreatedAt")
      .order("desc") // This orders messages newest to oldest
      .paginate(args.paginationOpts);
  },
});

// Send a message to the chat
export const send = mutation({
  args: {
    content: v.string(),
    author: v.string(),
  },
  handler: async (ctx, args) => {
    // Insert the message with the current timestamp
    return await ctx.db.insert("messages", {
      content: args.content,
      author: args.author,
      createdAt: Date.now(),
    });
  },
});