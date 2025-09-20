import { model, Schema } from 'mongoose';
import { IBounties } from './bounties.interface';

const bountiesSchema = new Schema<IBounties>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    value: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Bounties = model<IBounties>('Bounties', bountiesSchema);
