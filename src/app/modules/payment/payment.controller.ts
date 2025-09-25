import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import { PaymentService } from './payment.service';
import sendResponse from '../../../shared/sendResponse';

const createPayment = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const value = {
    userId,
    ...req.body,
  };

  const result = await PaymentService.createPayment(value);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Payment created successfully',
    data: result,
  });
});

const unsubscribeUser = catchAsync(async (req, res) => {
  const result = await PaymentService.unsubscribeUser();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Payment unsubscribed successfully',
    data: result,
  });
});

const getTotalPayment = catchAsync(async (req, res) => {
  const result = await PaymentService.getTotalPayment();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Payment retrived successfully',
    data: result,
  });
});

const getAllPayment = catchAsync(async (req, res) => {
  const result = await PaymentService.getAllPayment(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Payment retrived successfully',
    data: result,
  });
});

export const PaymentController = {
  createPayment,
  unsubscribeUser,
  getTotalPayment,
  getAllPayment,
};
