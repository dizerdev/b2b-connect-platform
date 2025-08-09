import db from 'lib/db';
import { requireAuth } from 'lib/authMiddleware';

const CONTINENTES = ['América', 'Europa', 'Ásia'];
const CATEGORIAS = ['Moda Masculina', 'Fitness', 'Moda Feminina'];
const ESPECIFICACOES_VALIDAS = [
  'Algodão orgânico',
  'Tecido técnico',
  'Estampado',
];

export async function PATCH(req, { params }) {
  const auth = await requireAuth(req);
  if (!auth.isAuthorized) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }

  const { sub: userId, papel } = auth.payload;
  const { id: catalogoId } = await params;
  const { continente, pais, categoria, especificacao } = await req.json();

  if (
    !continente ||
    !pais ||
    !categoria ||
    !Array.isArray(especificacao) ||
    especificacao.length === 0
  ) {
    return Response.json(
      {
        error:
          'Todos os campos são obrigatórios e deve haver ao menos uma especificação',
      },
      { status: 400 }
    );
  }

  if (!CONTINENTES.includes(continente)) {
    return Response.json({ error: 'Continente inválido' }, { status: 400 });
  }
  if (!CATEGORIAS.includes(categoria)) {
    return Response.json({ error: 'Categoria inválida' }, { status: 400 });
  }

  for (const espec of especificacao) {
    if (!ESPECIFICACOES_VALIDAS.includes(espec)) {
      return Response.json(
        { error: `Especificação inválida: ${espec}` },
        { status: 400 }
      );
    }
  }

  try {
    const res = await db.query(
      `SELECT fornecedor_id FROM catalogos WHERE id = $1`,
      [catalogoId]
    );

    if (res.rowCount === 0) {
      return Response.json(
        { error: 'Catálogo não encontrado' },
        { status: 404 }
      );
    }

    const fornecedorId = res.rows[0].fornecedor_id;
    const isAdmin = papel === 'administrador';
    const isDono = userId === fornecedorId;

    if (!isAdmin && !isDono) {
      return Response.json({ error: 'Acesso negado' }, { status: 403 });
    }

    // Insere ou atualiza metadados com JSONB
    await db.query(
      `
      INSERT INTO catalogo_metadados (catalogo_id, continente, pais, categoria, especificacoes)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (catalogo_id)
      DO UPDATE SET continente = EXCLUDED.continente,
                    pais = EXCLUDED.pais,
                    categoria = EXCLUDED.categoria,
                    especificacoes = EXCLUDED.especificacoes
      `,
      [catalogoId, continente, pais, categoria, JSON.stringify(especificacao)]
    );

    return Response.json({ success: true });
  } catch (err) {
    console.error('Erro ao definir metadados:', err);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}
