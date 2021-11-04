import { NextApiRequest, NextApiResponse } from 'next';
import { deleteItemByItemId, Item, User } from '../../util/database';
import { Errors } from '../../util/types';

export type RegisterRequest = {
  id: number;
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

export default async function deleteItemHandler(
  req: NextApiRequest,
  res: NextApiResponse<RegisterResponse>,
) {
  try {
    const itemId = req.body.id;
    console.log(req.body);

    const deleteItem = await deleteItemByItemId({ itemId: itemId });

    if (!deleteItem) {
      res.status(500).send({ errors: [{ message: 'Item not delete' }] });
      return;
    }
  } catch (err) {
    res.status(500).send({ errors: [{ message: (err as Error).message }] });
  }
}
