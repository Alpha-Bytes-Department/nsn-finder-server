import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { SpendBountiesService } from './spendBounties.service';

const getAllSepndBounties = catchAsync(async (req, res) => {
  const result = await SpendBountiesService.getAllSepndBounties(
    req.user.id,
    req.query
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Bounties retrived successfully',
    data: result,
  });
});

export const SpendBountiesController = {
  getAllSepndBounties,
};
