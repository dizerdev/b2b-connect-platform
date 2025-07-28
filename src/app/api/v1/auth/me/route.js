import { requireAuth } from 'lib/authMiddleware';
import db from 'lib/db';

export async function GET(req) {
  const auth = await requireAuth(req);

  if (!auth.isAuthorized) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }

  const { sub: userId } = auth.payload;

  try {
    const result = await db.query(
      `SELECT id, email, nome, papel, vitrine_id
       FROM usuarios
       WHERE id = $1 AND ativo = true`,
      [userId]
    );

    if (result.rowCount === 0) {
      return Response.json(
        { error: 'Usuário não encontrado ou inativo' },
        { status: 404 }
      );
    }

    return Response.json({ usuario: result.rows[0] });
  } catch (err) {
    console.error('Erro ao buscar usuário:', err);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}
