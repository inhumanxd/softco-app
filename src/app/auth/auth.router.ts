import { Router } from "express";
import { AuthController } from "./auth.controller";
import { wrap } from "@/common/middleware/errorHandler";
import { AuthMiddleware } from "@/common/middleware/authMiddleware";
import { zodValidateUserLoginData } from "@/models/zod/user.model.zod";

const authRouter = Router();

authRouter.post(`/login`, zodValidateUserLoginData, wrap(AuthController.login));

authRouter.post(`/refresh-token`, wrap(AuthController.refreshToken));

authRouter.post(`/verify`, AuthMiddleware.auth, wrap(AuthController.auth));

export { authRouter };
