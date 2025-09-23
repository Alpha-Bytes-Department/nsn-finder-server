import { Types } from 'mongoose';

export type IPayment = {
  userId: Types.ObjectId;
  price: number;
  startDate: Date;
  endDate: Date;
  package: string;
  platForm: string;
};
