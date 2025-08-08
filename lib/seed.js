import 'dotenv/config';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const ddl = `
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  nome_fantasia TEXT NOT NULL,
  papel TEXT NOT NULL CHECK (papel IN ('administrador', 'fornecedor', 'representante', 'lojista')),
  senha_hash TEXT NOT NULL,
  vitrine_id UUID,
  ativo BOOLEAN NOT NULL DEFAULT true,
  criado_em TIMESTAMP NOT NULL DEFAULT NOW(),
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
  nome TEXT NOT NULL,
  descricao TEXT,
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
  lojista_id UUID NOT NULL REFERENCES usuarios(id),
  catalogo_id UUID NOT NULL REFERENCES catalogos(id),
  mensagem TEXT NOT NULL,
  data_hora TIMESTAMP NOT NULL DEFAULT NOW(),
  respondida BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS respostas_admin (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES usuarios(id),
  mensagem_id UUID NOT NULL UNIQUE REFERENCES mensagens_contato(id),
  resposta TEXT NOT NULL,
  data_hora TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS textos_traduzidos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chave TEXT NOT NULL,
  idioma TEXT NOT NULL,
  valor TEXT NOT NULL,
  UNIQUE (chave, idioma)
);

CREATE TABLE catalogo_metadados (
  catalogo_id UUID REFERENCES catalogos(id) ON DELETE CASCADE,
  continente TEXT NOT NULL,
  pais TEXT NOT NULL,
  categoria TEXT NOT NULL,
  especificacao TEXT NOT NULL,
  PRIMARY KEY (catalogo_id, especificacao)
);

CREATE INDEX IF NOT EXISTS idx_catalogos_status ON catalogos(status);
CREATE INDEX IF NOT EXISTS idx_produtos_catalogo_catalogo_id ON produtos_catalogo(catalogo_id);
CREATE INDEX IF NOT EXISTS idx_grades_produto_id ON grades(produto_id);
CREATE INDEX IF NOT EXISTS idx_logs_usuario ON logs_de_acao(usuario_id);
CREATE INDEX IF NOT EXISTS idx_logs_referencia ON logs_de_acao(referencia_id);
`;

const senhaClara = '123456'; // senha padrão para todos
const hash = await bcrypt.hash(senhaClara, 10);

async function createTablesAndSeed() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Cria as tabelas
    await client.query(ddl);

    // Criação da extensão para UUID (caso ainda não tenha)
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Insere os usuários com senha hash
    const { rows } = await client.query(
      `INSERT INTO usuarios (email, nome, papel, senha_hash) VALUES
       ('admin@exemplo.com', 'Administrador', 'administrador', $1),
       ('fornecedor@exemplo.com', 'Fornecedor Teste', 'fornecedor', $1),
       ('representante@exemplo.com', 'Representante Teste', 'representante', $1),
       ('lojista@exemplo.com', 'Lojista Teste', 'lojista', $1)
       RETURNING id, papel`,
      [hash]
    );

    // Cria vitrine para o fornecedor
    const fornecedor = rows.find((r) => r.papel === 'fornecedor');
    if (fornecedor) {
      await client.query(
        `INSERT INTO vitrines_individuais (usuario_id, slug, titulo, descricao, exibir_contatos) VALUES
         ($1, 'vitrine-fornecedor', 'Vitrine do Fornecedor', 'Descrição da vitrine', true)`,
        [fornecedor.id]
      );
    }

    await client.query('COMMIT');
    console.log('Tabelas criadas e dados seed inseridos com sucesso.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao criar tabelas ou inserir dados seed:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

createTablesAndSeed();
