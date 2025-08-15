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
    // Verifica se produto existe e obtém fornecedor
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

    if (!isAdmin && !isDono) {
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
      SELECT pc.catalogo_id, c.nome AS catalogo_nome, pc.preco, pc.destaque, pc.created_at
      FROM produtos_catalogo pc
      JOIN catalogos c ON c.id = pc.catalogo_id
      WHERE pc.produto_id = $1
    `,
      [produtoId]
    );

    // Busca grades
    const gradesRes = await db.query(
      `SELECT cor, tamanho, estoque, created_at FROM grades WHERE produto_id = $1`,
      [produtoId]
    );

    // Busca imagens
    const imagensRes = await db.query(
      `
      SELECT id, url, nome_arquivo, tamanho_bytes, created_at
      FROM produto_imagens
      WHERE produto_id = $1
      ORDER BY created_at ASC
    `,
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
        imagens: imagensRes.rows,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Erro ao buscar dados do produto:', err);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}
