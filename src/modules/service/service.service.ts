import Service from "./service.model";
import { IService } from "./service.interface";

export class ServiceService {
  async createService(data: Partial<IService>): Promise<IService> {
    const service = await Service.create(data);
    return service as unknown as IService;
  }

  async getServices(): Promise<IService[]> {
    return (await Service.find()) as unknown as IService[];
  }

  async getServiceById(id: string): Promise<IService | null> {
    return (await Service.findById(id)) as unknown as IService;
  }
}

export const serviceService = new ServiceService();
