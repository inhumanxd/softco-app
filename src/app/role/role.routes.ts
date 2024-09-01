import express from "express";

import { wrap } from "@/common/middleware/errorHandler";
import { roleController } from "./role.controller";
import { AuthMiddleware } from "@/common/middleware/authMiddleware";
import { checkAccess } from "@/common/middleware/accessMiddleware";
import {
  zodValidateRoleCreateData,
  zodValidateRolePartiallyUpdateData,
  zodValidateRoleUpdateData,
} from "@/models/zod/role.model.zod";

export const roleRouter = express.Router();

roleRouter.get("/", AuthMiddleware.auth, checkAccess, wrap(roleController.getRoles));

roleRouter.get("/:id", AuthMiddleware.auth, checkAccess, wrap(roleController.getRole));

// When running for the first time with database, AuthMiddleware.auth,  checkAccess should be commented
// Or uncomment these and create admin role
roleRouter.post("/", AuthMiddleware.auth, checkAccess, zodValidateRoleCreateData, wrap(roleController.createRole));

roleRouter.put("/:id", AuthMiddleware.auth, checkAccess, zodValidateRoleUpdateData, wrap(roleController.updateRole));
roleRouter.patch(
  "/:id",
  AuthMiddleware.auth,
  checkAccess,
  zodValidateRolePartiallyUpdateData,
  wrap(roleController.updateRolePartially)
);
