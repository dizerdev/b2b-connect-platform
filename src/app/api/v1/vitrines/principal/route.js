import db from 'lib/db';
import { requireAuth } from 'lib/authMiddleware';

export async function GET(req) {
  const auth = await requireAuth(req);
  if (!auth.isAuthorized) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }

  try {
    const result = await db.query(
      `
      SELECT 
        c.id,
        c.nome,
        c.status,
        c.rating,
        c.fornecedor_id,
        f.nome_fantasia AS fornecedor_nome
      FROM catalogos c
      JOIN usuarios f ON f.id = c.fornecedor_id
      LEFT JOIN (
        SELECT 
            catalogo_id, 
            array_agg(DISTINCT especificacao) AS especificacoes
        FROM catalogo_metadados
        GROUP BY catalogo_id
      ) m ON m.catalogo_id = c.id
      LEFT JOIN ordenacao_manual om ON om.catalogo_id = c.id
      WHERE c.status = 'publicado'
      ORDER BY om.posicao ASC NULLS LAST, c.rating DESC NULLS LAST, c.nome ASC
    `
    );

    return Response.json({ catalogos: result.rows });
  } catch (err) {
    console.error('Erro ao buscar vitrine principal:', err);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}
