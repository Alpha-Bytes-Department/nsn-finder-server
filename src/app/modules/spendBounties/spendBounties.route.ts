import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { SpendBountiesController } from './spendBounties.controller';

const router = express.Router();

router.get(
  '/my-spent-bounties',
  auth(USER_ROLES.USER),
  SpendBountiesController.getAllSepndBounties
);

export const SpendBountiesRoutes = router;
