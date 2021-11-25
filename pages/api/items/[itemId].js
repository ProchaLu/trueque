import {
  deleteItemByItemId,
  getItemByItemId,
  updateItemByItemId,
} from '../../../util/database';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const item = await getItemByItemId(Number(req.query.id));
    res.status(200).json(item);
  } else if (req.method === 'DELETE') {
    const deletedItem = await deleteItemByItemId(Number(req.query.itemId));
    return res.status(200).json(deletedItem);
  } else if (req.method === 'PATCH') {
    const body = req.body;
    /* const query = req.query; */

    const updatedItem = await updateItemByItemId(Number(req.query.itemId), {
      itemName: body.itemName,
      itemPrice: body.itemPrice,
      priceRange: body.priceRange,
      description: body.description,
    });

    return res.status(200).json(updatedItem);
  }

  return res.status(405);
}
