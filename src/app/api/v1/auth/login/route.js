import db from 'lib/db';
import { verifyPassword } from 'lib/hash';
import { signToken } from 'lib/jwt';
import * as cookie from 'cookie';

export async function POST(req) {
  try {
    const { email, senha } = await req.json();

    if (!email || !senha) {
      return Response.json(
        { error: 'Credenciais obrigatórias' },
        { status: 400 }
      );
    }

    const result = await db.query(
      'SELECT * FROM usuarios WHERE email = $1 AND ativo = true',
      [email]
    );

    if (result.rowCount === 0) {
      return Response.json(
        { error: 'Usuário não encontrado' },
        { status: 401 }
      );
    }

    const usuario = result.rows[0];

    const senhaOk = await verifyPassword(senha, usuario.senha_hash); // você deve ter uma coluna `senha_hash`
    if (!senhaOk) {
      return Response.json({ error: 'Senha incorreta' }, { status: 401 });
    }

    const token = signToken({ sub: usuario.id, papel: usuario.papel });

    const setCookie = cookie.serialize('token', token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return new Response(
      JSON.stringify({
        token,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          papel: usuario.papel,
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': setCookie,
        },
      }
    );
  } catch (err) {
    console.error('Erro no login:', err);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}
