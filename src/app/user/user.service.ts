import { IUser } from "@/interfaces/IUser";
import { Users } from "@/models/user.model";

export class UserService {
  async findAll(filterBy?: string) {
    // const users = await Users.find().select("-id -v name role").populate("role");

    const users = await Users.aggregate([
      {
        $lookup: {
          from: "roles", // The name of the Role collection (MongoDB automatically pluralizes the model name)
          localField: "role", // The field in User schema
          foreignField: "_id", // The field in Role schema
          as: "role", // The name of the field in the result
        },
      },
      {
        $unwind: {
          path: "$role", // Unwind the role array to get a single object
          preserveNullAndEmptyArrays: true, // Keep users without a role
        },
      },
      {
        $match: {
          $or: [
            { firstName: { $regex: filterBy, $options: "i" } }, // Match first name if it contains the name (case-insensitive)
            { lastName: { $regex: filterBy, $options: "i" } }, // Match last name if it contains the name (case-insensitive)
          ],
        },
      },
      { $project: { firstName: 1, lastName: 1, "role.name": 1, "role.hasAccessTo": 1 } },
    ]);

    return users;
  }

  async findById(id: string) {
    const user = await Users.findById(id).select("-password").populate("role");

    return user;
  }

  async findByEmail(email: string) {
    const user = await Users.findOne({ email }).populate("role");

    return user;
  }

  async createUser(data: IUser) {
    const user = await Users.create(data);

    return user;
  }

  async updateUser(data: { users: string[]; role: string; firstName: string; lastName: string }) {
    const updateCondition = data.users.includes("all") ? {} : { _id: { $in: data.users } };
    const response = await Users.updateMany(updateCondition, {
      $set: {
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
      },
    });

    return response;
  }
}

export const userService = new UserService();
