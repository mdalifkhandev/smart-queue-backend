import { Request, Response } from "express";
import { userService } from "./user.service";

export const registerUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const result = await userService.registerUser(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    if (error.message === "User already exists") {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await userService.loginUser(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};
