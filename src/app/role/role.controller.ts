import type { Request, Response } from "express";

import { roleService } from "@/app/role/role.service";
import { handleCustomResponse } from "@/common/utils/httpHandler";
import { CustomResponse } from "@/common/models/CustomReponse";
import { StatusCodes } from "http-status-codes";
import { IRole } from "@/interfaces/IRole";

class RoleController {
  private getUniqueModules = (modules: string[]) => {
    return [...new Set(modules)];
  };

  public getRoles = async (_req: Request, res: Response) => {
    const roles = await roleService.findAll();

    if (!roles || roles.length === 0) {
      const response = CustomResponse.success("No roles found", null);
      return handleCustomResponse(response, res);
    }

    const response = CustomResponse.success<IRole[]>("Roles found", roles);
    return handleCustomResponse(response, res);
  };

  public getRole = async (req: Request, res: Response) => {
    const id = req.params.id;
    const role = await roleService.findById(id);

    const response = CustomResponse.success<IRole>("Role found", role);
    return handleCustomResponse(response, res);
  };

  public createRole = async (req: Request, res: Response) => {
    const role = await roleService.createRole(req.body);

    if (!role) {
      const response = CustomResponse.error(
        "Something went wrong while creating role",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      return handleCustomResponse(response, res);
    }

    const response = CustomResponse.success<IRole>("Role created", role);
    return handleCustomResponse(response, res);
  };

  public updateRole = async (req: Request, res: Response) => {
    const roleId = req.params.id;
    req.body.hasAccessTo = this.getUniqueModules(req.body.hasAccessTo);

    await roleService.updateRole(roleId, req.body);

    const response = CustomResponse.success<null>("Role updated", null);
    return handleCustomResponse(response, res);
  };

  public updateRolePartially = async (req: Request, res: Response) => {
    const roleId = req.params.id;
    const { grantAccessTo, revokeAccessTo } = req.body;

    if (grantAccessTo && revokeAccessTo) {
      const response = CustomResponse.error("Use Roles update endpoint PUT /roles", null, StatusCodes.BAD_REQUEST);
      return handleCustomResponse(response, res);
    }

    await roleService.updateRolePartially(roleId, req.body);

    const response = CustomResponse.success<null>("Role partially updated", null);
    return handleCustomResponse(response, res);
  };
}

export const roleController = new RoleController();
