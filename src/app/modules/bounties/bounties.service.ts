import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Bounties } from './bounties.model';
import { IBounties } from './bounties.interface';

const getMyBounties = async (userId: string) => {
  const result = await Bounties.find({ userId });
  return result;
};

const spendBounty = async (bountyId: string, payload: Partial<IBounties>) => {
  const isExistBounty = await Bounties.findById(bountyId);
  if (!isExistBounty) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Bounty not found');
  }

  isExistBounty.value -= payload.value || 0;
  const result = await Bounties.findByIdAndUpdate(bountyId, isExistBounty, {
    new: true,
    runValidators: true,
  });
  return result;
};

export const BountiesService = {
  getMyBounties,
  spendBounty,
};
