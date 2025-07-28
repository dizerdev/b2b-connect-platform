import db from 'lib/db';
import { requireAuth } from 'lib/authMiddleware';

export async function POST(req, { params }) {
  const auth = await requireAuth(req);
  if (!auth.isAuthorized) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }

  const { sub: userId, papel } = auth.payload;
  const { id: catalogoId } = await params;
  const { nome, descricao } = await req.json();

  if (!nome) {
    return Response.json(
      { error: 'Nome da coleção é obrigatório' },
      { status: 400 }
    );
  }

  try {
    const catalogoRes = await db.query(
      `
      SELECT id, fornecedor_id
      FROM catalogos
      WHERE id = $1
    `,
      [catalogoId]
    );

    if (catalogoRes.rowCount === 0) {
      return Response.json(
        { error: 'Catálogo não encontrado' },
        { status: 404 }
      );
    }

    const catalogo = catalogoRes.rows[0];
    const isAdmin = papel === 'administrador';
    const isDono = userId === catalogo.fornecedor_id;

    if (!isAdmin && !isDono) {
      return Response.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const insert = await db.query(
      `
      INSERT INTO colecoes (id, catalogo_id, nome, descricao, created_at)
      VALUES (gen_random_uuid(), $1, $2, $3, NOW())
      RETURNING id, catalogo_id, nome, descricao, created_at
    `,
      [catalogoId, nome, descricao || null]
    );

    return Response.json({ colecao: insert.rows[0] }, { status: 201 });
  } catch (err) {
    console.error('Erro ao adicionar coleção:', err);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}
