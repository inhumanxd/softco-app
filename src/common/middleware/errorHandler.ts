import type { Request, RequestHandler, Response, ErrorRequestHandler, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { CustomResponse } from "../models/CustomReponse";
import { handleCustomResponse } from "../utils/httpHandler";

const unexpectedRequest: RequestHandler = (_req, res) => {
  res.sendStatus(StatusCodes.NOT_FOUND);
};

const errorHandler: ErrorRequestHandler = (err, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack); // Log the error

  const errorMessage = err.message ? err.message : "Something went wrong!";

  const response = CustomResponse.error(errorMessage, null, 500);
  handleCustomResponse(response, res);
};

export const wrap = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default () => [unexpectedRequest, errorHandler];
