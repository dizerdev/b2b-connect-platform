import db from 'lib/db';
import { requireAuth } from 'lib/authMiddleware';
import z from 'zod';

const schema = z.object({
  catalogo_id: z.uuid(),
  mensagem: z.string().min(3, 'Mensagem muito curta'),
});

export async function POST(req) {
  const auth = await requireAuth(req);
  if (!auth.isAuthorized) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }

  const { sub: userId } = auth.payload;

  if (auth.payload.papel !== 'lojista') {
    return Response.json({ error: 'Acesso negado' }, { status: 403 });
  }

  const body = await req.json();
  const parse = schema.safeParse(body);
  if (!parse.success) {
    return Response.json({ error: z.treeifyError(err) }, { status: 400 });
  }

  const { catalogo_id, mensagem } = parse.data;

  try {
    // valida se catálogo existe e está publicado
    const cat = await db.query(
      `
      SELECT id FROM catalogos 
      WHERE id = $1 AND status = 'publicado'
    `,
      [catalogo_id]
    );

    if (cat.rowCount === 0) {
      return Response.json(
        { error: 'Catálogo não encontrado ou não publicado' },
        { status: 404 }
      );
    }

    // cria mensagem
    const result = await db.query(
      `
      INSERT INTO mensagens_contato (catalogo_id, lojista_id, mensagem)
      VALUES ($1, $2, $3)
      RETURNING *
    `,
      [catalogo_id, userId, mensagem]
    );

    return Response.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error('Erro ao enviar mensagem:', err);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}
