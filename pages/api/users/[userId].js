import {
  deleteUserById,
  getUser,
  updateUserById,
} from '../../../util/database';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const user = await getUser(Number(req.query.userId));
    res.status(200).json(user);
  } else if (req.method === 'DELETE') {
    const deletedUser = await deleteUserById(Number(req.query.userId));
    return res.status(200).json(deletedUser);
  } else if (req.method === 'PATCH') {
    const body = req.body;
    /*  const query = req.query; */

    const updatedUser = await updateUserById(Number(req.query.userId), {
      name: body.name,
      mail: body.mail,
      address: body.address,
      lat: body.lat,
      lng: body.lng,
    });
    return res.status(200).json(updatedUser);
  }

  return res.status(405);
}
