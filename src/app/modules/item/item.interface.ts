import { Types } from 'mongoose';

export type IItem = {
  name: string;
  niin: number;
  model: number;
  lin: number;
  nsn: number;
  elc: string;
  manul: number;
  image: string[];
  userId: Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected';
};

export type UpdateItemPayload = Partial<IItem> & {
  imagesToDelete?: string[];
};
