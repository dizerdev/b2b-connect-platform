import bcrypt from 'bcrypt';
import db from 'lib/db';
import { requireAuth } from 'lib/authMiddleware';

export async function POST(req) {
  const auth = await requireAuth(req);

  if (!auth.isAuthorized) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }

  if (auth.payload.papel !== 'administrador') {
    return Response.json({ error: 'Acesso negado' }, { status: 403 });
  }

  try {
    const { nome, email, senha, papel, nome_fantasia } = await req.json();

    if (!nome || !email || !senha || !papel || !nome_fantasia) {
      return Response.json(
        { error: 'Campos obrigatórios ausentes' },
        { status: 400 }
      );
    }

    const papeisValidos = [
      'administrador',
      'fornecedor',
      'representante',
      'lojista',
    ];
    if (!papeisValidos.includes(papel)) {
      return Response.json({ error: 'Papel inválido' }, { status: 400 });
    }

    const senha_hash = await bcrypt.hash(senha, 10);

    const result = await db.query(
      `
      INSERT INTO usuarios (id, email, nome, nome_fantasia, papel, senha_hash, vitrine_id, ativo, criado_em)
      VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, true, NOW())
      RETURNING id, nome, email, papel, ativo, criado_em
    `,
      [email, nome, nome_fantasia, papel, senha]
    );

    return Response.json({ usuario: result.rows[0] }, { status: 201 });
  } catch (err) {
    console.error('Erro ao criar usuário:', err);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}
