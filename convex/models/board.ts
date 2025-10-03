import { defineTable } from "convex/server";
import { v } from "convex/values";

export const boardModels = {
  boards: defineTable({
    organizationId: v.id("organizations"),
    name: v.string(),
    description: v.optional(v.string()),
    content: v.object({
      gridConfig: v.object({
        columns: v.number(),
        rows: v.number(),
        rowHeight: v.number(),
      }),
      components: v.array(
        v.object({
          id: v.string(),
          type: v.union(v.literal("header"), v.literal("text"), v.literal("image")),
          position: v.object({
            x: v.number(),
            y: v.number(),
            w: v.number(),
            h: v.number(),
          }),
          config: v.any(), // Component-specific config (text, fontSize, color, etc.)
        })
      ),
    }),
    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_organization_and_created", ["organizationId", "createdAt"]),

  boardVersions: defineTable({
    boardId: v.id("boards"),
    content: v.any(), // Snapshot of board.content
    createdBy: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_board", ["boardId"])
    .index("by_board_and_created", ["boardId", "createdAt"]),

  displays: defineTable({
    organizationId: v.id("organizations"),
    name: v.string(),
    location: v.optional(v.string()),
    currentBoardId: v.optional(v.id("boards")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_board", ["currentBoardId"]),
};
