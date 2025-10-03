import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get all versions for a board
export const list = query({
  args: { boardId: v.id("boards") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const board = await ctx.db.get(args.boardId);
    if (!board) {
      throw new Error("Board not found");
    }

    // Verify user has access to this board's organization
    const membership = await ctx.db
      .query("organizationMembers")
      .withIndex("by_organization_and_user", (q) =>
        q.eq("organizationId", board.organizationId).eq("userId", userId)
      )
      .first();

    if (!membership) {
      throw new Error("Access denied");
    }

    // Get all versions for the board
    const versions = await ctx.db
      .query("boardVersions")
      .withIndex("by_board", (q) => q.eq("boardId", args.boardId))
      .order("desc")
      .collect();

    // Get creator info for each version
    const versionsWithCreator = await Promise.all(
      versions.map(async (version) => {
        const creator = await ctx.db.get(version.createdBy);
        return {
          ...version,
          creatorName: creator?.name || creator?.email || "Unknown",
        };
      })
    );

    return versionsWithCreator;
  },
});

// Get specific version content
export const get = query({
  args: { versionId: v.id("boardVersions") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const version = await ctx.db.get(args.versionId);
    if (!version) {
      throw new Error("Version not found");
    }

    const board = await ctx.db.get(version.boardId);
    if (!board) {
      throw new Error("Board not found");
    }

    // Verify user has access
    const membership = await ctx.db
      .query("organizationMembers")
      .withIndex("by_organization_and_user", (q) =>
        q.eq("organizationId", board.organizationId).eq("userId", userId)
      )
      .first();

    if (!membership) {
      throw new Error("Access denied");
    }

    return version;
  },
});

// Restore board to a previous version
export const restore = mutation({
  args: { versionId: v.id("boardVersions") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const version = await ctx.db.get(args.versionId);
    if (!version) {
      throw new Error("Version not found");
    }

    const board = await ctx.db.get(version.boardId);
    if (!board) {
      throw new Error("Board not found");
    }

    // Verify user has admin/owner access
    const membership = await ctx.db
      .query("organizationMembers")
      .withIndex("by_organization_and_user", (q) =>
        q.eq("organizationId", board.organizationId).eq("userId", userId)
      )
      .first();

    if (!membership) {
      throw new Error("Access denied");
    }

    if (membership.role !== "admin" && membership.role !== "owner") {
      throw new Error("Permission denied: Only admins and owners can restore boards");
    }

    // Create a snapshot of current state before restoring
    await ctx.db.insert("boardVersions", {
      boardId: version.boardId,
      content: board.content,
      createdBy: userId,
      createdAt: Date.now(),
    });

    // Restore the board to the version content
    await ctx.db.patch(version.boardId, {
      content: version.content,
      updatedAt: Date.now(),
    });

    return version.boardId;
  },
});
