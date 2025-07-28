import db from 'lib/db';
import { requireAuth } from 'lib/authMiddleware';

export async function POST(req) {
  const auth = await requireAuth(req);
  if (!auth.isAuthorized) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }

  const { papel, sub: userId } = auth.payload;

  if (!['fornecedor', 'representante'].includes(papel)) {
    return Response.json(
      { error: 'Apenas fornecedores ou representantes podem criar catálogos' },
      { status: 403 }
    );
  }

  const { nome, descricao } = await req.json();

  if (!nome) {
    return Response.json(
      { error: 'Nome do catálogo é obrigatório' },
      { status: 400 }
    );
  }

  try {
    const result = await db.query(
      `
      INSERT INTO catalogos (id, fornecedor_id, nome, descricao, status, rating, created_at, updated_at)
      VALUES (gen_random_uuid(), $1, $2, $3, 'pendente_aprovacao', 5, NOW(), NOW())
      RETURNING id, fornecedor_id, nome, descricao, status, rating, created_at, updated_at
    `,
      [userId, nome, descricao || null]
    );

    return Response.json({ catalogo: result.rows[0] }, { status: 201 });
  } catch (err) {
    console.error('Erro ao criar catálogo:', err);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}
