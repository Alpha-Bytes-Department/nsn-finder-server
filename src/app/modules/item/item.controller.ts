import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import { getFilePathMultiple } from '../../../shared/getFilePath';
import sendResponse from '../../../shared/sendResponse';
import { ItemService } from './item.service';

const createItem = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const value = {
    ...req.body,
    userId,
  };

  let image = getFilePathMultiple(req.files, 'image', 'image');

  if (image && image.length > 0) {
    value.image = image;
  }
  const result = await ItemService.createItem(value);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Item created successfully',
    data: result,
  });
});

const updateItem = catchAsync(async (req, res) => {
  const value = {
    ...req.body,
  };

  let image = getFilePathMultiple(req.files, 'image', 'image');

  if (image && image.length > 0) {
    value.image = image;
  }
  const result = await ItemService.updateItem(req.params.id, value);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Item updated successfully',
    data: result,
  });
});

const getMyItems = catchAsync(async (req, res) => {
  const result = await ItemService.getMyItems(req.user.id, req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Item retrived successfully',
    data: result,
  });
});

const getItemsForAdmin = catchAsync(async (req, res) => {
  const result = await ItemService.getItemsForAdmin(req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Item retrived successfully',
    data: result,
  });
});

const getItemsEveryone = catchAsync(async (req, res) => {
  const result = await ItemService.getItemsEveryone(req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Item retrived successfully',
    data: result,
  });
});

const updateStatus = catchAsync(async (req, res) => {
  const result = await ItemService.updateStatus(req.params.id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Item updated successfully',
    data: result,
  });
});

export const ItemController = {
  createItem,
  updateItem,
  getMyItems,
  getItemsForAdmin,
  getItemsEveryone,
  updateStatus,
};
