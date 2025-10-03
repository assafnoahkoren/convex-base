import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get all boards for current organization
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get user's current organization
    const membership = await ctx.db
      .query("organizationMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!membership) {
      return [];
    }

    // Get all boards for the organization
    const boards = await ctx.db
      .query("boards")
      .withIndex("by_organization", (q) => q.eq("organizationId", membership.organizationId))
      .order("desc")
      .collect();

    return boards;
  },
});

// Get single board by ID
export const get = query({
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

    return board;
  },
});

// Get board assigned to a display
export const getForDisplay = query({
  args: { displayId: v.id("displays") },
  handler: async (ctx, args) => {
    const display = await ctx.db.get(args.displayId);
    if (!display) {
      throw new Error("Display not found");
    }

    if (!display.currentBoardId) {
      return null;
    }

    const board = await ctx.db.get(display.currentBoardId);
    return board;
  },
});

// Create new board with default content
export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get user's current organization
    const membership = await ctx.db
      .query("organizationMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!membership) {
      throw new Error("No organization found");
    }

    // Check if user is admin or owner
    if (membership.role !== "admin" && membership.role !== "owner") {
      throw new Error("Permission denied: Only admins and owners can create boards");
    }

    // Create board with default empty grid
    const boardId = await ctx.db.insert("boards", {
      organizationId: membership.organizationId,
      name: args.name,
      description: args.description,
      content: {
        gridConfig: {
          columns: 12,
          rows: 8,
          rowHeight: 100,
        },
        backgroundColor: '#ffffff',
        components: [],
      },
      createdBy: userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return boardId;
  },
});

// Update board content
export const update = mutation({
  args: {
    boardId: v.id("boards"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    content: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const board = await ctx.db.get(args.boardId);
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
      throw new Error("Permission denied: Only admins and owners can edit boards");
    }

    // Create version snapshot before updating (if content is being changed)
    if (args.content !== undefined) {
      await ctx.db.insert("boardVersions", {
        boardId: args.boardId,
        content: board.content,
        createdBy: userId,
        createdAt: Date.now(),
      });
    }

    // Update board
    await ctx.db.patch(args.boardId, {
      ...(args.name !== undefined && { name: args.name }),
      ...(args.description !== undefined && { description: args.description }),
      ...(args.content !== undefined && { content: args.content }),
      updatedAt: Date.now(),
    });

    return args.boardId;
  },
});

// Delete board
export const deleteBoard = mutation({
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
      throw new Error("Permission denied: Only admins and owners can delete boards");
    }

    // Check if any displays are using this board
    const displaysUsingBoard = await ctx.db
      .query("displays")
      .withIndex("by_board", (q) => q.eq("currentBoardId", args.boardId))
      .first();

    if (displaysUsingBoard) {
      throw new Error("Cannot delete board: It is currently assigned to a display");
    }

    // Delete board
    await ctx.db.delete(args.boardId);
  },
});

// Duplicate board
export const duplicate = mutation({
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
      throw new Error("Permission denied: Only admins and owners can duplicate boards");
    }

    // Create duplicate
    const newBoardId = await ctx.db.insert("boards", {
      organizationId: board.organizationId,
      name: `${board.name} (Copy)`,
      description: board.description,
      content: board.content,
      createdBy: userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return newBoardId;
  },
});

// Add sample components to board (for testing)
export const addSampleComponents = mutation({
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
      throw new Error("Permission denied");
    }

    // Add sample components
    await ctx.db.patch(args.boardId, {
      content: {
        gridConfig: board.content.gridConfig,
        components: [
          {
            id: "header-1",
            type: "header" as const,
            position: { x: 0, y: 0, w: 12, h: 1 },
            config: {
              text: "Welcome to Our Office",
              fontSize: "32px",
              color: "#1a1a1a",
              alignment: "center",
            },
          },
          {
            id: "text-1",
            type: "text" as const,
            position: { x: 0, y: 1, w: 6, h: 2 },
            config: {
              content: "Today's announcements and updates will be displayed here.",
              fontSize: "18px",
              color: "#333333",
              alignment: "left",
            },
          },
          {
            id: "image-1",
            type: "image" as const,
            position: { x: 6, y: 1, w: 6, h: 2 },
            config: {
              imageUrl: "https://via.placeholder.com/600x400/4f46e5/ffffff?text=Company+Logo",
              alt: "Company Logo",
              fit: "contain",
            },
          },
        ],
      },
      updatedAt: Date.now(),
    });

    return args.boardId;
  },
});
