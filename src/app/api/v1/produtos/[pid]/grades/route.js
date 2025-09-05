import db from 'lib/db';
import { requireAuth } from 'lib/authMiddleware';

export async function POST(req, { params }) {
  const auth = await requireAuth(req);
  if (!auth.isAuthorized) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }

  const { sub: userId, papel } = auth.payload;
  const { pid: produtoId } = await params;

  let grades;
  try {
    grades = await req.json();
    console.log(grades);
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
    if (!g.cor || !g.tamanho || !g.tipo || typeof g.estoque !== 'number') {
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

    const { fornecedor_id } = res.rows[0];
    const isAdmin = papel === 'administrador';
    const isDono = userId === fornecedor_id;

    if (!isAdmin && !isDono) {
      return Response.json({ error: 'Acesso negado' }, { status: 403 });
    }

    // Insere as grades
    const values = grades
      .map(
        (g, i) =>
          `($1, $${i * 5 + 2}, $${i * 5 + 3}, $${i * 5 + 4}, $${i * 5 + 5}, $${
            i * 5 + 6
          })`
      )
      .join(', ');

    console.log(values);

    const flatValues = grades.flatMap((g) => [
      g.cor,
      g.tamanho,
      g.tipo,
      g.pronta_entrega,
      g.estoque,
    ]);

    console.log(flatValues);

    const query = `
      INSERT INTO grades (produto_id, cor, tamanho, tipo, pronta_entrega, estoque)
      VALUES ${values}
      ON CONFLICT (produto_id, cor, tamanho) DO UPDATE
      SET estoque = EXCLUDED.estoque,
          tipo = EXCLUDED.tipo,
          pronta_entrega = EXCLUDED.pronta_entrega
      RETURNING cor, tamanho, tipo, pronta_entrega, estoque, created_at
    `;

    const result = await db.query(query, [produtoId, ...flatValues]);

    return Response.json({ grades: result.rows }, { status: 201 });
  } catch (err) {
    console.error('Erro ao adicionar grades:', err);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}
