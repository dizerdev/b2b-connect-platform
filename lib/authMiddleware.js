import { verifyToken } from './jwt';

export async function requireAuth(req) {
  const authHeader = req.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { isAuthorized: false, status: 401, message: 'Token não informado' };
  }

  const token = authHeader.split(' ')[1];

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
