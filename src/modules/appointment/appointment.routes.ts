import express from "express";
import {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  assignFromQueue,
} from "./appointment.controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../interface/types";
import validateRequest from "../../middleware/validateRequest";
import { appointmentValidationSchema } from "./appointment.validation";

const router = express.Router();

router.post(
  "/",
  // auth(USER_ROLE.user),
  validateRequest(appointmentValidationSchema.create),
  createAppointment,
);
router.get(
  "/",
  // auth(USER_ROLE.admin, USER_ROLE.staff, USER_ROLE.user),
  getAppointments,
);
router.put(
  "/:id",
  // auth(USER_ROLE.admin, USER_ROLE.staff),
  validateRequest(appointmentValidationSchema.updateStatus),
  updateAppointmentStatus,
);
router.post(
  "/assign-queue",
  // auth(USER_ROLE.admin, USER_ROLE.staff),
  validateRequest(appointmentValidationSchema.assignQueue),
  assignFromQueue,
);

export default router;
