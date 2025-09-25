import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ModeratorService } from './moderator.service';
import { getFilePathMultiple } from '../../../shared/getFilePath';

const createModerator = catchAsync(async (req, res) => {
  let image = getFilePathMultiple(req.files, 'image', 'image');

  if (image && image.length > 0) {
    req.body.image = image[0];
  }

  const result = await ModeratorService.createModerator(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Moderator created successfully',
    data: result,
  });
});

const getAllModerators = catchAsync(async (req, res) => {
  const result = await ModeratorService.getAllModerators(req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Moderator retrived successfully',
    data: result,
  });
});

export const ModeratorController = {
  createModerator,
  getAllModerators,
};
