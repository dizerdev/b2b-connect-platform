import db from 'lib/db';
import { requireAuth } from 'lib/authMiddleware';

export async function GET(req) {
  const auth = await requireAuth(req);

  if (!auth.isAuthorized) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }

  const { papel } = auth.payload;

  if (papel !== 'administrador') {
    return Response.json({ error: 'Acesso negado' }, { status: 403 });
  }

  try {
    const query = `
      SELECT 
        (SELECT COUNT(*) FROM produtos) AS produtos_cadastrados,
        (SELECT COUNT(*) FROM usuarios WHERE ativo = true) AS usuarios_ativos,
        (SELECT COUNT(*) FROM catalogos WHERE status = 'publicado') AS catalogos_publicados,
        (SELECT COUNT(*) FROM catalogos WHERE status = 'pendente_aprovacao') AS catalogos_pendentes_aprovacao,
        (SELECT COUNT(*) FROM catalogos WHERE status = 'aprovado') AS catalogos_pendentes_publicacao,
        (SELECT COUNT(*) FROM mensagens_contato WHERE status = 'nova') AS mensagens_pendentes_resposta
    `;

    const result = await db.query(query);

    return Response.json({ relatorios: result.rows[0] });
  } catch (err) {
    console.error('Erro ao carregar relatórios admin:', err);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}
