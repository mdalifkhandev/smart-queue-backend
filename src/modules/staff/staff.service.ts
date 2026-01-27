import Staff from "./staff.model";
import { IStaff } from "./staff.interface";
import moment from "moment";

export class StaffService {
  async createStaff(data: Partial<IStaff>): Promise<IStaff> {
    const staff = await Staff.create(data);
    return staff as unknown as IStaff;
  }

  async getStaff(date?: string): Promise<any[]> {
    const staffMembers = await Staff.find();
    const Appointment = require("../appointment/appointment.model").default;

    const staffWithLoad = await Promise.all(
      staffMembers.map(async (staff: any) => {
        let query: any = {
          staff: staff._id,
          status: { $in: ["Scheduled", "Waiting"] },
        };

        // If date is provided, filter by that specific date
        if (date) {
          query.appointmentDate = {
            $gte: moment(date).startOf("day").toDate(),
            $lte: moment(date).endOf("day").toDate(),
          };
        }

        const appointmentCount = await Appointment.countDocuments(query);

        return {
          ...staff.toObject(),
          currentLoad: appointmentCount,
        };
      }),
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
