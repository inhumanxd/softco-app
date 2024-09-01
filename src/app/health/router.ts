import { CustomResponse } from "@/common/models/CustomReponse";
import { handleCustomResponse } from "@/common/utils/httpHandler";
import express, { type Request, type Response, type Router } from "express";

export const healthCheckRouter: Router = express.Router();

healthCheckRouter.get("/", (_req: Request, res: Response) => {
  const response = CustomResponse.success("Service is healthy!", null);
  return handleCustomResponse(response, res);
});
