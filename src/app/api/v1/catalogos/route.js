import db from 'lib/db';
import { requireAuth } from 'lib/authMiddleware';

export async function GET(req) {
  const auth = await requireAuth(req);
  if (!auth.isAuthorized) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status'); // pendente_aprovacao | aprovado | publicado
  const limit = parseInt(searchParams.get('limit')) || 50;

  const filters = [];
  const values = [];
  let i = 1;

  // validação do status
  if (status) {
    const allowedStatuses = ['pendente_aprovacao', 'aprovado', 'publicado'];
    if (!allowedStatuses.includes(status)) {
      return Response.json({ error: 'Status inválido' }, { status: 400 });
    }
    filters.push(`c.status = $${i++}`);
    values.push(status);
  }

  const where = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

  try {
    const result = await db.query(
      `
      SELECT 
        c.id,
        c.nome,
        c.status,
        c.rating,
        c.fornecedor_id,
        f.nome AS fornecedor_nome
      FROM catalogos c
      JOIN usuarios f ON f.id = c.fornecedor_id
      ${where}
      ORDER BY c.rating DESC NULLS LAST, c.nome ASC
      LIMIT $${i}
      `,
      [...values, limit]
    );

    return Response.json({ catalogos: result.rows });
  } catch (err) {
    console.error('Erro ao buscar catálogos por status:', err);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}
