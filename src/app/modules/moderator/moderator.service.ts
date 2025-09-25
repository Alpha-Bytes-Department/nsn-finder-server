import { StatusCodes } from 'http-status-codes';
import { USER_ROLES } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';

const createModerator = async (payload: IUser) => {
  const { role } = payload;

  if (role === USER_ROLES.ADMIN) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'You cannot create an Admin user from this route.'
    );
  }

  const moderatorData = {
    ...payload,
    role: USER_ROLES.MODERATOR,
    verified: true,
  };

  return await User.create(moderatorData);
};

export const ModeratorService = {
  createModerator,
};
