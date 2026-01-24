import express from "express";
import { createService, getServices } from "./service.controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../interface/types";
import validateRequest from "../../middleware/validateRequest";
import { serviceValidationSchema } from "./service.validation";

const router = express.Router();

router.post(
  "/",
  // auth(USER_ROLE.admin),
  validateRequest(serviceValidationSchema.create),
  createService,
);
router.get(
  "/",
  // auth(USER_ROLE.admin, USER_ROLE.staff, USER_ROLE.user),
  getServices,
);

export default router;
