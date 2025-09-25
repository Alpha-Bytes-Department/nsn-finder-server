import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { DashboardController } from './dashboard.controller';

const router = express.Router();

router.get(
  '/get-statistics',
  auth(USER_ROLES.ADMIN, USER_ROLES.MODERATOR),
  DashboardController.getStatistics
);

router.get(
  '/get-earning-chart-data',
  auth(USER_ROLES.ADMIN, USER_ROLES.MODERATOR),
  DashboardController.getEarningChartData
);

export const DashboardRoutes = router;
