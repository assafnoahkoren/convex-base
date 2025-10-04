import { defineTable } from "convex/server";
import { v } from "convex/values";

export const displayPairingModels = {
  displayPairings: defineTable({
    displayId: v.optional(v.id("displays")),
    status: v.union(v.literal("pending"), v.literal("completed"), v.literal("expired")),
    createdAt: v.number(),
    expiresAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_created", ["createdAt"]),
};
