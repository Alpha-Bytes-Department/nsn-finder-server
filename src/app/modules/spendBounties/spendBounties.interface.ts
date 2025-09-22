import { Types } from 'mongoose';

export type ISpendBounty = {
  userId: Types.ObjectId;
  amount: number;
  bountyId: Types.ObjectId;
  time: Date;
};
