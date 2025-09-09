'use server';

import db from 'lib/db';

export async function GET(req, { params }) {
  try {
    const { token } = await params;

    if (!token) {
      return Response.json({ error: 'Token é obrigatório' }, { status: 400 });
    }

    // Busca token na tabela
    const result = await db.query(
      `
      SELECT id, usuario_id, token, expires_at, usado
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

    // Token válido
    return Response.json(
      { message: 'Token válido', userId: reset.usuario_id },
      { status: 200 }
    );
  } catch (err) {
    console.error('Erro ao validar token de reset:', err);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}
