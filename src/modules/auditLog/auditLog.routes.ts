import express from "express";
import { getAuditLogs } from "./auditLog.controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../interface/types";

const router = express.Router();

router.get("/", auth(USER_ROLE.admin), getAuditLogs);

export default router;
