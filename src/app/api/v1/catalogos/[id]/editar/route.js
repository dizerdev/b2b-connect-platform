import db from 'lib/db';
import { requireAuth } from 'lib/authMiddleware';

export async function PATCH(req, { params }) {
  const auth = await requireAuth(req);
  if (!auth.isAuthorized) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }

  const { sub: userId, papel } = auth.payload;
  const { id } = await params;
  const { nome, descricao, imagem_url } = await req.json();

  if (!nome && !descricao && !imagem_url) {
    return Response.json(
      { error: 'Nenhum campo para atualizar' },
      { status: 400 }
    );
  }

  try {
    const result = await db.query(
      `
      SELECT id, fornecedor_id, status
      FROM catalogos
      WHERE id = $1
    `,
      [id]
    );

    if (result.rowCount === 0) {
      return Response.json(
        { error: 'Catálogo não encontrado' },
        { status: 404 }
      );
    }

    const catalogo = result.rows[0];

    const isAdmin = papel === 'administrador';
    const isDono = userId === catalogo.fornecedor_id;

    if (!isAdmin && (!isDono || catalogo.status === 'publicado')) {
      return Response.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const fields = [];
    const values = [];
    let idx = 1;

    if (nome) {
      fields.push(`nome = $${idx++}`);
      values.push(nome);
    }

    if (descricao !== undefined) {
      fields.push(`descricao = $${idx++}`);
      values.push(descricao);
    }

    if (imagem_url !== undefined) {
      fields.push(`imagem_url = $${idx++}`);
      values.push(imagem_url);
    }

    values.push(id); // para o WHERE

    const updateQuery = `
      UPDATE catalogos
      SET ${fields.join(', ')}
      WHERE id = $${idx}
      RETURNING id, nome, descricao, imagem_url, status, rating, created_at
    `;

    const updated = await db.query(updateQuery, values);

    return Response.json({ catalogo: updated.rows[0] });
  } catch (err) {
    console.error('Erro ao editar catálogo:', err);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}
