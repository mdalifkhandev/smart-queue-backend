import { Request, Response } from "express";
import { serviceService } from "./service.service";

export const createService = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, duration, staffType } = req.body;
    const service = await serviceService.createService({
      name,
      duration,
      staffType,
    } as any);
    res.status(201).json(service);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getServices = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const services = await serviceService.getServices();
    res.json(services);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
