import { defineTable } from "convex/server";
import { v } from "convex/values";

export const organizationModels = {
  organizations: defineTable({
    name: v.string(),
    createdAt: v.number(),
  }),

  organizationMembers: defineTable({
    organizationId: v.id("organizations"),
    userId: v.id("users"),
    role: v.union(
      v.literal("owner"),
      v.literal("admin"),
      v.literal("member")
    ),
    joinedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_user", ["userId"])
    .index("by_organization_and_user", ["organizationId", "userId"]),
};
