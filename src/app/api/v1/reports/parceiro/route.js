import db from 'lib/db';
import { requireAuth } from 'lib/authMiddleware';

export async function GET(req) {
  const auth = await requireAuth(req);

  if (!auth.isAuthorized) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }

  const { papel, sub: userId } = auth.payload;

  // Valida se é fornecedor ou representante (parceiros)
  if (papel !== 'fornecedor' && papel !== 'representante') {
    return Response.json({ error: 'Acesso negado' }, { status: 403 });
  }

  try {
    const query = `
      SELECT 
        -- Total de produtos cadastrados pelo parceiro
        (
          SELECT COUNT(DISTINCT p.id) 
          FROM produtos p
          JOIN produtos_catalogo pc ON pc.produto_id = p.id
          JOIN catalogos c ON c.id = pc.catalogo_id
          WHERE c.fornecedor_id = $1
        ) AS produtos_cadastrados,
        
        -- Catálogos por status
        (SELECT COUNT(*) FROM catalogos WHERE fornecedor_id = $1 AND status = 'publicado') AS catalogos_publicados,
        (SELECT COUNT(*) FROM catalogos WHERE fornecedor_id = $1 AND status = 'aprovado') AS catalogos_aprovados,
        (SELECT COUNT(*) FROM catalogos WHERE fornecedor_id = $1 AND status = 'pendente_aprovacao') AS catalogos_pendentes,
        
        -- Total de catálogos
        (SELECT COUNT(*) FROM catalogos WHERE fornecedor_id = $1) AS total_catalogos,
        
        -- Mensagens recebidas (via catálogos do parceiro)
        (
          SELECT COUNT(*) 
          FROM mensagens_contato mc
          JOIN catalogos c ON c.id = mc.catalogo_id
          WHERE c.fornecedor_id = $1
        ) AS total_mensagens,
        
        -- Mensagens pendentes de resposta
        (
          SELECT COUNT(*) 
          FROM mensagens_contato mc
          JOIN catalogos c ON c.id = mc.catalogo_id
          WHERE c.fornecedor_id = $1 AND mc.status = 'nova'
        ) AS mensagens_pendentes,
        
        -- Total de grades/variações de estoque
        (
          SELECT COUNT(*) 
          FROM grades g
          JOIN produtos p ON p.id = g.produto_id
          JOIN produtos_catalogo pc ON pc.produto_id = p.id
          JOIN catalogos c ON c.id = pc.catalogo_id
          WHERE c.fornecedor_id = $1
        ) AS total_grades,
        
        -- Produtos em pronta entrega
        (
          SELECT COUNT(DISTINCT g.produto_id) 
          FROM grades g
          JOIN produtos p ON p.id = g.produto_id
          JOIN produtos_catalogo pc ON pc.produto_id = p.id
          JOIN catalogos c ON c.id = pc.catalogo_id
          WHERE c.fornecedor_id = $1 AND g.pronta_entrega = true AND g.estoque > 0
        ) AS produtos_pronta_entrega,
        
        -- Estoque total
        (
          SELECT COALESCE(SUM(g.estoque), 0) 
          FROM grades g
          JOIN produtos p ON p.id = g.produto_id
          JOIN produtos_catalogo pc ON pc.produto_id = p.id
          JOIN catalogos c ON c.id = pc.catalogo_id
          WHERE c.fornecedor_id = $1
        ) AS estoque_total,
        
        -- Favoritos em catálogos do parceiro
        (
          SELECT COUNT(*) 
          FROM favoritos f
          JOIN catalogos c ON c.id = f.catalogo_id
          WHERE c.fornecedor_id = $1
        ) AS total_favoritos,
        
        -- Avaliações recebidas
        (
          SELECT COUNT(*) 
          FROM avaliacoes a
          JOIN catalogos c ON c.id = a.catalogo_id
          WHERE c.fornecedor_id = $1
        ) AS total_avaliacoes,
        
        -- Média de avaliações
        (
          SELECT COALESCE(ROUND(AVG(a.nota)::numeric, 1), 0) 
          FROM avaliacoes a
          JOIN catalogos c ON c.id = a.catalogo_id
          WHERE c.fornecedor_id = $1
        ) AS media_avaliacoes
    `;

    const result = await db.query(query, [userId]);

    return Response.json({ relatorios: result.rows[0] });
  } catch (err) {
    console.error('Erro ao carregar relatórios parceiro:', err);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}
