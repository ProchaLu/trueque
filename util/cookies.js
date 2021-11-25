import { serialize } from 'cookie';
import Cookies from 'js-cookie';

export function createSerializedRegistersessionTokenCookie(token) {
  const isProduction = process.env.NODE_ENV === 'production';

  const maxAge = 60 * 100; // 5 for 100 = 5 min

  return serialize('sessionToken', token, {
    maxAge: maxAge,

    expires: new Date(Date.now() + maxAge * 1000),

    httpOnly: true,
    secure: isProduction,
    path: '/',
    sameSite: 'lax',
  });
}

export function getParsedCookie(key) {
  try {
    return JSON.parse(Cookies.get(key));
  } catch (err) {
    return undefined;
  }
}

export function setParsedCookie(key, value) {
  Cookies.set(key, JSON.stringify(value));
}
