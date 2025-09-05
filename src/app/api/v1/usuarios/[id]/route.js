import db from 'lib/db';
import { requireAuth } from 'lib/authMiddleware';

export async function GET(req, { params }) {
  const auth = await requireAuth(req);

  if (!auth.isAuthorized) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }

  const { papel } = auth.payload;

  if (papel !== 'administrador') {
    return Response.json({ error: 'Acesso negado' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const result = await db.query(
      `
      SELECT id, email, nome, nome_fantasia, telefone, celular, cnpj,
      logradouro, numero, complemento, cidade, pais, papel, vitrine_id, ativo
      FROM usuarios
      WHERE id = $1
      LIMIT 1
    `,
      [id]
    );

    if (result.rows.length === 0) {
      return Response.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    return Response.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao buscar usuário:', err);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}
