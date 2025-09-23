import { model, Schema } from 'mongoose';
import { IPayment } from './payment.interface';

const paymentSchema = new Schema<IPayment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    price: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    package: { type: String, required: true },
    platForm: { type: String, required: true },
    status: {
      type: String,
      enum: ['success', 'failed'],
    },
  },
  { timestamps: true }
);

export const Payment = model<IPayment>('Payment', paymentSchema);
