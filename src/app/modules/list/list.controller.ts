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

const getMyLists = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const result = await ListService.getMyLists(userId, req.query);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'List retrived successfully',
    data: result,
  });
});

const removeList = catchAsync(async (req, res) => {
  const result = await ListService.removeList(req.params.id);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'List removed successfully',
    data: result,
  });
});

const updateList = catchAsync(async (req, res) => {
  const result = await ListService.updateList(req.params.id, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'List updated successfully',
    data: result,
  });
});

const getDetails = catchAsync(async (req, res) => {
  const result = await ListService.getDetails(req.params.id);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'List retrived successfully',
    data: result,
  });
});

export const ListController = {
  createList,
  getMyLists,
  removeList,
  updateList,
  getDetails,
};
