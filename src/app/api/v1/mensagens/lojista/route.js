import db from 'lib/db';
import { requireAuth } from 'lib/authMiddleware';

export async function GET(req) {
  const auth = await requireAuth(req);
  if (!auth.isAuthorized) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }

  const { sub: userId, papel } = auth.payload;

  if (papel !== 'lojista') {
    return Response.json({ error: 'Acesso negado' }, { status: 403 });
  }

  try {
    const result = await db.query(
      `
      SELECT 
        m.id,
        m.catalogo_id,
        c.nome AS catalogo_nome,
        m.mensagem,
        m.status,
        m.criado_em,
        ra.resposta,
        ra.created_at AS resposta_data_hora
      FROM mensagens m
      JOIN catalogos c ON c.id = m.catalogo_id
      LEFT JOIN respostas_admin ra ON ra.mensagem_id = m.id
      WHERE m.lojista_id = $1
      ORDER BY m.criado_em DESC
      LIMIT 50
    `,
      [userId]
    );

    return Response.json({ mensagens: result.rows }, { status: 200 });
  } catch (err) {
    console.error('Erro ao listar mensagens do lojista:', err);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}
