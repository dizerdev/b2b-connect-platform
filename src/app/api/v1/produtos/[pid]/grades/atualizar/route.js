import db from 'lib/db';
import { requireAuth } from 'lib/authMiddleware';

export async function PATCH(req, { params }) {
  const auth = await requireAuth(req);
  if (!auth.isAuthorized) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }

  const { sub: userId, papel } = auth.payload;
  const { pid: produtoId } = await params;
  const updates = await req.json();

  if (!Array.isArray(updates) || updates.length === 0) {
    return Response.json(
      { error: 'É necessário enviar um array com as grades' },
      { status: 400 }
    );
  }

  // Valida todos os objetos
  for (const grade of updates) {
    const { cor, tamanho, estoque } = grade;
    if (!cor || !tamanho || estoque === undefined) {
      return Response.json(
        { error: 'Cada grade deve conter cor, tamanho e estoque' },
        { status: 400 }
      );
    }
  }

  try {
    // Verifica se o produto_catalogo pertence ao usuário ou se é admin
    const res = await db.query(
      `
      SELECT pc.catalogo_id, c.fornecedor_id
      FROM produtos_catalogo pc
      JOIN catalogos c ON c.id = pc.catalogo_id
      JOIN produtos p ON p.id = pc.produto_id
      WHERE pc.produto_id = $1
    `,
      [produtoId]
    );

    if (res.rowCount === 0) {
      return Response.json(
        { error: 'Produto de catálogo não encontrado' },
        { status: 404 }
      );
    }

    const isAdmin = papel === 'administrador';
    const isDono = userId === res.rows[0].fornecedor_id;
    if (!isAdmin && !isDono) {
      return Response.json({ error: 'Acesso negado' }, { status: 403 });
    }

    // Atualiza uma por uma
    for (const grade of updates) {
      const { cor, tamanho, estoque } = grade;

      await db.query(
        `
        UPDATE grades
        SET estoque = $1
        WHERE produto_id = $2 AND cor = $3 AND tamanho = $4
      `,
        [estoque, produtoId, cor, tamanho]
      );
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error('Erro ao atualizar grades:', err);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}
