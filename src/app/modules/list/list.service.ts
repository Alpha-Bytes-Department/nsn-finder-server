import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IList } from './list.interface';
import { List } from './list.model';
import { ListItem } from '../listItems/listItems.model';
import { sendEmail } from '../../../helpers/sendMail';

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

  const filters: any = { userId };
  if (query.status) {
    filters.status = query.status;
  }

  const result = await List.find(filters)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  const total = await List.countDocuments(filters);

  return {
    result,
    meta: {
      page: pages,
      limit: size,
      total,
    },
  };
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

const updateList = async (
  id: string,
  payload: Partial<IList & { addEmails?: string[]; removeEmails?: string[] }>
): Promise<IList | null> => {
  const isExistList = await List.findById(id);
  if (!isExistList) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'List not found');
  }

  const updateData: any = { ...payload };

  // Add multiple or single emails
  if (payload.addEmails && payload.addEmails.length > 0) {
    await List.findByIdAndUpdate(id, {
      $addToSet: { email: { $each: payload.addEmails } }, // avoids duplicates
    });
  }

  // Remove multiple or single emails
  if (payload.removeEmails && payload.removeEmails.length > 0) {
    await List.findByIdAndUpdate(id, {
      $pull: { email: { $in: payload.removeEmails } },
    });
  }

  // Update other fields (like name, etc.)
  const updatedList = await List.findByIdAndUpdate(
    id,
    {
      ...updateData,
      status: 'shared',
    },
    { new: true }
  );
  if (payload.addEmails?.length) {
    payload.addEmails.forEach(
      email =>
        sendEmail(
          email,
          'You have been added to a list',
          `Please log in to view the list: ${isExistList.name}`
        ).catch(console.error) // catch errors to avoid unhandled promise rejection
    );
  }

  return updatedList;
};

const getDetails = async (id: string) => {
  const isExistList = await List.findById(id);
  if (!isExistList) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'List not found');
  }
  return isExistList;
};

export const ListService = {
  createList,
  getMyLists,
  removeList,
  updateList,
  getDetails,
};
