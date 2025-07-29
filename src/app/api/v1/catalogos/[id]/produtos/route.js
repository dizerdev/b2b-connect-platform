import db from 'lib/db';
import { requireAuth } from 'lib/authMiddleware';

export async function POST(req, { params }) {
  const auth = await requireAuth(req);
  if (!auth.isAuthorized) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }

  const { sub: userId, papel } = auth.payload;
  const { id: catalogoId } = await params;
  const { nome, descricao, imagens, preco, destaque } = await req.json();

  if (!nome || preco === undefined) {
    return Response.json(
      { error: 'Nome e preço são obrigatórios' },
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

    // 1. Cria ou encontra o produto base
    const produtoResult = await db.query(
      `
      INSERT INTO produtos (id, nome, descricao, imagens, created_at)
      VALUES (gen_random_uuid(), $1, $2, $3, NOW())
      RETURNING id, nome, descricao, imagens
    `,
      [nome, descricao || null, imagens || []]
    );

    const produto = produtoResult.rows[0];

    // 2. Associa ao catálogo com atributos específicos
    const assoc = await db.query(
      `
      INSERT INTO produtos_catalogo (id, catalogo_id, produto_id, preco, destaque, created_at)
      VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())
      RETURNING id, preco, destaque
    `,
      [catalogoId, produto.id, preco, destaque || false]
    );

    return Response.json(
      {
        produto: {
          id: produto.id,
          nome: produto.nome,
          descricao: produto.descricao,
          imagens: produto.imagens,
          id_prod: assoc.rows[0].id,
          preco: assoc.rows[0].preco,
          destaque: assoc.rows[0].destaque,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Erro ao adicionar produto ao catálogo:', err);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}
