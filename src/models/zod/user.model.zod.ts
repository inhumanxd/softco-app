import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { logger } from "@/common/utils/logger";
import { CustomResponse } from "@/common/models/CustomReponse";
import { StatusCodes } from "http-status-codes";
import { handleCustomResponse } from "@/common/utils/httpHandler";

const middlewareWrapper = (schema: z.ZodObject<any, any, any>, req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);
    return next();
  } catch (error: any) {
    logger.error(error);

    const response = CustomResponse.error("Data validation failed", error.errors, StatusCodes.BAD_REQUEST);
    return handleCustomResponse(response, res);
  }
};

export const ZodUserSchema = z.object({
  _id: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.string(),
  email: z.string().email(),
  password: z.string().min(5).max(100),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

const UserLoginZodSchema = z.object({}).merge(ZodUserSchema.pick({ email: true, password: true }));

const UserCreateZodSchema = z.object({}).merge(ZodUserSchema.omit({ _id: true, createdAt: true, updatedAt: true }));

const UsersUpdateZodSchema = z
  .object({})
  .merge(ZodUserSchema.pick({ firstName: true, lastName: true, role: true }))
  .partial()
  .extend({ users: z.array(z.string()).min(1) });

const UsersBulkUpdateSchema = z.object({
  data: z.array(UsersUpdateZodSchema).min(1),
});

export const zodValidateUserLoginData = (req: Request, res: Response, next: NextFunction) => {
  middlewareWrapper(UserLoginZodSchema, req, res, next);
};

export const zodValidateUserCreateData = (req: Request, res: Response, next: NextFunction) => {
  middlewareWrapper(UserCreateZodSchema, req, res, next);
};

export const zodValidateUsersUpdateData = (req: Request, res: Response, next: NextFunction) => {
  middlewareWrapper(UsersUpdateZodSchema, req, res, next);
};

export const zodValidateUsersBulkUpdateData = (req: Request, res: Response, next: NextFunction) => {
  middlewareWrapper(UsersBulkUpdateSchema, req, res, next);
};
