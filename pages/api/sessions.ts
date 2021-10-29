import { NextApiRequest, NextApiResponse } from 'next';
import { getValidSessionByToken } from '../../util/database';
import { Errors } from '../../util/types';

export type SessionsResponse = { errors: Errors } | { valid: boolean };

export default async function sessionHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const sessionToken = req.cookies.sessionToken;

  if (!sessionToken) {
    res.status(400).send({
      errors: [{ message: "Request doesn't contain sessionToken cookie" }],
    });
    return;
  }

  const validSession = await getValidSessionByToken(sessionToken);

  if (!validSession) {
    res.status(404).send({ valid: false });
    return;
  }

  res.send({ valid: true });
}
