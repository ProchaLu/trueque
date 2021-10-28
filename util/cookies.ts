import { serialize } from 'cookie';

export function createSerializedRegisterSessionTokenCookie(token: string) {
  const isProduction = process.env.NODE_ENV === 'production';

  const maxAge = 60 * 5; // 5min

  return serialize('sessionTokenRegister', token, {
    maxAge: maxAge,

    expires: new Date(Date.now() + maxAge * 1000),

    httpOnly: true,
    secure: isProduction,
    path: '/',
    sameSite: 'lax',
  });
}
