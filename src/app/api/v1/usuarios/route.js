import db from 'lib/db';
import { requireAuth } from 'lib/authMiddleware';

export async function GET(req) {
  const auth = await requireAuth(req);

  if (!auth.isAuthorized) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }

  const { papel } = auth.payload;

  if (papel !== 'administrador') {
    return Response.json({ error: 'Acesso negado' }, { status: 403 });
  }

  try {
    const result = await db.query(`
      SELECT id, nome, email, papel, ativo, criado_em, vitrine_id
      FROM usuarios
      ORDER BY criado_em DESC
    `);

    return Response.json({ usuarios: result.rows });
  } catch (err) {
    console.error('Erro ao listar usuários:', err);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}
