import { PaymentController } from './payment.controller';
import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/create-payment',
  auth(USER_ROLES.USER),
  PaymentController.createPayment
);

router.post('/unsubscribe-user', PaymentController.unsubscribeUser);

export const PaymentRoutes = router;
