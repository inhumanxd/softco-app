import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { userService } from "@/app/user/user.service";
import { roleService } from "@/app/role/role.service";
import { handleCustomResponse } from "@/common/utils/httpHandler";
import { CustomResponse } from "@/common/models/CustomReponse";
import { IUser } from "@/interfaces/IUser";
import { IRole } from "@/interfaces/IRole";
import { getValidInvalidObjectIDs } from "@/helpers/mongoose.helper";

class UserController {
  public getUsers = async (req: Request, res: Response) => {
    const filterQuery = (req.query.filterBy as string) ?? "";
    const users = await userService.findAll(filterQuery);

    if (!users || users.length === 0) {
      const response = CustomResponse.success("No users found", null);
      return handleCustomResponse(response, res);
    }

    const response = CustomResponse.success<IUser[]>("Users found", users);
    return handleCustomResponse(response, res);
  };

  public getUser = async (req: Request, res: Response) => {
    const id = req.params.id;
    const user = await userService.findById(id);

    if (!user) {
      const response = CustomResponse.error("User not found", null, StatusCodes.NOT_FOUND);
      return handleCustomResponse(response, res);
    }

    const response = CustomResponse.success<IUser>("User found", user);
    return handleCustomResponse(response, res);
  };

  public createUser = async (req: Request, res: Response) => {
    const role = await roleService.findById(req.body.role);

    if (!role) {
      const response = CustomResponse.error("Role not found", null, StatusCodes.INTERNAL_SERVER_ERROR);
      return handleCustomResponse(response, res);
    }

    const user = await userService.createUser(req.body);

    if (!user) {
      const response = CustomResponse.error(
        "Something went wrong while creating user",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      return handleCustomResponse(response, res);
    }

    const response = CustomResponse.success<IUser>("User created", user);
    return handleCustomResponse(response, res);
  };

  private updateUsersWithData = async (data: any) => {
    if (data.role) await roleService.findById(data.role);
    const { validObjectIDs, invalidObjectIDs } = getValidInvalidObjectIDs(data.users);

    if (invalidObjectIDs.length) {
      return CustomResponse.error("These user ids are invalid", { invalidObjectIDs }, StatusCodes.BAD_REQUEST);
    }

    data.users = validObjectIDs;

    const user = await userService.updateUser(data);

    if (!user) {
      return CustomResponse.error(
        "Something went wrong while updating user(s)",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    return CustomResponse.success("User(s) updated", user);
  };

  public updateUsers = async (req: Request, res: Response) => {
    const response = await this.updateUsersWithData(req.body);

    return handleCustomResponse(response, res);
  };

  public updateUsersWithDifferentData = async (req: Request, res: Response) => {
    const userUpdatePromises: Promise<any>[] = [];
    for (const user of req.body.data) {
      userUpdatePromises.push(this.updateUsersWithData(user));
    }

    const promiseResponses = await Promise.allSettled(userUpdatePromises);

    let failedPromisesCount = 0;
    let fulfilledPromisesCount = 0;

    const responses: any = [];

    for (const promiseResponse of promiseResponses) {
      const { status } = promiseResponse;
      if (status === "rejected") {
        failedPromisesCount++;

        responses.push(promiseResponse.reason);
        continue;
      }

      if (status === "fulfilled") {
        const { value } = promiseResponse;
        fulfilledPromisesCount++;

        responses.push(value.responseObject);
      }
    }

    const responseObject = { failedPromisesCount, fulfilledPromisesCount, responses };
    const response = CustomResponse.success("User(s) update completed", responseObject);
    return handleCustomResponse(response, res);
  };

  public checkUserAccess = async (req: Request, res: Response) => {
    const id = req.params.id;
    const module = req.query.module as string;
    const user = await userService.findById(id);

    if (!user) {
      const response = CustomResponse.error("User not found", null, StatusCodes.NOT_FOUND);
      return handleCustomResponse(response, res);
    }

    const userRole = user.role as IRole;
    const hasAccess = userRole.name === "admin" || userRole.hasAccessTo.includes(module);

    const response = CustomResponse.success("User access info retrieved", { role: userRole.name, hasAccess });
    return handleCustomResponse(response, res);
  };
}

export const userController = new UserController();
