import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../error/AppError";
import { TUser_Role } from "../interface/types";
import User from "../modules/user/user.model";
import catchAsync from "../utils/catchAsync";

const auth = (...requiredRoles: TUser_Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken || req.headers.authorization;

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are unauthorized!");
    }

    // Check if the token is valid
    const jwtSecret = process.env.JWT_SECRET as string;
    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    } catch (err) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized!");
    }

    const { email, role, exp } = decoded;

    // Check if token properly expired (though verify does this, checking exp manually is extra but fine)
    if (exp && Date.now() >= exp * 1000) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Token expired!");
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "This user is not found!");
    }

    // Check if user is already deleted
    if (user.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, "This user is deleted!");
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized!");
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
