import { months } from '../../../helpers/month';
import { Payment } from '../payment/payment.model';
import { User } from '../user/user.model';

const getStatistics = async () => {
  const [totalUsers, freeUsers, paidUsers, ammount] = await Promise.all([
    User.countDocuments({}),
    User.countDocuments({ subscribed: false }),
    User.countDocuments({ subscribed: true }),
    Payment.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, total: { $sum: '$price' } } },
      { $project: { _id: 0, total: 1 } },
    ]),
  ]);

  return { totalUsers, freeUsers, paidUsers, ammount };
};

const getEarningChartData = async () => {
  const matchConditions = { status: { $in: ['success'] } };

  const result = await Payment.aggregate([
    { $match: matchConditions },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        totalAmount: { $sum: '$price' },
      },
    },
    {
      $addFields: {
        month: {
          $arrayElemAt: [
            [
              '',
              'Jan',
              'Feb',
              'Mar',
              'Apr',
              'May',
              'Jun',
              'Jul',
              'Aug',
              'Sep',
              'Oct',
              'Nov',
              'Dec',
            ],
            '$_id.month',
          ],
        },
        year: '$_id.year',
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    {
      $group: {
        _id: '$year',
        earnings: {
          $push: {
            month: '$month',
            totalAmount: '$totalAmount',
          },
        },
      },
    },
    {
      $addFields: {
        allMonths: months,
      },
    },
    {
      $project: {
        earnings: {
          $map: {
            input: '$allMonths',
            as: 'month',
            in: {
              $let: {
                vars: {
                  monthData: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: '$earnings',
                          as: 'item',
                          cond: { $eq: ['$$item.month', '$$month'] },
                        },
                      },
                      0,
                    ],
                  },
                },
                in: {
                  month: '$$month',
                  totalAmount: { $ifNull: ['$$monthData.totalAmount', 0] },
                },
              },
            },
          },
        },
      },
    },
  ]);

  return result;
};

export const DashboardService = {
  getStatistics,
  getEarningChartData,
};
