import mongoose, { CallbackError, Model, Schema, ValidatorProps } from "mongoose";
import bcrypt from "bcrypt";
import { IUser, IUserMethods, IUserVirtials } from "@/interfaces/IUser";

const SALT_ROUNDS = 10;

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, {}, IUserMethods, {}, IUserVirtials>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v: string) {
          // Regular expression for basic email validation
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
        },
        message: (props: ValidatorProps) => `${props.value} is not a valid email address!`,
      },
    },
    password: { type: String, required: true },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    // Hash the password using the salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    return next(err as CallbackError);
  }
});

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

const Users = mongoose.model<IUser, UserModel>(`User`, userSchema);

export { Users };
