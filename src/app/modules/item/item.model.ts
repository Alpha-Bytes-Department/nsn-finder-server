import { model, Schema } from 'mongoose';
import { IItem } from './item.interface';

const itemSchema = new Schema<IItem>(
  {
    name: { type: String, required: true },
    niin: { type: Number, required: true },
    model: { type: Number, required: true },
    lin: { type: Number, required: true },
    nsn: { type: Number, required: true },
    elc: { type: String, required: true },
    manul: { type: Number, required: true },
    image: { type: [String], default: [] },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Item = model<IItem>('Item', itemSchema);
