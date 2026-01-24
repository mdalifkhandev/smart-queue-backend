import { Request, Response } from "express";
import { appointmentService } from "./appointment.service";

export const createAppointment = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const appointment = await appointmentService.createAppointment(req.body);
    return res.status(201).json(appointment);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAppointments = async (req: Request, res: Response) => {
  try {
    const date = req.query.date as string;
    const staffId = req.query.staffId as string;
    const appointments = await appointmentService.getAppointments(
      date,
      staffId,
    );
    res.json(appointments);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateAppointmentStatus = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { status } = req.body;
    const appointment = await appointmentService.updateStatus(
      req.params.id as string,
      status,
    );
    res.json(appointment);
  } catch (error: any) {
    if (error.message === "Appointment not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
};

export const assignFromQueue = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { staffId } = req.body;
    const eligibleApp = await appointmentService.assignFromQueue(staffId);
    res.json(eligibleApp);
  } catch (error: any) {
    if (error.message === "Staff not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
};
