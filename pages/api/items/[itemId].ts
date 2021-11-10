import { NextApiRequest, NextApiResponse } from 'next';
import { deleteItemByItemId, getItemByItemId } from '../../../util/database';

export type RegisterRequest = {
  id: number;
  itemName: string;
  userId: number;
  itemPrice: number;
  image: string;
  description: string;
  priceRange: number;
};

export type Item = {
  id: number;
  itemName: string;
  userId: number;
  itemPrice: number;
  image: string;
  description: string;
  priceRange: number;
};

export type RegisterResponse = { item: Item };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RegisterResponse>,
) {
  if (req.method === 'GET') {
    const item = await getItemByItemId(Number(req.query.id));
    res.status(200).json(item);
  } else if (req.method === 'DELETE') {
    const deletedItem = await deleteItemByItemId(req.query.itemId);
    return res.status(200).json(deletedItem);
  }

  return res.status(405);
}

/* import { NextApiRequest, NextApiResponse } from 'next';
import { deleteItemByItemId, Item, User } from '../../../util/database';
import { Errors } from '../../../util/types';

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
  itemId: number,
) {
  try {
    const deleteItem = await deleteItemByItemId(itemId);

    if (!deleteItem) {
      res
        .status(500)
        .send({ errors: [{ message: 'Item not able to delete' }] });
      return;
    }
  } catch (err) {
    res.status(500).send({ errors: [{ message: (err as Error).message }] });
  }
}
 */
