import { Request, Response } from 'express';
import Service from './service.model';

export const createService = async (req: Request, res: Response) => {
    try {
        const { name, duration, staffType } = req.body;
        const service = await Service.create({ name, duration, staffType });
        res.status(201).json(service);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getServices = async (req: Request, res: Response) => {
    try {
        const services = await Service.find({});
        res.json(services);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
