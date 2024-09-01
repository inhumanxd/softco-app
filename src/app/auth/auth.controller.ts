import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";
import { CustomResponse } from "@/common/models/CustomReponse";
import { handleCustomResponse } from "@/common/utils/httpHandler";
import { StatusCodes } from "http-status-codes";
import { IJWTTokens } from "@/interfaces/IJWT";
import { JWTHelper } from "@/helpers/jwt.helper";
import { IRole } from "@/interfaces/IRole";
import { userService } from "../user/user.service";

export class AuthController {
  static async refreshToken(req: Request, res: Response, _next: NextFunction) {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
      const response = CustomResponse.error("Refresh Token not passed", null, StatusCodes.BAD_REQUEST);
      return handleCustomResponse(response, res);
    }

    const tokens = AuthService.refreshToken(refreshToken);
    const response = CustomResponse.success<IJWTTokens>("Tokens refreshed", tokens);
    return handleCustomResponse(response, res);
  }

  static async login(req: Request, res: Response, _next: NextFunction) {
    const { email, password } = req.body;

    const user = await userService.findByEmail(email);

    if (!user) {
      const response = CustomResponse.error("User with email ${email} not found", null, StatusCodes.BAD_REQUEST);
      return handleCustomResponse(response, res);
    }

    const passwordMatches = await user.comparePassword(password);

    if (!passwordMatches) {
      const response = CustomResponse.error("Wrong emial password combination", null, StatusCodes.BAD_REQUEST);
      return handleCustomResponse(response, res);
    }

    const userRole = user.role as IRole;

    const tokens = JWTHelper.generateTokens({
      _id: String(user._id),
      email: user.email,
      role: userRole.name,
      firstName: user.firstName,
      lastName: user.lastName,
      hasAccessTo: userRole.hasAccessTo,
    });

    const response = CustomResponse.success<IJWTTokens>("Login successful", tokens);
    return handleCustomResponse(response, res);
  }

  static async auth(_req: Request, res: Response, _next: NextFunction) {
    return res.status(200).json({ status: 200, message: "User authenticated", data: res.locals.user });
  }
}
