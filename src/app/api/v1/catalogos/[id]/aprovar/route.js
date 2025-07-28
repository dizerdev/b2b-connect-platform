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

  try {
    const result = await db.query(
      `
      SELECT id, status
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

    if (catalogo.status !== 'pendente_aprovacao') {
      return Response.json(
        {
          error: `Catálogo com status '${catalogo.status}' não pode ser aprovado`,
        },
        { status: 400 }
      );
    }

    const update = await db.query(
      `
      UPDATE catalogos
      SET status = 'aprovado'
      WHERE id = $1
      RETURNING id, nome, status
    `,
      [id]
    );

    return Response.json({ catalogo: update.rows[0] });
  } catch (err) {
    console.error('Erro ao aprovar catálogo:', err);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}
