import { requireAuth } from 'lib/authMiddleware';
import db from 'lib/db';

export async function PATCH(req, { params }) {
  const auth = await requireAuth(req);
  if (!auth.isAuthorized) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }

  const { sub: userId, papel } = auth.payload;
  const { id: catalogoId, pid: produtoId } = await params;
  const body = await req.json();

  const camposProduto = ['nome', 'descricao', 'imagens'];
  const camposAssoc = ['preco', 'destaque'];

  try {
    // Verifica dono do catálogo
    const catRes = await db.query(
      `
      SELECT fornecedor_id FROM catalogos WHERE id = $1
    `,
      [catalogoId]
    );

    if (catRes.rowCount === 0) {
      return Response.json(
        { error: 'Catálogo não encontrado' },
        { status: 404 }
      );
    }

    const isAdmin = papel === 'administrador';
    const isDono = userId === catRes.rows[0].fornecedor_id;

    if (!isAdmin && !isDono) {
      return Response.json({ error: 'Acesso negado' }, { status: 403 });
    }

    // Atualiza tabela produtos
    const updatesProduto = [];
    const valuesProduto = [];
    let idx = 1;

    camposProduto.forEach((campo) => {
      if (body[campo] !== undefined) {
        updatesProduto.push(`${campo} = $${idx++}`);
        valuesProduto.push(body[campo]);
      }
    });

    if (updatesProduto.length > 0) {
      valuesProduto.push(produtoId);
      await db.query(
        `
        UPDATE produtos
        SET ${updatesProduto.join(', ')}
        WHERE id = $${idx}
      `,
        valuesProduto
      );
    }

    // Atualiza tabela produtos_catalogo
    const updatesAssoc = [];
    const valuesAssoc = [];
    idx = 1;

    camposAssoc.forEach((campo) => {
      if (body[campo] !== undefined) {
        updatesAssoc.push(`${campo} = $${idx++}`);
        valuesAssoc.push(body[campo]);
      }
    });

    if (updatesAssoc.length > 0) {
      valuesAssoc.push(catalogoId, produtoId);
      await db.query(
        `
        UPDATE produtos_catalogo
        SET ${updatesAssoc.join(', ')}
        WHERE catalogo_id = $${idx++} AND produto_id = $${idx}
      `,
        valuesAssoc
      );
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error('Erro ao editar produto do catálogo:', err);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}
