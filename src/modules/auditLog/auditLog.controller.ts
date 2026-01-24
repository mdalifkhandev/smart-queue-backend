import { Request, Response } from "express";
import { auditLogService } from "./auditLog.service";

export const getAuditLogs = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const logs = await auditLogService.getLogs();
    res.json(logs);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
