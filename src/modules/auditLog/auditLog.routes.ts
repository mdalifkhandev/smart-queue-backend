import express from 'express';
import { getLogs } from './auditLog.controller';
import { protect } from '../../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, getLogs);

export default router;
