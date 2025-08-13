import db from 'lib/db';
import { requireAuth } from 'lib/authMiddleware';

export async function GET(req) {
  const auth = await requireAuth(req);
  if (!auth.isAuthorized) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }

  const { sub: userId } = auth.payload;
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const limit = parseInt(searchParams.get('limit')) || 50;

  const filters = [`c.fornecedor_id = $1`];
  const values = [userId];
  let i = 2;

  if (status) {
    const allowedStatuses = ['pendente_aprovacao', 'aprovado', 'publicado'];
    if (!allowedStatuses.includes(status)) {
      return Response.json({ error: 'Status inválido' }, { status: 400 });
    }
    filters.push(`c.status = $${i++}`);
    values.push(status);
  }

  const where = `WHERE ${filters.join(' AND ')}`;
  console.log(where);
  console.log(values);
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
      LIMIT $${i++}
      `,
      [...values, limit]
    );

    return Response.json({ catalogos: result.rows });
  } catch (err) {
    console.error('Erro ao buscar catálogos do usuário:', err);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}
