import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// List all displays for the current organization
export const list = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const membership = await ctx.db
      .query("organizationMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!membership) return [];

    const displays = await ctx.db
      .query("displays")
      .withIndex("by_organization", (q) => q.eq("organizationId", membership.organizationId))
      .collect();

    return displays;
  },
});

// Get a single display (public access for display screens)
export const get = query({
  args: { displayId: v.id("displays") },
  handler: async (ctx, { displayId }) => {
    const display = await ctx.db.get(displayId);
    return display || null;
  },
});

// Create a new display
export const create = mutation({
  args: {
    name: v.string(),
    location: v.optional(v.string()),
    currentBoardId: v.optional(v.id("boards")),
  },
  handler: async (ctx, { name, location, currentBoardId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const membership = await ctx.db
      .query("organizationMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!membership) throw new Error("User not in an organization");

    const displayId = await ctx.db.insert("displays", {
      organizationId: membership.organizationId,
      name,
      location,
      currentBoardId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return displayId;
  },
});

// Update a display
export const update = mutation({
  args: {
    displayId: v.id("displays"),
    name: v.optional(v.string()),
    location: v.optional(v.string()),
    currentBoardId: v.optional(v.id("boards")),
  },
  handler: async (ctx, { displayId, ...updates }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const display = await ctx.db.get(displayId);
    if (!display) throw new Error("Display not found");

    const membership = await ctx.db
      .query("organizationMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!membership || membership.organizationId !== display.organizationId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(displayId, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Delete a display
export const remove = mutation({
  args: { displayId: v.id("displays") },
  handler: async (ctx, { displayId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const display = await ctx.db.get(displayId);
    if (!display) throw new Error("Display not found");

    const membership = await ctx.db
      .query("organizationMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!membership || membership.organizationId !== display.organizationId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(displayId);
  },
});
