import { model, Schema } from 'mongoose';
import { ISpendBounty } from './spendBounties.interface';

const spendBountiesSchema = new Schema<ISpendBounty>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    bountyId: { type: Schema.Types.ObjectId, ref: 'Bounties', required: true },
    time: { type: Date, required: true },
  },
  { timestamps: true }
);

export const SpendBounties = model<ISpendBounty>(
  'SpendBounties',
  spendBountiesSchema
);
