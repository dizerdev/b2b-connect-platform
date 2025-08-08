import db from 'lib/db';
import { requireAuth } from 'lib/authMiddleware';

export async function PATCH(req) {
  const auth = await requireAuth(req);
  if (!auth.isAuthorized || auth.payload.papel !== 'administrador') {
    return Response.json({ error: 'Acesso negado' }, { status: 403 });
  }

  const { catalogoIds } = await req.json();

  if (!Array.isArray(catalogoIds) || catalogoIds.length === 0) {
    return Response.json(
      { error: 'Lista de catalogoIds inválida' },
      { status: 400 }
    );
  }

  try {
    // Valida se todos os IDs existem e estão publicados
    const check = await db.query(
      `
      SELECT id FROM catalogos
      WHERE id = ANY($1::UUID[]) AND status = 'publicado'
    `,
      [catalogoIds]
    );

    const idsPublicados = check.rows.map((r) => r.id);
    const invalidos = catalogoIds.filter((id) => !idsPublicados.includes(id));
    if (invalidos.length > 0) {
      return Response.json(
        { error: 'Alguns catálogos não estão publicados', invalidos },
        { status: 400 }
      );
    }

    // Limpa ordenação antiga
    await db.query(`DELETE FROM ordenacao_manual`);

    // Insere nova ordenação
    const inserts = catalogoIds
      .map((id, index) => `('${id}', ${index})`)
      .join(', ');
    await db.query(`
      INSERT INTO ordenacao_manual (catalogo_id, posicao)
      VALUES ${inserts}
    `);

    return Response.json({ success: true });
  } catch (err) {
    console.error('Erro ao definir ordenação manual:', err);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}
