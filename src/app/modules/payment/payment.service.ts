import { User } from '../user/user.model';
import { IPayment } from './payment.interface';
import { Payment } from './payment.model';

const createPayment = async (payload: IPayment) => {
  const payment = await Payment.create(payload);

  if (payload.status === 'success') {
    await User.findByIdAndUpdate(payload.userId, { subscribed: true });
  }

  return payment;
};

export const PaymentService = {
  createPayment,
};
