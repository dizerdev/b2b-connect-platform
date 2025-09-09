// /app/api/v1/auth/reset-password/route.js

import db from 'lib/db';
import bcrypt from 'bcrypt';

export async function POST(req) {
  try {
    const { token, novaSenha } = await req.json();

    if (!token || !novaSenha) {
      return Response.json(
        { error: 'Token e nova senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Busca o token
    const result = await db.query(
      `
      SELECT id, usuario_id, expires_at, usado
      FROM password_resets
      WHERE token = $1
      LIMIT 1
    `,
      [token]
    );

    if (result.rows.length === 0) {
      return Response.json({ error: 'Token inválido' }, { status: 400 });
    }

    const reset = result.rows[0];

    // Valida expiração
    if (new Date(reset.expires_at) < new Date()) {
      return Response.json({ error: 'Token expirado' }, { status: 410 });
    }

    // Valida se já foi usado
    if (reset.usado) {
      return Response.json({ error: 'Token já utilizado' }, { status: 410 });
    }

    // Hash da nova senha
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(novaSenha, salt);

    // Atualiza a senha do usuário
    await db.query(
      `
      UPDATE usuarios
      SET senha_hash = $1, atualizado_em = NOW()
      WHERE id = $2
    `,
      [hash, reset.usuario_id]
    );

    // Marca o token como usado
    await db.query(
      `
      UPDATE password_resets
      SET usado = true
      WHERE id = $1
    `,
      [reset.id]
    );

    return Response.json(
      { message: 'Senha redefinida com sucesso' },
      { status: 200 }
    );
  } catch (err) {
    console.error('Erro ao redefinir senha:', err);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}
