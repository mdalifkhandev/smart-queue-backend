import { Request, Response } from 'express';
import Staff from './staff.model';
import Appointment from '../appointment/appointment.model';

export const createStaff = async (req: Request, res: Response) => {
    try {
        const { name, serviceType, dailyCapacity } = req.body;
        const staff = await Staff.create({ name, serviceType, dailyCapacity });
        res.status(201).json(staff);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getStaff = async (req: Request, res: Response) => {
    try {
        const staff = await Staff.find({});

        // Enrich staff with current load
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const enrichedStaff = await Promise.all(staff.map(async (s: any) => {
            const appointmentsCount = await Appointment.countDocuments({
                staff: s._id,
                appointmentDate: { $gte: today, $lt: tomorrow },
                status: { $ne: 'Cancelled' }
            });
            return {
                ...s.toObject(),
                currentLoad: appointmentsCount
            };
        }));

        res.json(enrichedStaff);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateStaffStatus = async (req: Request, res: Response) => {
    try {
        const staff: any = await Staff.findById(req.params.id);
        if (staff) {
            staff.availabilityStatus = req.body.availabilityStatus || staff.availabilityStatus;
            const updatedStaff = await staff.save();
            res.json(updatedStaff);
        } else {
            res.status(404).json({ message: 'Staff not found' });
        }
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
