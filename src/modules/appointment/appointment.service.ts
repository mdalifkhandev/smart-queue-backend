import Appointment from "./appointment.model";
import Staff from "../staff/staff.model";
import Service from "../service/service.model";
import AuditLog from "../auditLog/auditLog.model";
import moment from "moment";
import { IAppointment } from "./appointment.interface";

export class AppointmentService {
  async createAppointment(data: any): Promise<any> {
    const { customerName, serviceId, staffId, appointmentDate } = data;

    const service: any = await Service.findById(serviceId);
    if (!service) throw new Error("Service not found");

    const startDate = moment(appointmentDate);
    const endDate = moment(startDate).add(service.duration, "minutes");

    if (staffId) {
      const staff: any = await Staff.findById(staffId);
      if (!staff) throw new Error("Staff not found");

      if (staff.availabilityStatus === "On Leave") {
        throw new Error("Staff is currently on leave");
      }

      const allAppointments: any[] = await Appointment.find({
        staff: staffId,
        status: "Scheduled",
        appointmentDate: {
          $gte: moment(startDate).startOf("day").toDate(),
          $lte: moment(startDate).endOf("day").toDate(),
        },
      }).populate("service");

      const isConflict = allAppointments.some((app) => {
        const appStart = moment(app.appointmentDate);
        const appEnd = moment(appStart).add(app.service.duration, "minutes");
        return startDate.isBefore(appEnd) && endDate.isAfter(appStart);
      });

      if (isConflict) {
        throw new Error(
          "This staff member already has an appointment at this time.",
        );
      }

      const todayCount = await Appointment.countDocuments({
        staff: staffId,
        appointmentDate: {
          $gte: moment(startDate).startOf("day").toDate(),
          $lte: moment(startDate).endOf("day").toDate(),
        },
        status: { $ne: "Cancelled" },
      });

      if (todayCount >= staff.dailyCapacity) {
        throw new Error(
          `${staff.name} already has ${staff.dailyCapacity} appointments today.`,
        );
      }

      const appointment = await Appointment.create({
        customerName,
        service: serviceId,
        staff: staffId,
        appointmentDate: startDate.toDate(),
        status: "Scheduled",
      });

      await AuditLog.create({
        action: "Appointment Created",
        details: `Appointment for ${customerName} assigned to ${staff.name}`,
      });

      return appointment;
    } else {
      const queuePosition =
        (await Appointment.countDocuments({ status: "Waiting" })) + 1;
      const appointment = await Appointment.create({
        customerName,
        service: serviceId,
        appointmentDate: startDate.toDate(),
        status: "Waiting",
        queuePosition,
      });

      await AuditLog.create({
        action: "Added to Queue",
        details: `Appointment for ${customerName} added to waiting queue (Pos: ${queuePosition})`,
      });

      return appointment;
    }
  }

  async getAppointments(
    date?: string,
    staffId?: string,
  ): Promise<IAppointment[]> {
    let query: any = {};
    if (date) {
      query.appointmentDate = {
        $gte: moment(date).startOf("day").toDate(),
        $lte: moment(date).endOf("day").toDate(),
      };
    }
    if (staffId) {
      query.staff = staffId;
    }
    return (await Appointment.find(query)
      .populate("service staff")
      .sort("appointmentDate")) as unknown as IAppointment[];
  }

  async updateStatus(id: string, status: string): Promise<IAppointment> {
    const appointment = await Appointment.findById(id);
    if (!appointment) throw new Error("Appointment not found");

    appointment.status =
      (status as IAppointment["status"]) || appointment.status;
    await appointment.save();

    await AuditLog.create({
      action: "Status Updated",
      details: `Appointment for ${appointment.customerName} marked as ${status}`,
    });

    return appointment as unknown as IAppointment;
  }

  async assignFromQueue(staffId: string): Promise<any> {
    const staff: any = await Staff.findById(staffId);
    if (!staff) throw new Error("Staff not found");

    const waitingAppointments: any[] = await Appointment.find({
      status: "Waiting",
    })
      .populate("service")
      .sort("queuePosition");

    const eligibleApp = waitingAppointments.find(
      (app) => app.service.staffType === staff.serviceType,
    );

    if (!eligibleApp) {
      throw new Error("No eligible appointments in queue for this staff type.");
    }

    const todayCount = await Appointment.countDocuments({
      staff: staffId,
      appointmentDate: {
        $gte: moment(eligibleApp.appointmentDate).startOf("day").toDate(),
        $lte: moment(eligibleApp.appointmentDate).endOf("day").toDate(),
      },
      status: { $ne: "Cancelled" },
    });

    if (todayCount >= staff.dailyCapacity) {
      throw new Error(`${staff.name} is at full capacity.`);
    }

    eligibleApp.staff = staffId;
    eligibleApp.status = "Scheduled";
    eligibleApp.queuePosition = null;
    await eligibleApp.save();

    const remainingQueue: any[] = await Appointment.find({
      status: "Waiting",
    }).sort("queuePosition");
    for (let i = 0; i < remainingQueue.length; i++) {
      remainingQueue[i].queuePosition = i + 1;
      await remainingQueue[i].save();
    }

    await AuditLog.create({
      action: "Queue Assignment",
      details: `Appointment for ${eligibleApp.customerName} moved from queue to ${staff.name}`,
    });

    return eligibleApp;
  }
}

export const appointmentService = new AppointmentService();
