import db from 'lib/db';
import { requireAuth } from 'lib/authMiddleware';

export async function DELETE(req, { params }) {
  const auth = await requireAuth(req);

  const { sub: userId } = auth.payload;
  const { id: favoriteId } = await params;

  if (!auth.isAuthorized) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }
  try {
    // Check ownership
    const favorite = await db.query(
      'SELECT id FROM favoritos WHERE id = $1 AND usuario_id = $2',
      [favoriteId, userId],
    );

    if (favorite.rows.length === 0) {
      return Response.json(
        { error: 'Favorito não encontrado' },
        { status: 404 },
      );
    }

    // Delete
    await db.query('DELETE FROM favoritos WHERE id = $1', [favoriteId]);

    return Response.json({ message: 'Favorito removido com sucesso' });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return Response.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
