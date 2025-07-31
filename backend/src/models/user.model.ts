import mongoose, { Document, Schema, Types } from "mongoose";
import bcrypt from "bcryptjs";

interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phoneNumber: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "name  is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is requierd"],
      unique: [true, "Email already exists"],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    phoneNumber: {
      type: Number,
      required: [true, "phone Number is required"],
    },
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.password) {
    return next();
  }
  if (!user.isModified("password")) {
    return next();
  }
  try {
    const saltRounds = 10;
    if (user.password && user.password.startsWith("$2b$")) {
      return next();
    }
    user.password = await bcrypt.hash(user.password, saltRounds);
  } catch (error) {
    next(error as Error);
  }
});
export default mongoose.model<IUser>("User", userSchema);
