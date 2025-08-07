import db from 'lib/db';
import { requireAuth } from 'lib/authMiddleware';

export async function POST(req, { params }) {
  const auth = await requireAuth(req);
  if (!auth.isAuthorized) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }

  const { sub: userId, papel } = auth.payload;
  const { pid: produtoCatalogoId } = await params;

  let grades;
  try {
    grades = await req.json();
  } catch {
    return Response.json({ error: 'JSON inválido' }, { status: 400 });
  }

  if (!Array.isArray(grades) || grades.length === 0) {
    return Response.json(
      { error: 'Deve enviar uma lista de grades' },
      { status: 400 }
    );
  }

  for (const g of grades) {
    if (!g.cor || !g.tamanho || typeof g.estoque !== 'number') {
      return Response.json(
        { error: 'Cada grade deve ter cor, tamanho e estoque' },
        { status: 400 }
      );
    }
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

    const { fornecedor_id } = res.rows[0];
    const isAdmin = papel === 'administrador';
    const isDono = userId === fornecedor_id;

    if (!isAdmin && !isDono) {
      return Response.json({ error: 'Acesso negado' }, { status: 403 });
    }

    // Insere as grades
    const values = grades
      .map((g, i) => `($1, $${i * 3 + 2}, $${i * 3 + 3}, $${i * 3 + 4})`)
      .join(', ');

    const flatValues = grades.flatMap((g) => [g.cor, g.tamanho, g.estoque]);

    const query = `
      INSERT INTO grades (produto_catalogo_id, cor, tamanho, estoque)
      VALUES ${values}
      ON CONFLICT (produto_catalogo_id, cor, tamanho) DO UPDATE
      SET estoque = EXCLUDED.estoque
      RETURNING cor, tamanho, estoque, created_at
    `;

    const result = await db.query(query, [produtoCatalogoId, ...flatValues]);

    return Response.json({ grades: result.rows }, { status: 201 });
  } catch (err) {
    console.error('Erro ao adicionar grades:', err);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}
