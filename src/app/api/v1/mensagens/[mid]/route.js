import db from 'lib/db';
import { requireAuth } from 'lib/authMiddleware';

export async function GET(req, { params }) {
  const auth = await requireAuth(req);

  if (!auth.isAuthorized) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }

  const { sub: userId, papel } = auth.payload;
  const { mid: mensagemId } = await params;

  try {
    const lojistaRes = await db.query(
      `SELECT lojista_id FROM mensagens_contato WHERE id = $1`,
      [mensagemId]
    );

    const isAdmin = papel === 'administrador';
    const isDono = userId === lojistaRes.lojista_id;
    const isLojista = papel === 'lojista';

    if (!isAdmin && !isDono && !isLojista) {
      return Response.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const result = await db.query(
      `
      SELECT 
        m.id,
        m.catalogo_id,
        c.nome AS catalogo_nome,
        m.lojista_id,
        u.nome AS lojista_nome,
        m.mensagem,
        m.status,
        m.created_at,
        ra.resposta,
        ra.created_at AS resposta_data_hora
      FROM mensagens_contato m
      JOIN catalogos c ON c.id = m.catalogo_id
      JOIN usuarios u ON u.id = m.lojista_id
      LEFT JOIN respostas_admin ra ON ra.mensagem_id = m.id
      WHERE m.id = $1
      LIMIT 1
    `,
      [mensagemId]
    );

    if (result.rowCount === 0) {
      return Response.json(
        { error: 'Mensagem não encontrada' },
        { status: 404 }
      );
    }

    const mensagem = result.rows[0];

    return Response.json(mensagem, { status: 200 });
  } catch (err) {
    console.error('Erro ao buscar mensagem:', err);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}
