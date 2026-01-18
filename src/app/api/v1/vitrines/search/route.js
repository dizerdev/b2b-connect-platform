import db from 'lib/db';
import { requireAuth } from 'lib/authMiddleware';

export async function GET(req) {
  const auth = await requireAuth(req);
  if (!auth.isAuthorized) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }

  const { searchParams } = new URL(req.url);
  
  // Text search
  const q = searchParams.get('q') || '';
  
  // Filters
  const continentes = searchParams.getAll('continente').map(s => decodeURIComponent(s));
  const paises = searchParams.getAll('pais').map(s => decodeURIComponent(s));
  const categorias = searchParams.getAll('categoria').map(s => decodeURIComponent(s));
  const subcategorias = searchParams.getAll('subcategoria').map(s => decodeURIComponent(s));
  const ratingMin = parseInt(searchParams.get('rating_min')) || null;
  
  // Sorting
  const ordenar = searchParams.get('ordenar') || 'recentes';
  
  // Pagination
  const limit = Math.min(parseInt(searchParams.get('limit')) || 50, 100);
  const offset = parseInt(searchParams.get('offset')) || 0;

  const filters = [];
  const values = [];
  let i = 1;

  // Text search in name, description, supplier name
  if (q) {
    filters.push(`(
      c.nome ILIKE $${i} OR 
      c.descricao ILIKE $${i} OR 
      f.nome ILIKE $${i} OR
      f.nome_fantasia ILIKE $${i}
    )`);
    values.push(`%${q}%`);
    i++;
  }

  // Continent filter (multiple values = OR)
  if (continentes.length > 0) {
    const placeholders = continentes.map(() => `$${i++}`).join(', ');
    filters.push(`m.continente IN (${placeholders})`);
    values.push(...continentes);
  }

  // Country filter
  if (paises.length > 0) {
    const placeholders = paises.map(() => `$${i++}`).join(', ');
    filters.push(`m.pais IN (${placeholders})`);
    values.push(...paises);
  }

  // Category filter (multiple values = OR)
  if (categorias.length > 0) {
    const placeholders = categorias.map(() => `$${i++}`).join(', ');
    filters.push(`m.categoria IN (${placeholders})`);
    values.push(...categorias);
  }

  // Subcategory filter
  if (subcategorias.length > 0) {
    const placeholders = subcategorias.map(() => `$${i++}`).join(', ');
    filters.push(`m.sub_categoria IN (${placeholders})`);
    values.push(...subcategorias);
  }

  // Rating filter
  if (ratingMin) {
    filters.push(`c.rating >= $${i++}`);
    values.push(ratingMin);
  }

  const where = filters.length > 0 ? `AND ${filters.join(' AND ')}` : '';

  // Order by clause
  let orderBy;
  switch (ordenar) {
    case 'rating':
      orderBy = 'c.rating DESC NULLS LAST, c.nome ASC';
      break;
    case 'nome_asc':
      orderBy = 'c.nome ASC';
      break;
    case 'nome_desc':
      orderBy = 'c.nome DESC';
      break;
    case 'recentes':
    default:
      orderBy = 'c.created_at DESC, c.nome ASC';
  }

  try {
    // Get total count
    const countResult = await db.query(
      `
      SELECT COUNT(*) as total
      FROM catalogos c
      JOIN usuarios f ON f.id = c.fornecedor_id
      LEFT JOIN catalogo_metadados m ON m.catalogo_id = c.id
      WHERE c.status = 'publicado'
      ${where}
      `,
      values
    );

    // Get results
    const result = await db.query(
      `
      SELECT 
        c.id,
        c.nome,
        c.descricao,
        c.imagem_url,
        c.status,
        c.rating,
        c.created_at,
        c.fornecedor_id,
        f.nome AS fornecedor_nome,
        f.nome_fantasia AS fornecedor_nome_fantasia,
        f.cidade AS fornecedor_cidade,
        f.pais AS fornecedor_pais,
        m.continente,
        m.pais,
        m.categoria,
        m.sub_categoria
      FROM catalogos c
      JOIN usuarios f ON f.id = c.fornecedor_id
      LEFT JOIN catalogo_metadados m ON m.catalogo_id = c.id
      WHERE c.status = 'publicado'
      ${where}
      ORDER BY ${orderBy}
      LIMIT $${i++}
      OFFSET $${i}
      `,
      [...values, limit, offset]
    );

    return Response.json({
      catalogos: result.rows,
      total: parseInt(countResult.rows[0].total),
      limit,
      offset,
    });
  } catch (err) {
    console.error('Erro ao buscar catálogos:', err);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}
