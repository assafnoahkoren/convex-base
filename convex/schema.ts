import { defineSchema } from "convex/server";
import { authModels } from "./models/auth";
import { organizationModels } from "./models/organization";

export default defineSchema({
  ...authModels,
  ...organizationModels,
});
