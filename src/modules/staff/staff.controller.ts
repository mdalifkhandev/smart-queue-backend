import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { staffService } from "./staff.service";

export const createStaff = catchAsync(async (req: Request, res: Response) => {
  const { name, serviceType, dailyCapacity, availabilityStatus } = req.body;
  const result = await staffService.createStaff({
    name,
    serviceType,
    dailyCapacity,
    availabilityStatus,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Staff created successfully",
    data: result,
  });
});

export const getStaff = catchAsync(async (req: Request, res: Response) => {
  const { date } = req.query;
  const result = await staffService.getStaff(date as string | undefined);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Staffs retrieved successfully",
    data: result,
  });
});

export const updateStaffStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { status } = req.body as { status: string };
    const result = await staffService.updateStatus(id, status);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Staff status updated successfully",
      data: result,
    });
  },
);
