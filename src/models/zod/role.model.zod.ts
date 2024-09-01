import { CustomResponse } from "@/common/models/CustomReponse";
import { handleCustomResponse } from "@/common/utils/httpHandler";
import { logger } from "@/common/utils/logger";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

const middlewareWrapper = (
  schema: z.ZodObject<any, any, any> | z.ZodEffects<any>,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    schema.parse(req.body);
    return next();
  } catch (error: any) {
    logger.error(error);

    const response = CustomResponse.error("Data validation failed", error.errors, StatusCodes.BAD_REQUEST);
    return handleCustomResponse(response, res);
  }
};

export const ZodRoleSchema = z.object({
  _id: z.string().optional(),
  name: z.string(),
  hasAccessTo: z.array(z.string()).min(1),
  active: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

const RoleCreateZodSchema = z.object({}).merge(ZodRoleSchema.omit({ _id: true, createdAt: true, updatedAt: true }));

const RoleUpdateZodSchema = z
  .object({})
  .merge(ZodRoleSchema.omit({ _id: true, createdAt: true, updatedAt: true }))
  .partial()
  .refine((data) => !(data.name === undefined && data.hasAccessTo === undefined && data.active === undefined), {
    message: "at least one of name, hasAccessTo or active should be passed",
  });

const RolePartiallyUpdateZodSchema = z
  .object({ grantAccessTo: z.string(), revokeAccessTo: z.string() })
  .partial()
  .refine((data) => !(data.grantAccessTo === undefined && data.revokeAccessTo === undefined), {
    message: "either grantAccessTo or revokeAccessTo should be passed",
  })
  .refine((data) => !(data.grantAccessTo !== undefined && data.revokeAccessTo !== undefined), {
    message: "both grantAccessTo and revokeAccessTo should not be passed",
  });

export const zodValidateRoleCreateData = (req: Request, res: Response, next: NextFunction) => {
  middlewareWrapper(RoleCreateZodSchema, req, res, next);
};

export const zodValidateRoleUpdateData = (req: Request, res: Response, next: NextFunction) => {
  middlewareWrapper(RoleUpdateZodSchema, req, res, next);
};

export const zodValidateRolePartiallyUpdateData = (req: Request, res: Response, next: NextFunction) => {
  middlewareWrapper(RolePartiallyUpdateZodSchema, req, res, next);
};
