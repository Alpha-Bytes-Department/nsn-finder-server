import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IList } from './list.interface';
import { List } from './list.model';

const createList = async (payload: IList) => {
  const isExistList = await List.findOne({
    userId: payload.userId,
    name: payload.name,
  });
  if (isExistList) {
    throw new ApiError(StatusCodes.CONFLICT, 'List already exists');
  }

  const list = await List.create(payload);
  return list;
};

export const ListService = {
  createList,
};
