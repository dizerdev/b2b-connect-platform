import db from 'lib/db';
import { requireAuth } from 'lib/authMiddleware';

export async function GET(req) {
  const auth = await requireAuth(req);
  if (!auth.isAuthorized) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }

  const { searchParams } = new URL(req.url);
  const continente = searchParams.get('continente');
  const pais = searchParams.get('pais');
  const categoria = searchParams.get('categoria');
  const especificacao = searchParams.get('especificacao');

  const filters = [];
  const values = [];
  let i = 1;

  if (continente) {
    filters.push(`m.continente = $${i++}`);
    values.push(continente);
  }
  if (pais) {
    filters.push(`m.pais = $${i++}`);
    values.push(pais);
  }
  if (categoria) {
    filters.push(`m.categoria = $${i++}`);
    values.push(categoria);
  }
  if (especificacao) {
    filters.push(`m.especificacao = $${i++}`);
    values.push(especificacao);
  }

  const where = filters.length > 0 ? `AND ${filters.join(' AND ')}` : '';

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
      LEFT JOIN catalogo_metadados m ON m.catalogo_id = c.id
      LEFT JOIN ordenacao_manual om ON om.catalogo_id = c.id
      WHERE c.status = 'publicado'
      ${where}
      ORDER BY om.posicao ASC NULLS LAST, c.rating DESC NULLS LAST, c.nome ASC
    `,
      values
    );

    return Response.json({ catalogos: result.rows });
  } catch (err) {
    console.error('Erro ao buscar vitrine principal:', err);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}
