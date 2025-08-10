import db from 'lib/db';
import { requireAuth } from 'lib/authMiddleware';

export async function PATCH(req, { params }) {
  const auth = await requireAuth(req);

  if (!auth.isAuthorized) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }

  const { sub: userId, papel } = auth.payload;
  const { mid: mensagemId } = await params;

  if (papel !== 'administrador') {
    return Response.json({ error: 'Acesso negado' }, { status: 403 });
  }

  const { resposta } = await req.json();

  try {
    // 1. Verificar se mensagem existe e se já foi respondida
    const mensagem = await db.query(
      `
      SELECT id, status 
      FROM mensagens_contato 
      WHERE id = $1
    `,
      [mensagemId]
    );

    if (mensagem.rowCount === 0) {
      return Response.json(
        { error: 'Mensagem não encontrada' },
        { status: 404 }
      );
    }

    if (mensagem.rows[0].status === 'respondida') {
      return Response.json(
        { error: 'Mensagem já foi respondida' },
        { status: 400 }
      );
    }

    // 2. Criar resposta e atualizar status em transação
    await db.query('BEGIN');

    await db.query(
      `
      INSERT INTO respostas_admin (admin_id, mensagem_id, resposta)
      VALUES ($1, $2, $3)
    `,
      [userId, mensagemId, resposta]
    );

    await db.query(
      `
      UPDATE mensagens_contato
      SET status = 'respondida'
      WHERE id = $1
    `,
      [mensagemId]
    );

    await db.query('COMMIT');

    return Response.json(
      { message: 'Resposta registrada com sucesso' },
      { status: 200 }
    );
  } catch (err) {
    await db.query('ROLLBACK');
    console.error('Erro ao responder mensagem:', err);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}
