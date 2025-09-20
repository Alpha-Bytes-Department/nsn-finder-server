import { Types } from 'mongoose';

export type IBounties = {
  userId: Types.ObjectId;
  value: number;
};
