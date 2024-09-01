import { Types } from "mongoose";
import { IRole } from "./IRole";

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Types.ObjectId | IRole;
  createdAt: string;
  updatedAt: string;
}

export interface IUserMethods {
  comparePassword: (password: string) => Promise<Boolean>;
}

export interface IUserVirtials {
  name: string;
}
