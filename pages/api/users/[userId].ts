import { NextApiRequest, NextApiResponse } from 'next';
import {
  deleteUserById,
  getUser,
  updateUserById,
} from '../../../util/database';

export type RegisterRequest = {
  id: number;
  username: string;
  name: number;
  mail: string;
  address: string;
};

export type User = {
  id: number;
  username: string;
  name: number;
  mail: string;
  address: string;
};

export type RegisterResponse = { user: User };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RegisterResponse>,
) {
  if (req.method === 'GET') {
    const user = await getUser(Number(req.query.userId));
    res.status(200).json(user);
  } else if (req.method === 'DELETE') {
    const deletedUser = await deleteUserById(Number(req.query.userId));
    return res.status(200).json(deletedUser);
  } else if (req.method === 'PATCH') {
    const body = req.body;
    const query = req.query;

    const updatedUser = await updateUserById(Number(req.query.userId), {
      name: body.name,
      mail: body.mail,
      address: body.address,
    });
    return res.status(200).json(updatedUser);
  }

  return res.status(405);
}
