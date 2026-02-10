# 👞 ShoesNetWorld

**Conectando a Indústria Calçadista: Lojistas, Representantes e Fornecedores.**

Este projeto é uma plataforma completa desenvolvida com **Next.js 15** e **React 19**, focada em otimizar o relacionamento comercial no setor de calçados.

---

## 🚀 Tecnologias

O projeto utiliza uma stack moderna e robusta para garantir performance, escalabilidade e boa experiência de desenvolvedor:

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Linguagem**: JavaScript (Módulos ES)
- **Frontend**: React 19, [Tailwind CSS 4](https://tailwindcss.com/)
- **Banco de Dados**: PostgreSQL
- **ORM/Query**: `pg` (node-postgres) com migrações via `node-pg-migrate`
- **Autenticação**: JWT (Custom implementation), `bcrypt`, `cookie`
- **Internacionalização**: `next-intl`
- **Uploads**: UploadThing
- **Validação**: Zod
- **Estado Global**: Zustand
- **Infraestrutura Local**: Docker Compose

---

## ✨ Funcionalidades Principais

- **Painéis Dedicados**:
  - 🕵️ **Admin**: Gestão completa do sistema.
  - 🤝 **Representante/Fornecedor**: Gestão de catálogos e pedidos.
  - 🛍️ **Lojista**: Visualização de produtos e realização de compras.
- **Mapa Público**: Visualização interativa (`/public/mapa`).
- **Autenticação Segura**: Controle de acesso baseado em papéis (RBAC).
- **Upload de Imagens**: Integração com serviços de armazenamento para catálogos.

---

## 🛠️ Instalação e Configuração

Siga os passos abaixo para rodar o projeto localmente.

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v18+)
- [Docker](https://www.docker.com/) (para o banco de dados)

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/shoesnetworld.git
cd shoesnetworld
```

### 2. Configuração de Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto baseado no exemplo:

```bash
cp .env.example .env
```

Garanta que as seguintes variáveis estejam definidas no seu arquivo `.env`:

```env
# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=local_user
POSTGRES_DB=local_db
POSTGRES_PASSWORD=local_password
DATABASE_URL=postgres://local_user:local_password@localhost:5432/local_db

# Auth
JWT_SECRET=your_jwt_secret_here

# UploadThing
UPLOADTHING_APP_ID=your_app_id
UPLOADTHING_SECRET=your_secret_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Resend (Email)
RESEND_API_KEY=re_123456789
```

Preencha as variáveis necessárias (especialmente chaves de API se for testar uploads/emails). Para desenvolvimento local com Docker, as credenciais de banco padrão no `.env.example` já funcionam com o comando do passo 4.

### 3. Instale as Dependências

```bash
npm install
```

### 4. Suba o Banco de Dados

Utilizamos Docker Compose para facilitar a configuração do PostgreSQL.

```bash
npm run services:up
```

_Para parar o banco depois:_ `npm run services:stop`

### 5. Popule o Banco de Dados (Seed)

Para criar as tabelas e inserir dados iniciais:

```bash
npm run seed
```

### 6. Inicie o Servidor de Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 📂 Estrutura do Projeto

```
src/
├── app/              # Next.js App Router (Páginas e Rotas de API)
│   ├── [locale]/     # Rotas internacionalizadas
│   └── api/          # Endpoints de API Backend
├── components/       # Componentes React Reutilizáveis
├── middleware.js     # Middleware de Auth e Internacionalização
lib/
├── db.js             # Conexão com Banco de Dados
├── auth.js           # Lógica de Autenticação
└── seed.js           # Script de População do Banco
infra/
└── compose-pg.yaml   # Configuração Docker do PostgreSQL
messages/             # Arquivos de tradução (i18n)
```

---

## 📄 Licença

Este projeto é de uso livre para fins de estudo e portfólio.
Desenvolvido por **Diego Santos Dev**.
