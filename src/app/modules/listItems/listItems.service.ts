import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { List } from '../list/list.model';
import { IListItem } from './listItems.interface';
import { ListItem } from './listItems.model';
import { Item } from '../item/item.model';

const createListItem = async (
  listItem: Partial<IListItem>
): Promise<IListItem> => {
  const [list, items] = await Promise.all([
    List.findById(listItem.listId),
    Item.find({ _id: { $in: listItem.itemId } }), // handle multiple
  ]);

  if (!list) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'List not found');
  }

  if (!items || items.length !== listItem.itemId?.length) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'One or more items not found');
  }

  return await ListItem.create(listItem);
};

const getAllListItems = async (
  listId: string,
  query: Record<string, unknown>
) => {
  const { page, limit } = query;

  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const result = await ListItem.find({ listId })
    // .select('-userId -listId')
    .populate('itemId')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();
  const total = await ListItem.countDocuments({ listId });

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

export const ListItemsService = {
  createListItem,
  getAllListItems,
};
