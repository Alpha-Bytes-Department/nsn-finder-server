import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { ListController } from './list.controller';

const router = express.Router();

router.post('/create-list', auth(USER_ROLES.USER), ListController.createList);

router.get('/my-lists', auth(USER_ROLES.USER), ListController.getMyLists);

export const ListRoutes = router;
