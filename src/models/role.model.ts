import { IRole } from "@/interfaces/IRole";
import mongoose, { Model, Schema } from "mongoose";

type RoleModel = Model<IRole>;

const roleSchema = new Schema<IRole>(
  {
    name: { type: String, required: true, unique: true, maxLength: 50 },
    hasAccessTo: { type: [String], required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Roles = mongoose.model<IRole, RoleModel>(`Role`, roleSchema);

export { Roles };
