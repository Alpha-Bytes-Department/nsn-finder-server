import { Types } from 'mongoose';

export type IListItem = {
  userId: Types.ObjectId;
  listId: Types.ObjectId;
  itemId: Types.ObjectId;
};
