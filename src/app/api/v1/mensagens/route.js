import db from 'lib/db';
import { requireAuth } from 'lib/authMiddleware';

export async function GET(req) {
  const auth = await requireAuth(req);
  if (!auth.isAuthorized) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }

  if (auth.payload.papel !== 'administrador') {
    return Response.json({ error: 'Acesso negado' }, { status: 403 });
  }

  try {
    const result = await db.query(
      `
      SELECT 
        m.id,
        m.catalogo_id,
        c.nome AS catalogo_nome,
        m.lojista_id,
        u.nome AS lojista_nome,
        m.mensagem,
        m.status,
        m.created_at
      FROM mensagens_contato m
      JOIN catalogos c ON c.id = m.catalogo_id
      JOIN usuarios u ON u.id = m.lojista_id
      ORDER BY m.created_at ASC
    `
    );

    return Response.json(result.rows, { status: 200 });
  } catch (err) {
    console.error('Erro ao listar mensagens:', err);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}
