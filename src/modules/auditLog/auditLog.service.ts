import AuditLog from "./auditLog.model";
import { IAuditLog } from "./auditLog.interface";

export class AuditLogService {
  async logAction(action: string, details: string): Promise<IAuditLog> {
    const log = await AuditLog.create({ action, details });
    return log as unknown as IAuditLog;
  }

  async getLogs(): Promise<IAuditLog[]> {
    return (await AuditLog.find().sort({
      timestamp: -1,
    })) as unknown as IAuditLog[];
  }
}

export const auditLogService = new AuditLogService();
