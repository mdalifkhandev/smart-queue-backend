import express from 'express';
import {
    createAppointment,
    getAppointments,
    updateAppointmentStatus,
    assignFromQueue
} from './appointment.controller';

const router = express.Router();

router.post('/', createAppointment);
router.get('/', getAppointments);
router.put('/:id', updateAppointmentStatus);
router.post('/assign-queue', assignFromQueue);

export default router;
