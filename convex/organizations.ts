import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getUserOrganizations = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const memberships = await ctx.db
      .query("organizationMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const organizations = await Promise.all(
      memberships.map(async (membership) => {
        const org = await ctx.db.get(membership.organizationId);
        return org ? { ...org, role: membership.role } : null;
      })
    );

    return organizations.filter((org) => org !== null);
  },
});

export const createOrganization = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const organizationId = await ctx.db.insert("organizations", {
      name: args.name,
      createdAt: Date.now(),
    });

    await ctx.db.insert("organizationMembers", {
      organizationId,
      userId,
      role: "owner",
      joinedAt: Date.now(),
    });

    return organizationId;
  },
});
