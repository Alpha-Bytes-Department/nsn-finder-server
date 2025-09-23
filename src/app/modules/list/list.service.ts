import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IList } from './list.interface';
import { List } from './list.model';
import { ListItem } from '../listItems/listItems.model';

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

const removeList = async (id: string): Promise<IList | null> => {
  const isExistList = await List.findById(id);
  if (!isExistList) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'List not found');
  }

  // Delete related items and the list in parallel
  await Promise.all([
    ListItem.deleteMany({ listId: id }),
    List.findByIdAndDelete(id),
  ]);

  return isExistList;
};

export const ListService = {
  createList,
  getMyLists,
  removeList,
};
