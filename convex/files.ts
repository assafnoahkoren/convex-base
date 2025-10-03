import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Generate upload URL for image
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Generate upload URL - file will be stored in Convex storage
    return await ctx.storage.generateUploadUrl();
  },
});

// Save file metadata after upload with organization association
export const saveFile = mutation({
  args: {
    storageId: v.id("_storage"),
    boardId: v.id("boards"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get the board to verify organization access
    const board = await ctx.db.get(args.boardId);
    if (!board) {
      throw new Error("Board not found");
    }

    // Verify user has access to the organization
    const membership = await ctx.db
      .query("organizationMembers")
      .withIndex("by_organization_and_user", (q) =>
        q.eq("organizationId", board.organizationId).eq("userId", userId)
      )
      .first();

    if (!membership) {
      throw new Error("Access denied");
    }

    // Store file metadata with organization association
    const fileId = await ctx.db.insert("files", {
      storageId: args.storageId,
      organizationId: board.organizationId,
      boardId: args.boardId,
      uploadedBy: userId,
      uploadedAt: Date.now(),
    });

    return fileId;
  },
});

// Get file URL with authorization check
export const getUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Find the file metadata
    const file = await ctx.db
      .query("files")
      .withIndex("by_storage", (q) => q.eq("storageId", args.storageId))
      .first();

    if (!file) {
      throw new Error("File not found");
    }

    // Verify user has access to the organization
    const membership = await ctx.db
      .query("organizationMembers")
      .withIndex("by_organization_and_user", (q) =>
        q.eq("organizationId", file.organizationId).eq("userId", userId)
      )
      .first();

    if (!membership) {
      throw new Error("Access denied to this file");
    }

    // Return the file URL - this is a temporary signed URL
    return await ctx.storage.getUrl(args.storageId);
  },
});

// Delete file
export const deleteFile = mutation({
  args: { fileId: v.id("files") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const file = await ctx.db.get(args.fileId);
    if (!file) {
      throw new Error("File not found");
    }

    // Verify user has admin/owner access to the organization
    const membership = await ctx.db
      .query("organizationMembers")
      .withIndex("by_organization_and_user", (q) =>
        q.eq("organizationId", file.organizationId).eq("userId", userId)
      )
      .first();

    if (!membership) {
      throw new Error("Access denied");
    }

    if (membership.role !== "admin" && membership.role !== "owner") {
      throw new Error("Permission denied: Only admins and owners can delete files");
    }

    // Delete from storage
    await ctx.storage.delete(file.storageId);

    // Delete metadata
    await ctx.db.delete(args.fileId);
  },
});
