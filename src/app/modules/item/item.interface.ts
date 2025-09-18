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
};

export type UpdateItemPayload = Partial<IItem> & {
  imagesToDelete?: string[];
};
