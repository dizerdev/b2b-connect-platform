import db from 'lib/db';
import { requireAuth } from 'lib/authMiddleware';

export async function POST(req, { params }) {
  const auth = await requireAuth(req);

  if (!auth.isAuthorized) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }

  if (auth.payload.papel !== 'administrador') {
    return Response.json({ error: 'Acesso negado' }, { status: 403 });
  }

  const { id } = await params;
  const { rating } = await req.json();

  if (!Number.isInteger(rating) || rating < 0 || rating > 5) {
    return Response.json(
      { error: 'Rating deve ser um inteiro entre 0 e 5' },
      { status: 400 }
    );
  }

  try {
    const update = await db.query(
      `
      UPDATE catalogos
      SET rating = $1
      WHERE id = $2
      RETURNING id, nome, status, rating
    `,
      [rating, id]
    );

    if (update.rowCount === 0) {
      return Response.json(
        { error: 'Catálogo não encontrado' },
        { status: 404 }
      );
    }

    return Response.json({ catalogo: update.rows[0] });
  } catch (err) {
    console.error('Erro ao definir rating:', err);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}
