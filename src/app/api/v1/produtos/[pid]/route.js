import db from 'lib/db';
import { requireAuth } from 'lib/authMiddleware';

export async function GET(req, { params }) {
  const auth = await requireAuth(req);
  if (!auth.isAuthorized) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }

  const { sub: userId, papel } = auth.payload;
  const { pid: produtoId } = await params;

  try {
    const res = await db.query(
      `
      SELECT c.fornecedor_id, pc.catalogo_id
      FROM produtos_catalogo pc
      JOIN catalogos c ON c.id = pc.catalogo_id
      WHERE pc.produto_id = $1
      LIMIT 1
    `,
      [produtoId]
    );

    if (res.rowCount === 0) {
      return Response.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    const { fornecedor_id } = res.rows[0];
    const isAdmin = papel === 'administrador';
    const isDono = userId === fornecedor_id;
    const isLojista = papel === 'lojista';

    if (!isAdmin && !isDono && !isLojista) {
      return Response.json({ error: 'Acesso negado' }, { status: 403 });
    }

    // Busca informações do produto
    const produtoRes = await db.query(`SELECT * FROM produtos WHERE id = $1`, [
      produtoId,
    ]);
    const produto = produtoRes.rows[0];

    // Busca catálogos vinculados
    const catalogosRes = await db.query(
      `
      SELECT pc.catalogo_id, c.nome AS catalogo_nome, c.fornecedor_id, pc.preco, pc.destaque, pc.created_at
      FROM produtos_catalogo pc
      JOIN catalogos c ON c.id = pc.catalogo_id
      WHERE pc.produto_id = $1
    `,
      [produtoId]
    );

    // Busca grades
    const gradesRes = await db.query(
      `SELECT cor, tamanho, tipo, pronta_entrega, estoque, created_at FROM grades WHERE produto_id = $1`,
      [produtoId]
    );

    return Response.json(
      {
        produto,
        catalogos: catalogosRes.rows.map((c) => ({
          ...c,
          preco: c.preco !== null ? parseFloat(c.preco) : null,
        })),
        grades: gradesRes.rows,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Erro ao buscar dados do produto:', err);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}
