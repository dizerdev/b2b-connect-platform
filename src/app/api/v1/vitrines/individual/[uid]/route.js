import db from 'lib/db';

export async function GET(req, { params }) {
  const { uid: usuarioId } = await params;
  const { searchParams } = new URL(req.url);
  const ordenacao = searchParams.get('ordenacao') || 'rating_desc';

  try {
    // Confirma se o usuário existe e é fornecedor/representante
    const usuarioRes = await db.query(
      `
      SELECT id, nome_fantasia, papel
      FROM usuarios
      WHERE id = $1
    `,
      [usuarioId]
    );

    if (usuarioRes.rowCount === 0) {
      return Response.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    const papel = usuarioRes.rows[0].papel;
    if (papel !== 'fornecedor' && papel !== 'representante') {
      return Response.json(
        { error: 'Usuário não possui vitrine individual' },
        { status: 400 }
      );
    }

    let order = 'c.rating DESC NULLS LAST';
    if (ordenacao === 'nome_asc') order = 'c.nome ASC';

    // Busca catálogos com status 'aprovado'
    const catRes = await db.query(
      `
      SELECT c.id, c.nome, c.status, c.rating
      FROM catalogos c
      WHERE c.fornecedor_id = $1 AND c.status = 'publicado'
      ORDER BY ${order}
    `,
      [usuarioId]
    );

    return Response.json({
      usuario: {
        id: usuarioId,
        nome: usuarioRes.rows[0].nome_fantasia,
        papel,
      },
      catalogos: catRes.rows,
    });
  } catch (err) {
    console.error('Erro ao buscar vitrine individual:', err);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}
