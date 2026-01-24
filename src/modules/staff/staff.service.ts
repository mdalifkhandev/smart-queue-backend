import Staff from "./staff.model";
import { IStaff } from "./staff.interface";

export class StaffService {
  async createStaff(data: Partial<IStaff>): Promise<IStaff> {
    const staff = await Staff.create(data);
    return staff as unknown as IStaff;
  }

  async getStaff(): Promise<IStaff[]> {
    return (await Staff.find()) as unknown as IStaff[];
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
