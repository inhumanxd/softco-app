import { CustomResponse } from "@/common/models/CustomReponse";
import type { Response } from "express";

export const handleCustomResponse = (customResponse: CustomResponse<any>, response: Response) => {
  return response.status(customResponse.statusCode).send(customResponse);
};
