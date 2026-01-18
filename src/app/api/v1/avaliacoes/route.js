import db from 'lib/db';
import { requireAuth } from 'lib/authMiddleware';

// GET /api/v1/avaliacoes?catalogoId=xxx - List reviews for a catalog
export async function GET(request) {
  const auth = await requireAuth(req);
  if (!auth.isAuthorized) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }

  try {
    const { searchParams } = new URL(request.url);
    const catalogoId = searchParams.get('catalogoId');

    if (!catalogoId) {
      return Response.json(
        { error: 'catalogoId é obrigatório' },
        { status: 400 },
      );
    }

    const result = await db.query(
      `SELECT 
        a.id,
        a.usuario_id,
        a.catalogo_id,
        a.nota,
        a.titulo,
        a.comentario,
        a.recomenda,
        a.created_at,
        u.nome as usuario_nome
      FROM avaliacoes a
      JOIN usuarios u ON a.usuario_id = u.id
      WHERE a.catalogo_id = $1
      ORDER BY a.created_at DESC`,
      [catalogoId],
    );

    // Calculate average rating
    const avgResult = await db.query(
      `SELECT 
        AVG(nota)::numeric(2,1) as media,
        COUNT(*) as total
      FROM avaliacoes
      WHERE catalogo_id = $1`,
      [catalogoId],
    );

    return Response.json({
      avaliacoes: result.rows,
      estatisticas: {
        media: parseFloat(avgResult.rows[0].media) || 0,
        total: parseInt(avgResult.rows[0].total) || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return Response.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}

// POST /api/v1/avaliacoes - Create new review
export async function POST(request) {
  const auth = await requireAuth(req);
  if (!auth.isAuthorized) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }

  const { sub: userId } = auth.payload;

  try {
    const body = await request.json();
    const { catalogoId, nota, titulo, comentario, recomenda } = body;

    // Validate
    if (!catalogoId || !nota) {
      return Response.json(
        { error: 'catalogoId e nota são obrigatórios' },
        { status: 400 },
      );
    }

    if (nota < 1 || nota > 5) {
      return Response.json(
        { error: 'Nota deve ser entre 1 e 5' },
        { status: 400 },
      );
    }

    // Check if already reviewed
    const existing = await db.query(
      'SELECT id FROM avaliacoes WHERE usuario_id = $1 AND catalogo_id = $2',
      [userId, catalogoId],
    );

    if (existing.rows.length > 0) {
      return Response.json(
        { error: 'Você já avaliou este catálogo' },
        { status: 409 },
      );
    }

    // Insert review
    const result = await db.query(
      `INSERT INTO avaliacoes (usuario_id, catalogo_id, nota, titulo, comentario, recomenda)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        userId,
        catalogoId,
        nota,
        titulo || null,
        comentario || null,
        recomenda ?? true,
      ],
    );

    // Update catalog rating
    await updateCatalogRating(catalogoId);

    return Response.json({ avaliacao: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return Response.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}

async function updateCatalogRating(catalogoId) {
  await db.query(
    `UPDATE catalogos 
     SET rating = (
       SELECT ROUND(AVG(nota))::integer 
       FROM avaliacoes 
       WHERE catalogo_id = $1
     )
     WHERE id = $1`,
    [catalogoId],
  );
}
