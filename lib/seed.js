import 'dotenv/config';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
});

const ddl = `
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(254) NOT NULL UNIQUE,
  nome VARCHAR(90) NOT NULL,
  nome_fantasia VARCHAR(90) NOT NULL,
  telefone VARCHAR(16) DEFAULT 'Preencher',
  celular VARCHAR(16) DEFAULT 'Preencher',
  cnpj VARCHAR(20) DEFAULT 'Preencher',
  logradouro VARCHAR(60) DEFAULT 'Preencher',
  numero VARCHAR(15) DEFAULT 'Preencher',
  complemento VARCHAR(60) DEFAULT 'Preencher',
  cidade VARCHAR(60) DEFAULT 'Preencher',
  pais VARCHAR(60) DEFAULT 'Preencher',
  papel VARCHAR(13) NOT NULL CHECK (papel IN ('administrador', 'fornecedor', 'representante', 'lojista')),
  senha_hash TEXT NOT NULL,
  vitrine_id UUID,
  ativo BOOLEAN NOT NULL DEFAULT true,
  criado_em TIMESTAMP NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMP,
  ultimo_login_em TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vitrines_individuais (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID NOT NULL UNIQUE REFERENCES usuarios(id),
  slug TEXT NOT NULL UNIQUE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  exibir_contatos BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS catalogos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fornecedor_id UUID NOT NULL REFERENCES usuarios(id),
  nome VARCHAR(60) NOT NULL,
  descricao TEXT,
  imagem_url TEXT,
  status TEXT NOT NULL CHECK (status IN ('pendente_aprovacao', 'aprovado', 'publicado')),
  rating INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS colecoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  catalogo_id UUID NOT NULL REFERENCES catalogos(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  descricao TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS produtos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  descricao TEXT,
  imagens TEXT[],
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS produtos_catalogo (
  catalogo_id UUID NOT NULL REFERENCES catalogos(id) ON DELETE CASCADE,
  produto_id UUID NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
  preco NUMERIC(10, 2),
  destaque BOOLEAN DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (catalogo_id, produto_id)
);

CREATE TABLE IF NOT EXISTS grades (
  produto_id UUID NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
  cor TEXT NOT NULL,
  tamanho TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('pr', 'cx', 'un')),
  pronta_entrega BOOLEAN DEFAULT false,
  estoque INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (produto_id, cor, tamanho)
);

CREATE TABLE ordenacao_manual (
  catalogo_id UUID PRIMARY KEY REFERENCES catalogos(id) ON DELETE CASCADE,
  posicao INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS logs_de_acao (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id),
  tipo_acao TEXT NOT NULL,
  referencia_id UUID,
  mensagem TEXT NOT NULL,
  data_hora TIMESTAMP NOT NULL DEFAULT NOW(),
  ip TEXT,
  user_agent TEXT
);

CREATE TABLE IF NOT EXISTS mensagens_contato (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  catalogo_id UUID NOT NULL REFERENCES catalogos(id),
  lojista_id UUID NOT NULL REFERENCES usuarios(id),
  mensagem TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'nova' CHECK (status IN ('nova', 'respondida', 'publicado')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS respostas_admin (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES usuarios(id),
  mensagem_id UUID NOT NULL UNIQUE REFERENCES mensagens_contato(id),
  resposta TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE catalogo_metadados (
  catalogo_id UUID REFERENCES catalogos(id) ON DELETE CASCADE,
  continente TEXT NOT NULL,
  pais TEXT NOT NULL,
  categoria TEXT NOT NULL,
  sub_categoria TEXT NOT NULL,
  especificacao JSONB NOT NULL,
  PRIMARY KEY (catalogo_id)
);

CREATE TABLE password_resets ( 
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  usado BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS favoritos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  catalogo_id UUID REFERENCES catalogos(id) ON DELETE CASCADE,
  produto_id UUID REFERENCES produtos(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(usuario_id, catalogo_id),
  UNIQUE(usuario_id, produto_id),
  CHECK (
    (catalogo_id IS NOT NULL AND produto_id IS NULL) OR
    (catalogo_id IS NULL AND produto_id IS NOT NULL)
  )
);

CREATE TABLE IF NOT EXISTS avaliacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  catalogo_id UUID NOT NULL REFERENCES catalogos(id) ON DELETE CASCADE,
  nota INTEGER NOT NULL CHECK (nota >= 1 AND nota <= 5),
  titulo VARCHAR(100),
  comentario TEXT,
  recomenda BOOLEAN DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(usuario_id, catalogo_id)
);

CREATE INDEX IF NOT EXISTS idx_avaliacoes_catalogo ON avaliacoes(catalogo_id);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_usuario ON avaliacoes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_favoritos_usuario ON favoritos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_catalogos_status ON catalogos(status);
CREATE INDEX IF NOT EXISTS idx_produtos_catalogo_catalogo_id ON produtos_catalogo(catalogo_id);
CREATE INDEX IF NOT EXISTS idx_grades_produto_id ON grades(produto_id);
CREATE INDEX IF NOT EXISTS idx_logs_usuario ON logs_de_acao(usuario_id);
CREATE INDEX IF NOT EXISTS idx_logs_referencia ON logs_de_acao(referencia_id);
CREATE INDEX idx_mensagens_catalogo ON mensagens_contato(catalogo_id);
CREATE INDEX idx_mensagens_lojista ON mensagens_contato(lojista_id);
`;

