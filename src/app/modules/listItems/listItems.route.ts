import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { ListItemsController } from './listItems.controller';

const router = express.Router();

router.post(
  '/add-item',
  auth(USER_ROLES.USER),
  ListItemsController.createListItem
);

router.get(
  '/get-items/:listId',
  auth(USER_ROLES.USER),
  ListItemsController.getAllListItems
);

router.patch(
  '/remove-item/:id',
  auth(USER_ROLES.USER),
  ListItemsController.removeListItem
);

export const ListItemsRoutes = router;
