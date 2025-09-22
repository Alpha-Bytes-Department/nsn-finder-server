import { model, Schema } from 'mongoose';
import { IListItem } from './listItems.interface';

const listItemsSchema = new Schema<IListItem>(
  {
    itemId: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
    listId: { type: Schema.Types.ObjectId, ref: 'List', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const ListItem = model<IListItem>('ListItems', listItemsSchema);
