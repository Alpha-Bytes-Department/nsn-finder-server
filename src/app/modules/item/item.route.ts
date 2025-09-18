import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import { createItemSchema } from './item.validation';
import { ItemController } from './item.controller';

const router = express.Router();

router.post(
  '/create',
  fileUploadHandler,
  auth(USER_ROLES.USER),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = createItemSchema.parse(JSON.parse(req.body.data));
    }
    return ItemController.createItem(req, res, next);
  }
);

export const ItemRoutes = router;
