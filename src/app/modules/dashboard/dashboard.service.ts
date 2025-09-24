import { Payment } from '../payment/payment.model';
import { User } from '../user/user.model';

const getStatistics = async () => {
  const [totalUsers, freeUsers, paidUsers, ammount] = await Promise.all([
    User.countDocuments({}),
    User.countDocuments({ subscribed: false }),
    User.countDocuments({ subscribed: true }),
    Payment.countDocuments({ status: 'success' }),
  ]);

  return { totalUsers, freeUsers, paidUsers, ammount };
};

export const DashboardService = {
  getStatistics,
};
