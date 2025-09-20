import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IItem, UpdateItemPayload } from './item.interface';
import { Item } from './item.model';
import unlinkFile from '../../../shared/unlinkFile';
import { sendEmail } from '../../../helpers/sendMail';
import { Bounties } from '../bounties/bounties.model';
import { User } from '../user/user.model';

const createItem = async (payload: IItem) => {
  // Check if user exists and is subscribed
  const user = await User.findById(payload.userId).select('subscribed').lean();
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }
  if (!user.subscribed) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'You need to subscribe first to add an item'
    );
  }

  // Check if item with the same name already exists for this user
  const existingItem = await Item.findOne({
    userId: payload.userId,
    name: payload.name,
  }).lean();

  if (existingItem) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Item with name ${payload.name} already exists`
    );
  }

  // Create new item
  return await Item.create(payload);
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

  const anyConditions: any[] = [{ status: 'approved' }];

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
  let sortCondition: Record<string, 1 | -1> = { createdAt: -1 };

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

const updateStatus = async (
  id: string,
  payload: Partial<UpdateItemPayload>
) => {
  // Update and populate user in one query
  const updatedItem = await Item.findByIdAndUpdate(
    id,
    { status: payload.status },
    { new: true, runValidators: true }
  ).populate('userId');

  if (!updatedItem) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Item not found');
  }

  const user: any = updatedItem.userId;

  // Prepare email data
  let subject = '';
  let body = '';

  if (updatedItem.status === 'approved') {
    subject = 'Your Item Has Been Approved';
    body = `
      Dear ${user?.name || 'User'},
      
      Congratulations, and thank you for your contribution!
    `;

    // Increment or create new bounties document
    await Bounties.findOneAndUpdate(
      { userId: user?._id }, // filter by userId
      { $inc: { value: 2 } }, // increment value
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
  }

  if (updatedItem.status === 'rejected') {
    subject = 'Your Item Has Been Rejected';
    body = `
      Dear ${user?.name || 'User'},
      
      Unfortunately, your item submission has been rejected. 
      If you have any questions, feel free to contact our support team.
    `;
  }

  // Fire-and-forget (non-blocking)
  if (subject && body) {
    sendEmail(user?.email, subject, body).catch(err => {
      console.error('Email sending failed:', err);
    });
  }

  // Return immediately
  return updatedItem;
};

export const ItemService = {
  createItem,
  updateItem,
  getMyItems,
  getItemsForAdmin,
  getItemsEveryone,
  updateStatus,
};
