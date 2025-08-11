import db from 'lib/db';
import { requireAuth } from 'lib/authMiddleware';

export async function PATCH(req, { params }) {
  const auth = await requireAuth(req);

  if (!auth.isAuthorized) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }

  if (auth.payload.papel !== 'administrador') {
    return Response.json({ error: 'Acesso negado' }, { status: 403 });
  }

  const { id } = await params;
  const { ativo } = await req.json();

  if (typeof ativo !== 'boolean') {
    return Response.json(
      { error: 'Campo "ativo" deve ser booleano' },
      { status: 400 }
    );
  }

  try {
    const result = await db.query(
      `
      UPDATE usuarios
      SET ativo = $1
      WHERE id = $2
      RETURNING id, nome, email, papel, ativo
    `,
      [ativo, id]
    );

    if (result.rowCount === 0) {
      return Response.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    return Response.json({ usuario: result.rows[0] });
  } catch (err) {
    console.error('Erro ao ativar/desativar usuário:', err);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}
