import express from "express";
import { createStaff, getStaff, updateStaffStatus } from "./staff.controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../interface/types";
import validateRequest from "../../middleware/validateRequest";
import { staffValidationSchema } from "./staff.validation";

const router = express.Router();

router.post(
  "/",
  // auth(USER_ROLE.admin),
  validateRequest(staffValidationSchema.create),
  createStaff,
);
router.get(
  "/",
  // auth(USER_ROLE.admin, USER_ROLE.staff, USER_ROLE.user),
  getStaff,
);
router.put(
  "/:id",
  // auth(USER_ROLE.admin, USER_ROLE.staff),
  validateRequest(staffValidationSchema.updateStatus),
  updateStaffStatus,
);

export default router;
