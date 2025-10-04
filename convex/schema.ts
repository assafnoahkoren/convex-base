import { defineSchema } from "convex/server";
import { authModels } from "./models/auth";
import { organizationModels } from "./models/organization";
import { boardModels } from "./models/board";
import { displayPairingModels } from "./models/displayPairing";

export default defineSchema({
  ...authModels,
  ...organizationModels,
  ...boardModels,
  ...displayPairingModels,
});
