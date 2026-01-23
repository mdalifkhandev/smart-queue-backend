import { Request, Response } from 'express';
import Appointment from './appointment.model';
import Staff from '../staff/staff.model';
import Service from '../service/service.model';
import AuditLog from '../auditLog/auditLog.model';
import moment from 'moment';

export const createAppointment = async (req: Request, res: Response): Promise<any> => {
    try {
        const { customerName, serviceId, staffId, appointmentDate } = req.body;

        const service: any = await Service.findById(serviceId);
        if (!service) return res.status(404).json({ message: 'Service not found' });

        const startDate = moment(appointmentDate);
        const endDate = moment(startDate).add(service.duration, 'minutes');

        if (staffId) {
            const staff: any = await Staff.findById(staffId);
            if (!staff) return res.status(404).json({ message: 'Staff not found' });

            if (staff.availabilityStatus === 'On Leave') {
                return res.status(400).json({ message: 'Staff is currently on leave' });
            }

            const allAppointments: any[] = await Appointment.find({
                staff: staffId,
                status: 'Scheduled',
                appointmentDate: {
                    $gte: moment(startDate).startOf('day').toDate(),
                    $lte: moment(startDate).endOf('day').toDate()
                }
            }).populate('service');

            const isConflict = allAppointments.some(app => {
                const appStart = moment(app.appointmentDate);
                const appEnd = moment(appStart).add(app.service.duration, 'minutes');
                return startDate.isBefore(appEnd) && endDate.isAfter(appStart);
            });

            if (isConflict) {
                return res.status(400).json({ message: 'This staff member already has an appointment at this time.' });
            }

            const todayCount = await Appointment.countDocuments({
                staff: staffId,
                appointmentDate: {
                    $gte: moment(startDate).startOf('day').toDate(),
                    $lte: moment(startDate).endOf('day').toDate()
                },
                status: { $ne: 'Cancelled' }
            });

            if (todayCount >= staff.dailyCapacity) {
                return res.status(400).json({ message: `${staff.name} already has ${staff.dailyCapacity} appointments today.` });
            }

            const appointment = await Appointment.create({
                customerName,
                service: serviceId,
                staff: staffId,
                appointmentDate: startDate.toDate(),
                status: 'Scheduled'
            });

            await AuditLog.create({
                action: 'Appointment Created',
                details: `Appointment for ${customerName} assigned to ${staff.name}`
            });

            return res.status(201).json(appointment);
        } else {
            const queuePosition = await Appointment.countDocuments({ status: 'Waiting' }) + 1;
            const appointment = await Appointment.create({
                customerName,
                service: serviceId,
                appointmentDate: startDate.toDate(),
                status: 'Waiting',
                queuePosition
            });

            await AuditLog.create({
                action: 'Added to Queue',
                details: `Appointment for ${customerName} added to waiting queue (Pos: ${queuePosition})`
            });

            return res.status(201).json(appointment);
        }

    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getAppointments = async (req: Request, res: Response) => {
    try {
        const { date, staffId } = req.query;
        let query: any = {};
        if (date) {
            query.appointmentDate = {
                $gte: moment(date as string).startOf('day').toDate(),
                $lte: moment(date as string).endOf('day').toDate()
            };
        }
        if (staffId) {
            query.staff = staffId;
        }
        const appointments = await Appointment.find(query).populate('service staff').sort('appointmentDate');
        res.json(appointments);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateAppointmentStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        const appointment: any = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        appointment.status = status || appointment.status;
        await appointment.save();

        await AuditLog.create({
            action: 'Status Updated',
            details: `Appointment for ${appointment.customerName} marked as ${status}`
        });

        res.json(appointment);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const assignFromQueue = async (req: Request, res: Response): Promise<any> => {
    try {
        const { staffId } = req.body;
        const staff: any = await Staff.findById(staffId);
        if (!staff) return res.status(404).json({ message: 'Staff not found' });

        const waitingAppointments: any[] = await Appointment.find({ status: 'Waiting' })
            .populate('service')
            .sort('queuePosition');

        const eligibleApp = waitingAppointments.find(app => app.service.staffType === staff.serviceType);

        if (!eligibleApp) {
            return res.status(400).json({ message: 'No eligible appointments in queue for this staff type.' });
        }

        const todayCount = await Appointment.countDocuments({
            staff: staffId,
            appointmentDate: {
                $gte: moment(eligibleApp.appointmentDate).startOf('day').toDate(),
                $lte: moment(eligibleApp.appointmentDate).endOf('day').toDate()
            },
            status: { $ne: 'Cancelled' }
        });

        if (todayCount >= staff.dailyCapacity) {
            return res.status(400).json({ message: `${staff.name} is at full capacity.` });
        }

        eligibleApp.staff = staffId;
        eligibleApp.status = 'Scheduled';
        eligibleApp.queuePosition = null;
        await eligibleApp.save();

        const remainingQueue: any[] = await Appointment.find({ status: 'Waiting' }).sort('queuePosition');
        for (let i = 0; i < remainingQueue.length; i++) {
            remainingQueue[i].queuePosition = i + 1;
            await remainingQueue[i].save();
        }

        await AuditLog.create({
            action: 'Queue Assignment',
            details: `Appointment for ${eligibleApp.customerName} moved from queue to ${staff.name}`
        });

        res.json(eligibleApp);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
