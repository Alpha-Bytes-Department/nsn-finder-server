import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { DashboardController } from './dashboard.controller';

const router = express.Router();

router.get(
  '/get-statistics',
  auth(USER_ROLES.ADMIN),
  DashboardController.getStatistics
);

export const DashboardRoutes = router;
