import { NextApiRequest, NextApiResponse } from 'next';
import { deleteTradelistItemByTradelistId } from '../../../util/database';

export type RegisterRequest = {
  id: number;
  user_id: number;
  user_exchange_item_id: number;
  item_user_id: number;
  item_id: number;
};

export type Tradelist = {
  user_id: number;
  user_exchange_item_id: number;
  item_user_id: number;
  item_id: number;
};

export type RegisterResponse = { tradelist: Tradelist };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RegisterResponse>,
) {
  if (req.method === 'DELETE') {
    const deleteTradelistItem = await deleteTradelistItemByTradelistId(
      Number(req.query.tradelistId),
    );

    return res.status(200).json(deleteTradelistItem);
  }
  return res.status(405);
}
