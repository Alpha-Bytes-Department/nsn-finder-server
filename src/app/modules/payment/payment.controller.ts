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

export const PaymentController = {
  createPayment,
};
