import { model, Schema } from 'mongoose';
import { IList } from './list.interface';

const listSchema = new Schema<IList>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    email: [{ type: String }],
  },
  { timestamps: true }
);

export const List = model<IList>('List', listSchema);
