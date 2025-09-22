import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { List } from '../list/list.model';
import { IListItem } from './listItems.interface';
import { ListItem } from './listItems.model';
import { Item } from '../item/item.model';

const createListItem = async (
  listItem: Partial<IListItem>
): Promise<IListItem> => {
  const [list, item] = await Promise.all([
    List.findById(listItem.listId),
    Item.findById(listItem.itemId),
  ]);

  if (!list) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'List not found');
  }

  if (!item) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Item not found');
  }

  return await ListItem.create(listItem);
};

export const ListItemsService = {
  createListItem,
};
