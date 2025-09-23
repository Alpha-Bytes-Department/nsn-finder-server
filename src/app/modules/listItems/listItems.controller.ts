import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ListItemsService } from './listItems.service';

const createListItem = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const value = {
    userId,
    ...req.body,
  };

  const result = await ListItemsService.createListItem(value);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'List created successfully',
    data: result,
  });
});

const getAllListItems = catchAsync(async (req, res) => {
  const result = await ListItemsService.getAllListItems(
    req.params.listId,
    req.query
  );

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'List created successfully',
    data: result,
  });
});

export const ListItemsController = {
  createListItem,
  getAllListItems,
};
