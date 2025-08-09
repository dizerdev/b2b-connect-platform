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
  const especificacoes = searchParams.getAll('especificacao'); // array de strings, pode estar vazio
  const limit = parseInt(searchParams.get('limit')) || 50;

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
  if (especificacoes.length > 0) {
    // monta OR entre as especificações para buscar qualquer uma delas
    const especFilters = especificacoes.map(
      (_, idx) => `
      EXISTS (
        SELECT 1 FROM jsonb_array_elements_text(m.especificacao) elem
        WHERE elem ILIKE '%' || $${i + idx} || '%'
      )
    `
    );
    filters.push(`(${especFilters.join(' OR ')})`);
    values.push(...especificacoes);
    i += especificacoes.length;
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
        f.nome AS fornecedor_nome,
        m.*
      FROM catalogos c
      JOIN usuarios f ON f.id = c.fornecedor_id
      LEFT JOIN catalogo_metadados m ON m.catalogo_id = c.id
      WHERE c.status = 'publicado'
      ${where}
      ORDER BY c.rating DESC NULLS LAST, c.nome ASC
      LIMIT $${i}
      `,
      [...values, limit]
    );
    console.log(where);
    console.log(values);
    return Response.json({ catalogos: result.rows });
  } catch (err) {
    console.error('Erro ao buscar catálogos:', err);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}
