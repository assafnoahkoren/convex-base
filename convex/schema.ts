import { defineSchema } from "convex/server";
import { authModels } from "./models/auth";
import { organizationModels } from "./models/organization";
import { boardModels } from "./models/board";

export default defineSchema({
  ...authModels,
  ...organizationModels,
  ...boardModels,
});
