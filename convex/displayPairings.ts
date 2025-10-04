import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new pairing (for QR code)
export const create = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const expiresAt = now + 10 * 60 * 1000; // Expires in 10 minutes

    const pairingId = await ctx.db.insert("displayPairings", {
      status: "pending",
      createdAt: now,
      expiresAt,
    });

    return pairingId;
  },
});

// Get a pairing by ID (for both QR display and setup page)
export const get = query({
  args: { pairingId: v.id("displayPairings") },
  handler: async (ctx, args) => {
    const pairing = await ctx.db.get(args.pairingId);

    if (!pairing) {
      return null;
    }

    // Check if expired (return expired status without modifying DB)
    if (pairing.expiresAt < Date.now() && pairing.status === "pending") {
      return { ...pairing, status: "expired" as const };
    }

    return pairing;
  },
});

// Set the display ID for a pairing (from phone setup)
export const setDisplay = mutation({
  args: {
    pairingId: v.id("displayPairings"),
    displayId: v.id("displays"),
  },
  handler: async (ctx, args) => {
    const pairing = await ctx.db.get(args.pairingId);

    if (!pairing) {
      throw new Error("Pairing not found");
    }

    if (pairing.status !== "pending") {
      throw new Error("Pairing is no longer active");
    }

    if (pairing.expiresAt < Date.now()) {
      throw new Error("Pairing has expired");
    }

    await ctx.db.patch(args.pairingId, {
      displayId: args.displayId,
      status: "completed",
    });

    return { success: true };
  },
});
