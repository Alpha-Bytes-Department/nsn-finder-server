import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ListService } from './list.service';

const createList = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const value = {
    userId,
    ...req.body,
  };

  const result = await ListService.createList(value);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'List created successfully',
    data: result,
  });
});

export const ListController = {
  createList,
};
