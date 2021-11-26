import { NextApiRequest, NextApiResponse } from 'next';
import {
  deleteUserById,
  getUser,
  getValidSessionByToken,
  updateUserById,
} from '../../../util/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const token = req.cookies.sessionToken;
  const session = await getValidSessionByToken(token);

  if (!session) {
    res.status(404).send({
      errors: [{ message: 'Not a valid Session' }],
    });
    return;
  } else {
    if (req.method === 'GET' && session.userId === Number(req.query.userId)) {
      const user = await getUser(Number(req.query.userId));
      res.status(200).json(user);
    } else if (
      req.method === 'DELETE' &&
      session.userId === Number(req.query.userId)
    ) {
      const deletedUser = await deleteUserById(Number(req.query.userId));
      return res.status(200).json(deletedUser);
    } else if (
      req.method === 'PATCH' &&
      session.userId === Number(req.query.userId)
    ) {
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

    return res.status(405).end();
  }
}
