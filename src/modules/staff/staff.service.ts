import Staff from "./staff.model";
import { IStaff } from "./staff.interface";
import moment from "moment";

export class StaffService {
  async createStaff(data: Partial<IStaff>): Promise<IStaff> {
    const staff = await Staff.create(data);
    return staff as unknown as IStaff;
  }

  async getStaff(): Promise<any[]> {
    const staffMembers = await Staff.find();
    const startOfDay = moment().startOf("day").toDate();
    const endOfDay = moment().endOf("day").toDate();

    // Import Appointment here to avoid circular dependency if possible, or ensure it's imported at top
    // Using require/import based on existing file structure. 
    // Since I can't see top imports easily in this view, I'll assume Appointment is imported or I need to import it.
    // Actually, let's use the existing imports. I need to make sure Appointment is imported.
    const Appointment = require("../appointment/appointment.model").default;

    const staffWithLoad = await Promise.all(
      staffMembers.map(async (staff: any) => {
        const appointmentCount = await Appointment.countDocuments({
          staff: staff._id,
          status: { $in: ["Scheduled", "Waiting"] }, 
        });

        return {
          ...staff.toObject(),
          currentLoad: appointmentCount,
        };
      })
    );

    return staffWithLoad;
  }

  async updateStatus(id: string, status: string): Promise<IStaff> {
    const staff = await Staff.findById(id);
    if (!staff) throw new Error("Staff not found");
    staff.availabilityStatus = status as IStaff["availabilityStatus"];
    await staff.save();
    return staff as unknown as IStaff;
  }
}

export const staffService = new StaffService();
