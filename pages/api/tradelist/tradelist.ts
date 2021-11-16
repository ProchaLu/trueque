import { NextApiRequest, NextApiResponse } from 'next';
import { insertItemtoTradelist, Item, User } from '../../../util/database';
import { Errors } from '../../../util/types';

export type RegisterRequest = {
  userId: number;
  userExchangeItemId: number;
  itemUserId: number;
  itemId: number;
};

export type RegisterResponse =
  | { errors: Errors }
  | { user: User }
  | { item: Item };

export default async function addTradelistHandler(
  req: NextApiRequest,
  res: NextApiResponse<RegisterResponse>,
) {
  try {
    const userId = req.body.userId;

    const userExchangeItemId = req.body.userExchangeItemId;

    const itemUserId = req.body.itemUserId;

    const itemId = req.body.itemId;

    const wantlist = await insertItemtoTradelist({
      userId: userId,
      userExchangeItemId: userExchangeItemId,
      itemUserId: itemUserId,
      itemId: itemId,
    });

    if (!wantlist) {
      res.status(500).send({ errors: [{ message: 'Item not in wantlist' }] });
      return;
    }
  } catch (err) {
    res.status(500).send({ errors: [{ message: (err as Error).message }] });
  }
}
