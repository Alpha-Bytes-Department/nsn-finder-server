import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IItem, UpdateItemPayload } from './item.interface';
import { Item } from './item.model';
import unlinkFile from '../../../shared/unlinkFile';

const createItem = async (payload: IItem) => {
  const isExist = await Item.findOne({
    userId: payload.userId,
    name: payload.name,
  });

  if (isExist) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Item with name ${payload.name} already exists`
    );
  }

  const item = await Item.create(payload);
  return item;
};

const updateItem = async (id: string, payload: Partial<UpdateItemPayload>) => {
  const isExistItem = await Item.findById(id);
  if (!isExistItem) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Item not found');
  }

  if (payload.imagesToDelete && payload.imagesToDelete.length > 0) {
    for (let image of payload.imagesToDelete) {
      unlinkFile(image);
    }
  }

  isExistItem.image = isExistItem?.image?.filter(
    (img: string) => !payload.imagesToDelete?.includes(img)
  );

  const updatedImages = payload.image
    ? [...isExistItem.image, ...payload.image]
    : isExistItem.image;

  const updateData = {
    ...payload,
    image: updatedImages,
  };

  const result = await Item.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  return result;
};

export const ItemService = {
  createItem,
  updateItem,
};
