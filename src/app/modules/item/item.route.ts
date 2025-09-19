import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import { createItemSchema, updateItemSchema } from './item.validation';
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

router.patch(
  '/update/:id',
  auth(USER_ROLES.USER),
  fileUploadHandler,
  (req: Request, res: Response, next: NextFunction) => {
    const { imagesToDelete, data } = req.body;

    if (!data && imagesToDelete) {
      req.body = { imagesToDelete };
      return ItemController.updateItem(req, res, next);
    }

    if (data) {
      const parsedData = updateItemSchema.parse(JSON.parse(data));

      req.body = { ...parsedData, imagesToDelete };
    }

    return ItemController.updateItem(req, res, next);
  }
);

router.get('/my-items', auth(USER_ROLES.USER), ItemController.getMyItems);

router.get(
  '/everyone-items',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  ItemController.getItemsEveryone
);

router.get(
  '/get-items-for-admin',
  auth(USER_ROLES.ADMIN),
  ItemController.getItemsForAdmin
);

router.patch(
  '/update-status/:id',
  auth(USER_ROLES.ADMIN),
  ItemController.updateStatus
);

export const ItemRoutes = router;
