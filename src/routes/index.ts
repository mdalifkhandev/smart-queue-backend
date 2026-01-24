import express from "express";
import AppointmentRoutes from "../modules/appointment/appointment.routes";
import AuditLogRoutes from "../modules/auditLog/auditLog.routes";
import ServiceRoutes from "../modules/service/service.routes";
import StaffRoutes from "../modules/staff/staff.routes";
import UserRoutes from "../modules/user/user.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/appointments",
    route: AppointmentRoutes,
  },
  {
    path: "/services",
    route: ServiceRoutes,
  },
  {
    path: "/staff",
    route: StaffRoutes,
  },
  {
    path: "/audit-logs",
    route: AuditLogRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
