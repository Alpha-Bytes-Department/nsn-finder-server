import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { NotificationRoutes } from '../app/modules/Notification/Notification.route';
import { ItemRoutes } from '../app/modules/item/item.route';
import { BountiesRoutes } from '../app/modules/bounties/bounties.route';
import { SpendBountiesRoutes } from '../app/modules/spendBounties/spendBounties.route';
import { ListRoutes } from '../app/modules/list/list.route';
import { ListItemsRoutes } from '../app/modules/listItems/listItems.route';
import { PaymentRoutes } from '../app/modules/payment/payment.route';
import { DashboardRoutes } from '../app/modules/dashboard/dashboard.route';

const router = express.Router();

const apiRoutes = [
  { path: '/user', route: UserRoutes },
  { path: '/auth', route: AuthRoutes },
  { path: '/notification', route: NotificationRoutes },
  { path: '/item', route: ItemRoutes },
  { path: '/bounty', route: BountiesRoutes },
  { path: '/spend-bounty', route: SpendBountiesRoutes },
  { path: '/list', route: ListRoutes },
  { path: '/list-item', route: ListItemsRoutes },
  { path: '/payment', route: PaymentRoutes },
  { path: '/dashboard', route: DashboardRoutes },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
