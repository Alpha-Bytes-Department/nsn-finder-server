import { Types } from 'mongoose';

export type IList = {
  userId: Types.ObjectId;
  name: string;
};
