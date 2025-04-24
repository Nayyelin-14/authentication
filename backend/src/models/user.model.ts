import mongoose from "mongoose";
import { compareValue, hashValue } from "../utils/bcrypt";

export interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
  verified: boolean;
  createdAt: Date;
  updateAt: Date;
  comparePassword(value: string): Promise<boolean>;
  omitPassword(): Pick<
    UserDocument,
    "_id" | "email" | "createdAt" | "verified"
  >; //Pick<Type, Keys>
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false, required: true },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hashValue(this.password);
  next();
});

userSchema.methods.comparePassword = async function (value: string) {
  return compareValue(value, this.password);
};

userSchema.methods.omitPassword = function () {
  const user = this.toObject(); //this refers to the Mongoose document instance.// .toObject() converts the Mongoose document into a plain JavaScript object (which you can modify freely).
  delete user.password; //This line removes the password field from the user object.
  return user;
};

const UserModal = mongoose.model<UserDocument>("User", userSchema);

export default UserModal;
