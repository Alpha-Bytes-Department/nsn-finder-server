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

const getMyLists = async (userId: string, query: Record<string, unknown>) => {
  const { page, limit } = query;

  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const result = await List.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();
  const total = await List.countDocuments({ userId });

  const data: any = {
    result,
    meta: {
      page: pages,
      limit: size,
      total,
    },
  };
  return data;
};

export const ListService = {
  createList,
  getMyLists,
};
