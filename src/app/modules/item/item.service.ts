import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IItem, UpdateItemPayload } from './item.interface';
import { Item } from './item.model';
import unlinkFile from '../../../shared/unlinkFile';

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

const updateItem = async (id: string, payload: Partial<UpdateItemPayload>) => {
  const isExistItem = await Item.findById(id);
  if (!isExistItem) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Item not found');
  }

  if (payload.imagesToDelete && payload.imagesToDelete.length > 0) {
    for (let image of payload.imagesToDelete) {
      unlinkFile(image);
    }
  }

  isExistItem.image = isExistItem?.image?.filter(
    (img: string) => !payload.imagesToDelete?.includes(img)
  );

  const updatedImages = payload.image
    ? [...isExistItem.image, ...payload.image]
    : isExistItem.image;

  const updateData = {
    ...payload,
    image: updatedImages,
  };

  const result = await Item.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  return result;
};

const getMyItems = async (userId: any, query: Record<string, unknown>) => {
  const { page, limit, searchTerm, ...filterData } = query;

  const anyConditions: any[] = [];

  if (searchTerm) {
    anyConditions.push({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { status: { $regex: searchTerm, $options: 'i' } },
      ],
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.entries(filterData).map(
      ([field, value]) => ({ [field]: value })
    );
    anyConditions.push({ $and: filterConditions });
  }

  anyConditions.push({ userId });

  const whereConditions =
    anyConditions.length > 0 ? { $and: anyConditions } : {};

  // Pagination setup
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const result = await Item.find(whereConditions)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  const total = await Item.countDocuments(whereConditions);

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

const getItemsForAdmin = async (query: Record<string, unknown>) => {
  const { page, limit, searchTerm, ...filterData } = query;

  const anyConditions: any[] = [];

  if (searchTerm) {
    anyConditions.push({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { status: { $regex: searchTerm, $options: 'i' } },
      ],
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.entries(filterData).map(
      ([field, value]) => ({ [field]: value })
    );
    anyConditions.push({ $and: filterConditions });
  }

  const whereConditions =
    anyConditions.length > 0 ? { $and: anyConditions } : {};

  // Pagination setup
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const result = await Item.find(whereConditions)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  const total = await Item.countDocuments(whereConditions);

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

const getItemsEveryone = async (query: Record<string, unknown>) => {
  const { page, limit, searchTerm, sortBy, sortOrder, ...filterData } = query;

  const anyConditions: any[] = [];

  // Search by name
  if (searchTerm) {
    anyConditions.push({
      $or: [{ name: { $regex: searchTerm, $options: 'i' } }],
    });
  }

  // Filtering
  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.entries(filterData).map(
      ([field, value]) => ({ [field]: value })
    );
    anyConditions.push({ $and: filterConditions });
  }

  const whereConditions =
    anyConditions.length > 0 ? { $and: anyConditions } : {};

  // Pagination setup
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  // ✅ Handle dynamic sorting
  let sortCondition: Record<string, 1 | -1> = { createdAt: -1 }; // default

  if (sortBy) {
    sortCondition = {
      [sortBy as string]: sortOrder === 'asc' ? 1 : -1,
    };
  }

  const result = await Item.find(whereConditions)
    .sort(sortCondition)
    .skip(skip)
    .limit(size)
    .lean();

  const total = await Item.countDocuments(whereConditions);

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

export const ItemService = {
  createItem,
  updateItem,
  getMyItems,
  getItemsForAdmin,
  getItemsEveryone,
};
