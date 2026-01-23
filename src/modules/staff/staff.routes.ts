import express from 'express';
import { createStaff, getStaff, updateStaffStatus } from './staff.controller';

const router = express.Router();

router.post('/', createStaff);
router.get('/', getStaff);
router.put('/:id', updateStaffStatus);

export default router;
