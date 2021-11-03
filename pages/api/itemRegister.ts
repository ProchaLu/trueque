import { NextApiRequest, NextApiResponse } from 'next';
import { insertItem, Item, User } from '../../util/database';
import { Errors } from '../../util/types';

export type RegisterRequest = {
  itemName: string;
  userId: number;
  itemPrice: number;
  image: string;
  description: string;
  priceRange: number;
};

export type RegisterResponse =
  | { errors: Errors }
  | { user: User }
  | { item: Item };

export default async function addItemHandler(
  req: NextApiRequest,
  res: NextApiResponse<RegisterResponse>,
) {
  if (!req.body.itemName || !req.body.image || !req.body.itemPrice) {
    res.status(400).send({
      errors: [
        {
          message:
            'Request does not contain Item Name, Price, Price Range and Image',
        },
      ],
    });
    return;
  }
  try {
    const itemName = req.body.itemName;

    const userId = req.body.userId;

    const image = req.body.image;

    const itemPrice = req.body.itemPrice;

    const priceRange = req.body.priceRange;

    const description = req.body.description;

    const item = await insertItem({
      itemName: itemName,
      userId: userId,
      image: image,
      itemPrice: itemPrice,
      priceRange: priceRange,
      description: description,
    });

    if (!item) {
      res.status(500).send({ errors: [{ message: 'Item not create' }] });
      return;
    }
  } catch (err) {
    res.status(500).send({ errors: [{ message: (err as Error).message }] });
  }
}
