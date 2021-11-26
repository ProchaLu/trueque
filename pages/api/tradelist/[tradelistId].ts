import { NextApiRequest, NextApiResponse } from 'next';
import { deleteTradelistItemByTradelistId } from '../../../util/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'DELETE') {
    const deleteTradelistItem = await deleteTradelistItemByTradelistId(
      Number(req.query.tradelistId),
    );

    return res.status(200).json(deleteTradelistItem);
  }
  return res.status(405);
}
