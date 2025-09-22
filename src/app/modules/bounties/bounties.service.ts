import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Bounties } from './bounties.model';
import { IBounties } from './bounties.interface';
import { SpendBounties } from '../spendBounties/spendBounties.model';
import { ISpendBounty } from '../spendBounties/spendBounties.interface';

const getMyBounties = async (userId: string) => {
  const result = await Bounties.find({ userId });
  return result;
};

const spendBounty = async (
  bountyId: string,
  payload: Partial<ISpendBounty>
) => {
  const isExistBounty: any = await Bounties.findById(bountyId);
  if (!isExistBounty) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Bounty not found');
  }

  // validate amount
  const { amount, userId } = payload;
  if (!amount || !userId) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Amount and User are required');
  }

  if (amount > isExistBounty.value) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Insufficient bounty balance');
  }

  // map spend amount to months
  let monthsToAdd = 0;
  if (amount === 15) monthsToAdd = 1;
  else if (amount === 30) monthsToAdd = 3;
  else if (amount === 50) monthsToAdd = 6;
  else {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid bounty spend amount');
  }

  // calculate expiry date
  const now = new Date();
  const expiryDate = new Date(now);
  expiryDate.setMonth(expiryDate.getMonth() + monthsToAdd);

  // save spend record
  const spendData = await SpendBounties.create({
    userId,
    amount,
    bountyId,
    time: expiryDate,
  });

  // reduce bounty balance (use same field as in validation)
  isExistBounty.value = (isExistBounty.value || 0) - amount;
  await isExistBounty.save();

  return spendData;
};

export const BountiesService = {
  getMyBounties,
  spendBounty,
};
