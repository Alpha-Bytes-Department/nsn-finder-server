import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { DashboardService } from './dashboard.service';

const getStatistics = catchAsync(async (req, res) => {
  const result = await DashboardService.getStatistics();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Statistics retrived successfully',
    data: result,
  });
});

export const DashboardController = {
  getStatistics,
};
