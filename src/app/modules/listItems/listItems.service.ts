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

export const ListItemsService = {
  createListItem,
};
