import express from "express";
import { registerUser, loginUser } from "./user.controller";
import validateRequest from "../../middleware/validateRequest";
import { userValidationSchema } from "./user.validation";

const router = express.Router();

router.post(
  "/register",
  validateRequest(userValidationSchema.register),
  registerUser,
);
router.post("/login", validateRequest(userValidationSchema.login), loginUser);

export default router;
