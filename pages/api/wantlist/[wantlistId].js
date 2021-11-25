import {
  deleteWantlistItemByWantlistId,
  getWantlistbyItemUserId,
} from '../../../util/database';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const wantlistItem = await getWantlistbyItemUserId(
      Number(req.query.username),
    );
    return res.status(200).json(wantlistItem);
  } else if (req.method === 'DELETE') {
    const deleteWantlistItem = await deleteWantlistItemByWantlistId(
      Number(req.query.wantlistId),
    );

    return res.status(200).json(deleteWantlistItem);
  }
  return res.status(405);
}
