import { IRole } from "@/interfaces/IRole";
import { Roles } from "@/models/role.model";
import { isValidObjectId } from "mongoose";

export class RoleService {
  async findAll() {
    const roles = await Roles.find();

    return roles;
  }

  async findById(id: string) {
    if (!isValidObjectId(id)) throw new Error("Role id invalid");

    const role = await Roles.findById(id);

    if (!role) throw new Error("Role not found");
    if (!role.active) throw new Error("Role is not active");

    return role;
  }

  async createRole(data: IRole) {
    const role = await Roles.create(data);

    return role;
  }

  async updateRole(roleId: string, data: IRole) {
    const role = await Roles.updateOne(
      { _id: roleId },
      {
        $set: { name: data.name, hasAccessTo: data.hasAccessTo, active: data.active },
      }
    );

    return role;
  }

  async updateRolePartially(roleId: string, data: { grantAccessTo: string; revokeAccessTo: string }) {
    const updateAgg: any = {};
    const { grantAccessTo, revokeAccessTo } = data;

    if (grantAccessTo) updateAgg.$addToSet = { hasAccessTo: data.grantAccessTo };
    if (revokeAccessTo) updateAgg.$pull = { hasAccessTo: data.revokeAccessTo };

    const role = await Roles.updateOne({ _id: roleId }, updateAgg);

    return role;
  }
}

export const roleService = new RoleService();
