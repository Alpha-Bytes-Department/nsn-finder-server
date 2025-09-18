import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IItem } from './item.interface';
import { Item } from './item.model';

const createItem = async (payload: IItem) => {
  const isExist = await Item.findOne({
    userId: payload.userId,
    name: payload.name,
  });

  if (isExist) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Item with name ${payload.name} already exists`
    );
  }

  const item = await Item.create(payload);
  return item;
};

export const ItemService = {
  createItem,
};
