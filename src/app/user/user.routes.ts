import express from "express";

import { wrap } from "@/common/middleware/errorHandler";
import { userController } from "./user.controller";
import { AuthMiddleware } from "@/common/middleware/authMiddleware";
import { checkAccess } from "@/common/middleware/accessMiddleware";
import {
  zodValidateUserCreateData,
  zodValidateUsersBulkUpdateData,
  zodValidateUsersUpdateData,
} from "@/models/zod/user.model.zod";

export const userRouter = express.Router();

userRouter.get("/", AuthMiddleware.auth, checkAccess, wrap(userController.getUsers));

// users/q123/hasAccessTo?module=users
userRouter.get("/:id/hasAccessTo", AuthMiddleware.auth, AuthMiddleware.isAdmin, wrap(userController.checkUserAccess));
userRouter.get("/:id", AuthMiddleware.auth, AuthMiddleware.isAdmin, wrap(userController.getUser));

userRouter.post("/", zodValidateUserCreateData, wrap(userController.createUser));

userRouter.put(
  "/",
  AuthMiddleware.auth,
  AuthMiddleware.isAdmin,
  zodValidateUsersUpdateData,
  wrap(userController.updateUsers)
);

userRouter.put(
  "/bulk",
  AuthMiddleware.auth,
  AuthMiddleware.isAdmin,
  zodValidateUsersBulkUpdateData,
  wrap(userController.updateUsersWithDifferentData)
);
