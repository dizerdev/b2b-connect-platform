import db from 'lib/db';
import { requireAuth } from 'lib/authMiddleware';

// PUT /api/v1/avaliacoes/[id] - Update review
export async function PUT(req, { params }) {
  const auth = await requireAuth(req);
  if (!auth.isAuthorized) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }
  const { sub: userId } = auth.payload;
  try {
    const { rateId } = await params;
    const body = await req.json();
    const { nota, titulo, comentario, recomenda } = body;

    // Check ownership
    const review = await db.query(
      'SELECT * FROM avaliacoes WHERE id = $1 AND usuario_id = $2',
      [rateId, userId],
    );

    if (review.rows.length === 0) {
      return Response.json(
        { error: 'Avaliação não encontrada' },
        { status: 404 },
      );
    }

    // Update
    const result = await db.query(
      `UPDATE avaliacoes 
       SET nota = COALESCE($1, nota),
           titulo = COALESCE($2, titulo),
           comentario = COALESCE($3, comentario),
           recomenda = COALESCE($4, recomenda),
           updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [nota, titulo, comentario, recomenda, rateId],
    );

    // Update catalog rating
    await db.query(
      `UPDATE catalogos 
       SET rating = (
         SELECT ROUND(AVG(nota))::integer 
         FROM avaliacoes 
         WHERE catalogo_id = $1
       )
       WHERE id = $1`,
      [review.rows[0].catalogo_id],
    );

    return Response.json({ avaliacao: result.rows[0] });
  } catch (error) {
    console.error('Error updating review:', error);
    return Response.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}

// DELETE /api/v1/avaliacoes/[id] - Delete review
export async function DELETE(req, { params }) {
  const auth = await requireAuth(req);
  if (!auth.isAuthorized) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }

  const { sub: userId } = auth.payload;

  try {
    const { rateId } = await params;

    // Check ownership
    const review = await db.query(
      'SELECT * FROM avaliacoes WHERE id = $1 AND usuario_id = $2',
      [rateId, userId],
    );

    if (review.rows.length === 0) {
      return Response.json(
        { error: 'Avaliação não encontrada' },
        { status: 404 },
      );
    }

    const catalogoId = review.rows[0].catalogo_id;

    // Delete
    await db.query('DELETE FROM avaliacoes WHERE id = $1', [id]);

    // Update catalog rating
    await db.query(
      `UPDATE catalogos 
       SET rating = (
         SELECT COALESCE(ROUND(AVG(nota))::integer, 0) 
         FROM avaliacoes 
         WHERE catalogo_id = $1
       )
       WHERE id = $1`,
      [catalogoId],
    );

    return Response.json({ message: 'Avaliação excluída com sucesso' });
  } catch (error) {
    console.error('Error deleting review:', error);
    return Response.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