// ============================================================================
// SEED DATA - Dados de exemplo para desenvolvimento
// ============================================================================

const SAMPLE_IMAGES = {
  catalogos: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600',
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600',
    'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600',
  ],
  produtos: [
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400',
    'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400',
    'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400',
    'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=400',
    'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=400',
    'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=400',
  ],
};

const CATEGORIAS = ['Calçados', 'Acessórios', 'Máquinas', 'Couros'];
const SUBCATEGORIAS = {
  'Calçados': ['Tênis', 'Sapatos Sociais', 'Sandálias', 'Botas', 'Chinelos'],
  'Acessórios': ['Bolsas', 'Cintos', 'Carteiras', 'Mochilas'],
  'Máquinas': ['Costura', 'Corte', 'Acabamento', 'Prensas'],
  'Couros': ['Bovino', 'Sintético', 'Exótico', 'Reciclado'],
};
const CONTINENTES = ['América do Sul', 'América do Norte', 'Europa', 'Ásia', 'África'];
const PAISES = {
  'América do Sul': ['Brasil', 'Argentina', 'Colômbia'],
  'América do Norte': ['EUA', 'México', 'Canadá'],
  'Europa': ['Itália', 'Portugal', 'Espanha', 'França'],
  'Ásia': ['China', 'Índia', 'Vietnã', 'Bangladesh'],
  'África': ['Marrocos', 'Egito', 'África do Sul'],
};
const CORES = ['Preto', 'Branco', 'Marrom', 'Azul', 'Vermelho', 'Bege', 'Cinza'];
const TAMANHOS = ['36', '37', '38', '39', '40', '41', '42', '43', '44'];

