import db from 'lib/db';
import { requireAuth } from 'lib/authMiddleware';

export async function GET(req, { params }) {
  const auth = await requireAuth(req);
  if (!auth.isAuthorized) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }

  const user = auth.payload;
  const { id: catalogoId } = await params;

  try {
    // 1. Pega o catálogo
    const catalogoRes = await db.query(
      `
      SELECT id, fornecedor_id, nome, descricao, status, rating
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
      [catalogoId]
    );

    // 4. Produtos + Grades (1 query)
    const produtosComGradesRes = await db.query(
      `
      SELECT 
        p.id AS produto_id,
        p.nome,
        p.descricao,
        p.imagens,
        pc.preco,
        pc.destaque,
        pc.produto_id,
        g.cor,
        g.tamanho,
        g.estoque
      FROM produtos p
      JOIN produtos_catalogo pc ON pc.produto_id = p.id
      LEFT JOIN grades g ON g.produto_id = pc.produto_id
      WHERE pc.catalogo_id = $1
      ORDER BY p.id, g.tamanho
    `,
      [catalogoId]
    );

    // Agrupa os produtos
    const produtosMap = new Map();

    for (const row of produtosComGradesRes.rows) {
      if (!produtosMap.has(row.produto_id)) {
        produtosMap.set(row.produto_id, {
          id: row.produto_id,
          nome: row.nome,
          descricao: row.descricao,
          imagens: row.imagens,
          preco: parseFloat(row.preco),
          destaque: row.destaque,
          grades: [],
        });
      }

      if (row.cor && row.tamanho) {
        produtosMap.get(row.produto_id).grades.push({
          cor: row.cor,
          tamanho: row.tamanho,
          estoque: row.estoque,
        });
      }
    }

    const produtos = Array.from(produtosMap.values());

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
