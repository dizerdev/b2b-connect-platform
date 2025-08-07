import { verifyToken } from './jwt';
import * as cookie from 'cookie';

export async function requireAuth(req) {
  let token = null;

  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    const cookieHeader = req.headers.get('cookie');
    if (cookieHeader) {
      const cookies = cookie.parse(cookieHeader);
      token = cookies.token;
    }
  }

  if (!token) {
    return { isAuthorized: false, status: 401, message: 'Token não informado' };
  }

  try {
    const payload = verifyToken(token);
    return { isAuthorized: true, payload };
  } catch (err) {
    return {
      isAuthorized: false,
      status: 401,
      message: 'Token inválido ou expirado',
    };
  }
}
