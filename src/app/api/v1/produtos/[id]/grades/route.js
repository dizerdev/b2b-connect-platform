import { requireAuth } from 'lib/authMiddleware';
import db from 'lib/db';

export async function POST(req, { params }) {
  const auth = await requireAuth(req);
  if (!auth.isAuthorized) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }

  const { sub: userId, papel } = auth.payload;
  const { id: produtoCatalogoId } = await params;
  const { cor, tamanho, estoque } = await req.json();

  if (!cor || !tamanho || estoque === undefined) {
    return Response.json(
      { error: 'Campos cor, tamanho e estoque são obrigatórios' },
      { status: 400 }
    );
  }

  try {
    // Verifica se produto_catalogo existe e qual catálogo pertence
    const res = await db.query(
      `
      SELECT pc.catalogo_id, c.fornecedor_id
      FROM produtos_catalogo pc
      JOIN catalogos c ON c.id = pc.catalogo_id
      WHERE pc.id = $1
    `,
      [produtoCatalogoId]
    );

    if (res.rowCount === 0) {
      return Response.json(
        { error: 'Produto de catálogo não encontrado' },
        { status: 404 }
      );
    }

    const { catalogo_id, fornecedor_id } = res.rows[0];
    const isAdmin = papel === 'administrador';
    const isDono = userId === fornecedor_id;

    if (!isAdmin && !isDono) {
      return Response.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const insert = await db.query(
      `
      INSERT INTO grades (id, produto_catalogo_id, cor, tamanho, estoque, created_at)
      VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())
      RETURNING id, cor, tamanho, estoque, created_at
    `,
      [produtoCatalogoId, cor, tamanho, estoque]
    );

    return Response.json({ grade: insert.rows[0] }, { status: 201 });
  } catch (err) {
    console.error('Erro ao adicionar grade:', err);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}
