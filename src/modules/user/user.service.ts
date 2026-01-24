import User from "./user.model";
import { IUser } from "./user.interface";
import jwt from "jsonwebtoken";

const generateToken = (id: any): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
};

export class UserService {
  async registerUser(userData: Partial<IUser>): Promise<any> {
    const { name, email, password } = userData;
    const userExists = await User.findOne({ email });

    if (userExists) {
      throw new Error("User already exists");
    }

    const user = (await User.create({
      name,
      email,
      password,
    })) as unknown as IUser;

    if (user) {
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      };
    } else {
      throw new Error("Invalid user data");
    }
  }

  async loginUser(loginData: Partial<IUser>): Promise<any> {
    const { email, password } = loginData;

    if (!email || !password) {
      throw new Error("Invalid email or password");
    }

    let user: IUser | null = await User.findOne({ email });

    // Auto-create demo user if not exists
    if (!user && email === "demo@example.com" && password === "demo123") {
      user = (await User.create({
        name: "Demo Admin",
        email: "demo@example.com",
        password: "demo123",
      })) as unknown as IUser;
    }

    if (user && (await user.matchPassword(password))) {
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      };
    } else {
      throw new Error("Invalid email or password");
    }
  }
}

export const userService = new UserService();
