import { Bounties } from './bounties.model';

const getMyBounties = async (userId: string) => {
  const result = await Bounties.find({ userId });
  return result;
};

export const BountiesService = {
  getMyBounties,
};
