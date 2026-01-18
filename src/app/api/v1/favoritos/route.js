import db from 'lib/db';
import { requireAuth } from 'lib/authMiddleware';

// GET /api/v1/favoritos - List all favorites for current user
export async function GET(req) {
  const auth = await requireAuth(req);
  if (!auth.isAuthorized) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }
  const { sub: userId } = auth.payload;

  try {
    const result = await db.query(
      `SELECT 
        f.id,
        f.catalogo_id,
        f.produto_id,
        f.created_at,
        c.nome as catalogo_nome,
        c.imagem_url as catalogo_imagem,
        c.status as catalogo_status,
        p.nome as produto_nome,
        p.imagens as produto_imagens
      FROM favoritos f
      LEFT JOIN catalogos c ON f.catalogo_id = c.id
      LEFT JOIN produtos p ON f.produto_id = p.id
      WHERE f.usuario_id = $1
      ORDER BY f.created_at DESC`,
      [userId],
    );

    return Response.json({ favoritos: result.rows });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return Response.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}

// POST /api/v1/favoritos - Add new favorite
export async function POST(req) {
  const auth = await requireAuth(req);
  if (!auth.isAuthorized) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }

  const { sub: userId } = auth.payload;

  try {
    const body = await req.json();
    const { catalogoId, produtoId } = body;

    // Validate that exactly one is provided
    if ((!catalogoId && !produtoId) || (catalogoId && produtoId)) {
      return Response.json(
        { error: 'Forneça catalogoId OU produtoId' },
        { status: 400 },
      );
    }

    // Check if already favorited
    const existing = await db.query(
      `SELECT id FROM favoritos 
       WHERE usuario_id = $1 
       AND (catalogo_id = $2 OR produto_id = $3)`,
      [userId, catalogoId || null, produtoId || null],
    );

    if (existing.rows.length > 0) {
      return Response.json(
        {
          error: 'Item já está nos favoritos',
          favorito: { id: existing.rows[0].id },
        },
        { status: 409 },
      );
    }

    // Insert favorite
    const result = await db.query(
      `INSERT INTO favoritos (usuario_id, catalogo_id, produto_id)
       VALUES ($1, $2, $3)
       RETURNING id, catalogo_id, produto_id, created_at`,
      [userId, catalogoId, produtoId],
    );

    return Response.json({ favorito: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error adding favorite:', error);
    return Response.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
