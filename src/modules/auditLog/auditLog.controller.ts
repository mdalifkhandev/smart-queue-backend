import { Request, Response } from 'express';
import AuditLog from './auditLog.model';

export const getLogs = async (req: Request, res: Response) => {
    try {
        const logs = await AuditLog.find({}).sort({ timestamp: -1 }).limit(10);
        res.json(logs);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
