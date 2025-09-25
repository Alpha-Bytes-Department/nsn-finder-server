import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { User } from '../user/user.model';
import { IPayment } from './payment.interface';
import { Payment } from './payment.model';

const createPayment = async (payload: IPayment) => {
  const payment = await Payment.create(payload);

  if (payload.status === 'success') {
    await User.findByIdAndUpdate(payload.userId, { subscribed: true });
  }

  return payment;
};

const unsubscribeUser = async () => {
  const currentDate = new Date();

  try {
    // Find all expired subscriptions
    const expiredSubscriptions = await Payment.find({
      endDate: { $lt: currentDate },
    });

    if (!expiredSubscriptions.length) {
      return;
    }

    // Extract user IDs from expired subscriptions
    const expiredUserIds = expiredSubscriptions.map(sub => sub.userId);

    // Update all users' subscription status to false
    await User.updateMany(
      { _id: { $in: expiredUserIds } },
      { $set: { subscribed: false } }
    );
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Error updating subscriptions');
  }
};

const getTotalPayment = async () => {
  const [totalPayment] = await Promise.all([
    Payment.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, total: { $sum: '$price' } } },
      { $project: { _id: 0, total: 1 } },
    ]),
  ]);

  return totalPayment;
};

const getAllPayment = async (query: Record<string, unknown>) => {
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

  const result = await Payment.find(whereConditions)
    .populate({
      path: 'userId',
      select: 'name email image',
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  const total = await Payment.countDocuments(whereConditions);

  return {
    result,
    meta: {
      page: pages,
      limit: size,
      total,
    },
  };
};

export const PaymentService = {
  createPayment,
  unsubscribeUser,
  getTotalPayment,
  getAllPayment,
};