// Função para gerar dados aleatórios
function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function createTablesAndSeed() {
  const client = await pool.connect();
  const senhaClara = '123456';
  const hash = await bcrypt.hash(senhaClara, 10);

  try {
    await client.query('BEGIN');

    // 1. Cria as tabelas
    console.log('📦 Criando tabelas...');
    await client.query(ddl);

    // 2. Insere os usuários
    console.log('👥 Criando usuários...');
    const { rows: usuarios } = await client.query(
      `INSERT INTO usuarios (email, nome, nome_fantasia, papel, cidade, pais, telefone, cnpj, senha_hash) VALUES
       ('admin@exemplo.com', 'João Admin', 'ShoesNet Admin', 'administrador', 'São Paulo', 'Brasil', '(11) 99999-0001', '00.000.000/0001-00', $1),
       ('fornecedor1@exemplo.com', 'Maria Calçados', 'Maria Shoes LTDA', 'fornecedor', 'Franca', 'Brasil', '(16) 99999-0002', '11.111.111/0001-11', $1),
       ('fornecedor2@exemplo.com', 'Pedro Couros', 'Couros Premium SA', 'fornecedor', 'Novo Hamburgo', 'Brasil', '(51) 99999-0003', '22.222.222/0001-22', $1),
       ('fornecedor3@exemplo.com', 'Giuseppe Leather', 'Milano Leather SRL', 'fornecedor', 'Milão', 'Itália', '+39 333 1234567', 'IT12345678901', $1),
       ('representante@exemplo.com', 'Carlos Rep', 'RepShoes Comercial', 'representante', 'Rio de Janeiro', 'Brasil', '(21) 99999-0004', '33.333.333/0001-33', $1),
       ('lojista1@exemplo.com', 'Ana Lojista', 'Loja Sapatos SP', 'lojista', 'São Paulo', 'Brasil', '(11) 99999-0005', '44.444.444/0001-44', $1),
       ('lojista2@exemplo.com', 'Roberto Shoes', 'Calçados Roberto', 'lojista', 'Belo Horizonte', 'Brasil', '(31) 99999-0006', '55.555.555/0001-55', $1),
       ('lojista3@exemplo.com', 'Fernanda Fashion', 'Fernanda Calçados', 'lojista', 'Curitiba', 'Brasil', '(41) 99999-0007', '66.666.666/0001-66', $1)
       RETURNING id, papel, nome`,
      [hash]
    );

    const fornecedores = usuarios.filter(u => u.papel === 'fornecedor');
    const lojistas = usuarios.filter(u => u.papel === 'lojista');
    const admin = usuarios.find(u => u.papel === 'administrador');

    // 3. Cria vitrines para fornecedores
    console.log('🏪 Criando vitrines...');
    for (const forn of fornecedores) {
      const slug = forn.nome.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      await client.query(
        `INSERT INTO vitrines_individuais (usuario_id, slug, titulo, descricao, exibir_contatos) VALUES
         ($1, $2, $3, $4, true)`,
        [forn.id, slug, `Vitrine ${forn.nome}`, `Vitrine oficial de ${forn.nome} com os melhores produtos`]
      );
    }

    // 4. Cria catálogos
    console.log('📚 Criando catálogos...');
    const catalogosData = [
      { nome: 'Coleção Verão 2025', categoria: 'Calçados', subcat: 'Sandálias', status: 'publicado', rating: 5 },
      { nome: 'Tênis Esportivos Premium', categoria: 'Calçados', subcat: 'Tênis', status: 'publicado', rating: 5 },
      { nome: 'Sapatos Sociais Clássicos', categoria: 'Calçados', subcat: 'Sapatos Sociais', status: 'publicado', rating: 4 },
      { nome: 'Botas de Inverno', categoria: 'Calçados', subcat: 'Botas', status: 'aprovado', rating: 4 },
      { nome: 'Bolsas Artesanais', categoria: 'Acessórios', subcat: 'Bolsas', status: 'publicado', rating: 5 },
      { nome: 'Cintos Masculinos', categoria: 'Acessórios', subcat: 'Cintos', status: 'publicado', rating: 4 },
      { nome: 'Máquinas de Costura Industrial', categoria: 'Máquinas', subcat: 'Costura', status: 'publicado', rating: 5 },
      { nome: 'Couros Bovinos Selecionados', categoria: 'Couros', subcat: 'Bovino', status: 'publicado', rating: 5 },
      { nome: 'Couros Sintéticos Ecológicos', categoria: 'Couros', subcat: 'Sintético', status: 'aprovado', rating: 4 },
      { nome: 'Chinelos Confortáveis', categoria: 'Calçados', subcat: 'Chinelos', status: 'pendente_aprovacao', rating: null },
    ];

    const catalogosIds = [];
    for (let i = 0; i < catalogosData.length; i++) {
      const cat = catalogosData[i];
      const forn = fornecedores[i % fornecedores.length];
      const continente = random(CONTINENTES);
      const pais = random(PAISES[continente]);
      
      const { rows } = await client.query(
        `INSERT INTO catalogos (fornecedor_id, nome, descricao, imagem_url, status, rating, created_at) 
         VALUES ($1, $2, $3, $4, $5, $6, NOW() - INTERVAL '${randomInt(1, 60)} days')
         RETURNING id`,
        [
          forn.id,
          cat.nome,
          `Catálogo premium com produtos de alta qualidade. ${cat.nome} oferece o melhor da indústria calçadista.`,
          SAMPLE_IMAGES.catalogos[i % SAMPLE_IMAGES.catalogos.length],
          cat.status,
          cat.rating,
        ]
      );
      catalogosIds.push({ id: rows[0].id, ...cat, continente, pais });

      // Adiciona metadados
      await client.query(
        `INSERT INTO catalogo_metadados (catalogo_id, continente, pais, categoria, sub_categoria, especificacao)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          rows[0].id,
          continente,
          pais,
          cat.categoria,
          cat.subcat,
          JSON.stringify({ material: 'Premium', origem: pais, certificacao: 'ISO 9001' }),
        ]
      );
    }

    // 5. Cria produtos
    console.log('👟 Criando produtos...');
    const produtosNomes = [
      'Tênis Runner Pro', 'Sandália Elegance', 'Sapato Oxford', 'Bota Country',
      'Chinelo Comfort', 'Tênis Casual', 'Sandália Rasteira', 'Sapato Derby',
      'Mocassim Clássico', 'Tênis Slip-on', 'Sapatilha Feminina', 'Bota Chelsea',
      'Tênis High Top', 'Sandália Plataforma', 'Sapato Brogue', 'Alpargata Premium',
    ];

    const produtosIds = [];
    for (let i = 0; i < produtosNomes.length; i++) {
      const { rows } = await client.query(
        `INSERT INTO produtos (nome, descricao, imagens)
         VALUES ($1, $2, $3)
         RETURNING id`,
        [
          produtosNomes[i],
          `${produtosNomes[i]} - Produto de alta qualidade com acabamento premium. Conforto e estilo para o dia a dia.`,
          [
            SAMPLE_IMAGES.produtos[i % SAMPLE_IMAGES.produtos.length],
            SAMPLE_IMAGES.produtos[(i + 1) % SAMPLE_IMAGES.produtos.length],
          ],
        ]
      );
      produtosIds.push(rows[0].id);
    }

    // 6. Associa produtos aos catálogos
    console.log('🔗 Associando produtos aos catálogos...');
    for (const catalogo of catalogosIds) {
      const numProdutos = randomInt(3, 6);
      const produtosParaCatalogo = [...produtosIds].sort(() => Math.random() - 0.5).slice(0, numProdutos);
      
      for (let i = 0; i < produtosParaCatalogo.length; i++) {
        await client.query(
          `INSERT INTO produtos_catalogo (catalogo_id, produto_id, preco, destaque)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT DO NOTHING`,
          [
            catalogo.id,
            produtosParaCatalogo[i],
            (randomInt(50, 500) + 0.99).toFixed(2),
            i === 0, // Primeiro produto é destaque
          ]
        );
      }
    }

    // 7. Cria grades de estoque
    console.log('📊 Criando grades de estoque...');
    for (const produtoId of produtosIds) {
      const numGrades = randomInt(3, 8);
      const coresUsadas = new Set();
      const tamanhosUsados = new Set();
      
      for (let i = 0; i < numGrades; i++) {
        const cor = random(CORES);
        const tamanho = random(TAMANHOS);
        const key = `${cor}-${tamanho}`;
        
        if (!coresUsadas.has(key)) {
          coresUsadas.add(key);
          await client.query(
            `INSERT INTO grades (produto_id, cor, tamanho, tipo, pronta_entrega, estoque)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT DO NOTHING`,
            [
              produtoId,
              cor,
              tamanho,
              random(['pr', 'cx', 'un']),
              Math.random() > 0.3,
              randomInt(0, 100),
            ]
          );
        }
      }
    }

    // 8. Cria coleções
    console.log('📁 Criando coleções...');
    const colecaoNomes = ['Primavera/Verão', 'Outono/Inverno', 'Edição Limitada', 'Clássicos', 'Lançamentos'];
    for (const catalogo of catalogosIds.slice(0, 5)) {
      const numColecoes = randomInt(1, 3);
      for (let i = 0; i < numColecoes; i++) {
        await client.query(
          `INSERT INTO colecoes (catalogo_id, nome, descricao)
           VALUES ($1, $2, $3)`,
          [
            catalogo.id,
            `${colecaoNomes[i]} 2025`,
            `Coleção ${colecaoNomes[i]} com as últimas tendências`,
          ]
        );
      }
    }

    // 9. Cria mensagens de contato
    console.log('💬 Criando mensagens de contato...');
    const mensagens = [
      'Olá, gostaria de saber mais sobre os preços para atacado deste catálogo.',
      'Vocês fazem entrega internacional? Tenho interesse em vários produtos.',
      'Qual o prazo de entrega para pedidos acima de 100 pares?',
      'Os produtos têm garantia? Qual a política de trocas?',
      'Gostaria de receber um orçamento para 500 unidades do tênis esportivo.',
    ];

    const catalogosPublicados = catalogosIds.filter(c => c.status === 'publicado');
    for (let i = 0; i < mensagens.length; i++) {
      const lojista = lojistas[i % lojistas.length];
      const catalogo = catalogosPublicados[i % catalogosPublicados.length];
      
      const { rows: msgRows } = await client.query(
        `INSERT INTO mensagens_contato (catalogo_id, lojista_id, mensagem, status, created_at)
         VALUES ($1, $2, $3, $4, NOW() - INTERVAL '${randomInt(1, 30)} days')
         RETURNING id`,
        [
          catalogo.id,
          lojista.id,
          mensagens[i],
          i < 2 ? 'respondida' : 'nova',
        ]
      );

      // Adiciona respostas para algumas mensagens
      if (i < 2) {
        await client.query(
          `INSERT INTO respostas_admin (admin_id, mensagem_id, resposta)
           VALUES ($1, $2, $3)`,
          [
            admin.id,
            msgRows[0].id,
            'Obrigado pelo interesse! Entraremos em contato em breve com mais informações.',
          ]
        );
      }
    }

    await client.query('COMMIT');
    
    console.log('\n✅ Seed completo!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Resumo dos dados criados:');
    console.log(`   👥 ${usuarios.length} usuários (1 admin, 3 fornecedores, 1 rep, 3 lojistas)`);
    console.log(`   🏪 ${fornecedores.length} vitrines`);
    console.log(`   📚 ${catalogosIds.length} catálogos`);
    console.log(`   👟 ${produtosIds.length} produtos`);
    console.log(`   💬 ${mensagens.length} mensagens de contato`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🔐 Credenciais de acesso (senha: 123456):');
    console.log('   Admin:        admin@exemplo.com');
    console.log('   Fornecedor:   fornecedor1@exemplo.com');
    console.log('   Lojista:      lojista1@exemplo.com');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Erro ao criar seed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

createTablesAndSeed();
