import { JWTHelper } from "@/helpers/jwt.helper";
import { Request, Response, NextFunction } from "express";
import { CustomResponse } from "../models/CustomReponse";
import { StatusCodes } from "http-status-codes";
import { handleCustomResponse } from "../utils/httpHandler";
import { logger } from "../utils/logger";
import { userService } from "@/app/user/user.service";
import { IRole } from "@/interfaces/IRole";

export class AuthMiddleware {
  static async auth(req: Request, res: Response, next: NextFunction) {
    const authorizationToken = req.headers.authorization;
    const token = authorizationToken?.split(" ")?.[1];

    if (!token) {
      const response = CustomResponse.error("Unauthorized", null, StatusCodes.UNAUTHORIZED);
      return handleCustomResponse(response, res);
    }

    try {
      const decoded = JWTHelper.verifyAccessToken(token);

      if (!decoded) {
        const response = CustomResponse.error("Unauthorized", null, StatusCodes.UNAUTHORIZED);
        return handleCustomResponse(response, res);
      }

      if (decoded?.exp && decoded?.exp < Date.now().valueOf() / 1000) {
        const response = CustomResponse.error("Token Expired", null, StatusCodes.UNAUTHORIZED);
        return handleCustomResponse(response, res);
      }

      // Use JWT Token details to check access
      // res.locals.user = decoded;
      // res.locals.isAdmin = decoded.role === "admin";
      // res.locals.hasAccessTo = decoded.hasAccessTo;

      // Alternatively, fetch role and access details from database
      const user = await userService.findByEmail(decoded.email);

      if (!user) {
        throw new Error("User details not found!");
      }

      const { name, hasAccessTo } = user.role as IRole;
      res.locals.user = { ...user, role: name, hasAccessTo: hasAccessTo };
      res.locals.isAdmin = name === "admin";
      res.locals.hasAccessTo = hasAccessTo;

      logger.info(
        `User ${decoded._id} authenticated: ${decoded.email} (${decoded.role}) at ${new Date()}. IP: ${req.ip}`
      );

      // logger.info({ user: res.locals.user });

      return next();
    } catch (error) {
      return next(error);
    }
  }

  static async isAdmin(_req: Request, res: Response, next: NextFunction) {
    const user = res.locals.user;

    if (user.role !== "admin") {
      const response = CustomResponse.error("Forbidden", null, StatusCodes.FORBIDDEN);
      return handleCustomResponse(response, res);
    }

    return next();
  }
}
