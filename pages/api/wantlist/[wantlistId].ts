import { NextApiRequest, NextApiResponse } from 'next';
import { deleteWantlistItemByWantlistId } from '../../../util/database';

export type RegisterRequest = {
  id: number;
  user_id: number;
  user_exchange_item_id: number;
  item_user_id: number;
  item_id: number;
};

export type Wantlist = {
  user_id: number;
  user_exchange_item_id: number;
  item_user_id: number;
  item_id: number;
};

export type RegisterResponse = { wantlist: Wantlist };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RegisterResponse>,
) {
  if (req.method === 'DELETE') {
    const deleteWantlistItem = await deleteWantlistItemByWantlistId(
      Number(req.query.wantlistId),
    );

    return res.status(200).json(deleteWantlistItem);
  }
  return res.status(405);
}
