import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  isDeleted: boolean;
  password: string;
  matchPassword(enteredPassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}
