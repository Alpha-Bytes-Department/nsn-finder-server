import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { BountiesController } from './bounties.controller';

const router = express.Router();

router.get(
  '/my-bounties',
  auth(USER_ROLES.USER),
  BountiesController.getMyBounties
);

router.post(
  '/spend-bounty/:id',
  auth(USER_ROLES.USER),
  BountiesController.spendBounty
);

export const BountiesRoutes = router;
