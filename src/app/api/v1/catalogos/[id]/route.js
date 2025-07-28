import db from 'lib/db';
import { requireAuth } from 'lib/authMiddleware';

export async function GET(req, { params }) {
  const auth = await requireAuth(req);
  if (!auth.isAuthorized) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }

  const user = auth.payload;
  const { id } = await params;

  try {
    // 1. Pega o catálogo
    const catalogoRes = await db.query(
      `
      SELECT id, fornecedor_id, nome, descricao, status, rating
      FROM catalogos
      WHERE id = $1
    `,
      [id]
    );

    if (catalogoRes.rowCount === 0) {
      return Response.json(
        { error: 'Catálogo não encontrado' },
        { status: 404 }
      );
    }

    const catalogo = catalogoRes.rows[0];

    // 2. Verifica permissão de visualização
    const isAdmin = user.papel === 'administrador';
    const isDono = user.sub === catalogo.fornecedor_id;
    const isLojista = user.papel === 'lojista';

    if (isLojista && catalogo.status !== 'publicado') {
      return Response.json({ error: 'Acesso negado' }, { status: 403 });
    }

    if (!isAdmin && !isDono && !isLojista) {
      return Response.json({ error: 'Acesso negado' }, { status: 403 });
    }

    // 3. Coleções
    const colecoesRes = await db.query(
      `
      SELECT id, nome, descricao
      FROM colecoes
      WHERE catalogo_id = $1
    `,
      [id]
    );

    // 4. Produtos e grades
    const produtosRes = await db.query(
      `
      SELECT pc.id as produto_catalogo_id, p.id, p.nome, p.descricao, p.imagens, pc.preco, pc.destaque
      FROM produtos_catalogo pc
      JOIN produtos p ON pc.produto_id = p.id
      WHERE pc.catalogo_id = $1
    `,
      [id]
    );

    const produtos = await Promise.all(
      produtosRes.rows.map(async (produto) => {
        const gradesRes = await db.query(
          `
        SELECT cor, tamanho, estoque
        FROM grades
        WHERE produto_catalogo_id = $1
      `,
          [produto.produto_catalogo_id]
        );

        return {
          id: produto.id,
          nome: produto.nome,
          descricao: produto.descricao,
          imagens: produto.imagens,
          preco: produto.preco,
          destaque: produto.destaque,
          grades: gradesRes.rows,
        };
      })
    );

    return Response.json({
      catalogo: {
        id: catalogo.id,
        nome: catalogo.nome,
        descricao: catalogo.descricao,
        status: catalogo.status,
        rating: catalogo.rating,
        colecoes: colecoesRes.rows,
        produtos,
      },
    });
  } catch (err) {
    console.error('Erro ao carregar catálogo:', err);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}
