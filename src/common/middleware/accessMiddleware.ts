import { NextFunction, Request, Response } from "express";
import { CustomResponse } from "../models/CustomReponse";
import { handleCustomResponse } from "../utils/httpHandler";
import { StatusCodes } from "http-status-codes";

export function checkAccess(req: Request, res: Response, next: NextFunction) {
  if (res.locals.isAdmin) return next();

  const module = req.baseUrl.split("/")[1];

  if (res.locals.hasAccessTo?.includes(module)) return next();

  const response = CustomResponse.error("Forbidden", null, StatusCodes.FORBIDDEN);
  return handleCustomResponse(response, res);
}
