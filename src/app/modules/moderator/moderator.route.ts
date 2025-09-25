import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import { UserValidation } from '../user/user.validation';
import { ModeratorController } from './moderator.controller';

const router = express.Router();

router.post(
  '/create-user',
  fileUploadHandler,
  auth(USER_ROLES.ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = UserValidation.createUserZodSchema.parse(
        JSON.parse(req.body.data)
      );
    }
    return ModeratorController.createModerator(req, res, next);
  }
);

router.get(
  '/get-all-moderators',
  auth(USER_ROLES.ADMIN),
  ModeratorController.getAllModerators
);

export const ModeratorRoutes = router;
