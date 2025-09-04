import db from 'lib/db';
import { requireAuth } from 'lib/authMiddleware';

const CONTINENTES = [
  'América do Norte',
  'América Central',
  'América do Sul',
  'Ásia',
  'África',
  'Oceânia',
];
const PAISES = [
  'China',
  'EUA',
  'México',
  'Argentina',
  'Marrocos',
  'África do Sul',
  'Austrália',
  'Vietnã',
  'Indonésia',
  'Alemanha',
  'Itália',
  'Bélgica',
  'França',
  'Países Baixos',
  'Espanha',
  'Índia',
  'Turquia',
  'Portugal',
  'Bangladesh',
  'México',
  'Polônia',
  'Brasil',
  'Paquistão',
  'Canadá',
  'Egito',
];
const CATEGORIAS = [
  'Calçados',
  'Acessórios',
  'Componentes',
  'Couros',
  'Máquinas',
  'Serviços',
  'Químicos',
];
const SUBCATEGORIAS = [
  'Masculino',
  'Feminino',
  'Infantil',
  'Meias',
  'Cintos',
  'Bolsas',
  'Malas',
  'Palmilha',
  'Sola',
  'Salto',
  'Cabedal',
  'Injetoras',
  'Costura',
  'Presponto',
  'Manutenção',
  'Sapataria',
  'Vendedores',
  'Curtume',
];
const ESPECIFICACOES_VALIDAS = [
  'Couro',
  'Tecido Premium',
  'Estampado',
  'Vulcanizado',
  'Costura',
  'Verniz',
];

export async function GET(req, { params }) {
  const auth = await requireAuth(req);
  if (!auth.isAuthorized) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }

  const { sub: userId, papel } = auth.payload;
  const { id: catalogoId } = await params;

  try {
    // Verifica se o catálogo existe e de quem é
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

    // Busca os metadados do catálogo
    const metaRes = await db.query(
      `
      SELECT continente, pais, categoria, sub_categoria, especificacao
      FROM catalogo_metadados
      WHERE catalogo_id = $1
      `,
      [catalogoId]
    );

    if (metaRes.rowCount === 0) {
      return Response.json(
        { message: 'Nenhum metadado definido para este catálogo' },
        { status: 200 }
      );
    }

    return Response.json(metaRes.rows[0], { status: 200 });
  } catch (err) {
    console.error('Erro ao buscar metadados:', err);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  const auth = await requireAuth(req);
  if (!auth.isAuthorized) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }

  const { sub: userId, papel } = auth.payload;
  const { id: catalogoId } = await params;
  const { continente, pais, categoria, sub_categoria, especificacao } =
    await req.json();

  if (
    !continente ||
    !pais ||
    !categoria ||
    !sub_categoria ||
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

  if (!PAISES.includes(pais)) {
    return Response.json({ error: 'Continente inválido' }, { status: 400 });
  }

  if (!CATEGORIAS.includes(categoria)) {
    return Response.json({ error: 'Categoria inválida' }, { status: 400 });
  }

  if (!SUBCATEGORIAS.includes(sub_categoria)) {
    return Response.json({ error: 'Subcategoria inválida' }, { status: 400 });
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
      INSERT INTO catalogo_metadados (catalogo_id, continente, pais, categoria, sub_categoria, especificacao)
      VALUES ($1, $2, $3, $4, $5, $6::jsonb)
      ON CONFLICT (catalogo_id)
      DO UPDATE SET continente = EXCLUDED.continente,
        pais = EXCLUDED.pais,
        categoria = EXCLUDED.categoria,
        sub_categoria = EXCLUDED.sub_categoria,
        especificacao = EXCLUDED.especificacao
      `,
      [
        catalogoId,
        continente,
        pais,
        categoria,
        sub_categoria,
        JSON.stringify(especificacao),
      ]
    );

    return Response.json({ success: true });
  } catch (err) {
    console.error('Erro ao definir metadados:', err);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}
