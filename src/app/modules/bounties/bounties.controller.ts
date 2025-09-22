import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { BountiesService } from './bounties.service';

const getMyBounties = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const result = await BountiesService.getMyBounties(userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Bounties retrived successfully',
    data: result,
  });
});

const spendBounty = catchAsync(async (req, res) => {
  const userId: string = req.user.id;

  const value = {
    ...req.body,
    userId,
  };

  const result = await BountiesService.spendBounty(req.params.id, value);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Bounties spend successfully',
    data: result,
  });
});

export const BountiesController = {
  getMyBounties,
  spendBounty,
};
