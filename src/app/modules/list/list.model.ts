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
    status: {
      type: String,
      enum: ['shared', 'pending'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export const List = model<IList>('List', listSchema);
