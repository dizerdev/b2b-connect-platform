import db from 'lib/db';
import { requireAuth } from 'lib/authMiddleware';

export async function PATCH(req, { params }) {
  const auth = await requireAuth(req);
  if (!auth.isAuthorized) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }

  if (auth.payload.papel !== 'administrador') {
    return Response.json({ error: 'Acesso negado' }, { status: 403 });
  }

  const { id } = await params;
  const {
    nome,
    email,
    papel,
    nome_fantasia,
    telefone,
    celular,
    cnpj,
    logradouro,
    numero,
    complemento,
    cidade,
    pais,
  } = await req.json();

  if (!nome && !email && !papel && !nome_fantasia) {
    return Response.json({ error: 'Nada para atualizar' }, { status: 400 });
  }

  const fields = [];
  const values = [];
  let index = 1;

  if (email) {
    fields.push(`email = $${index++}`);
    values.push(email);
  }

  if (nome) {
    fields.push(`nome = $${index++}`);
    values.push(nome);
  }

  if (telefone) {
    fields.push(`telefone = $${index++}`);
    values.push(telefone);
  }
  if (celular) {
    fields.push(`celular = $${index++}`);
    values.push(celular);
  }
  if (cnpj) {
    fields.push(`cnpj = $${index++}`);
    values.push(cnpj);
  }
  if (logradouro) {
    fields.push(`logradouro = $${index++}`);
    values.push(logradouro);
  }
  if (numero) {
    fields.push(`numero = $${index++}`);
    values.push(numero);
  }
  if (complemento) {
    fields.push(`complemento = $${index++}`);
    values.push(complemento);
  }
  if (cidade) {
    fields.push(`cidade = $${index++}`);
    values.push(cidade);
  }
  if (pais) {
    fields.push(`pais = $${index++}`);
    values.push(pais);
  }

  if (papel) {
    const papeisValidos = [
      'administrador',
      'fornecedor',
      'representante',
      'lojista',
    ];
    if (!papeisValidos.includes(papel)) {
      return Response.json({ error: 'Papel inválido' }, { status: 400 });
    }
    fields.push(`papel = $${index++}`);
    values.push(papel);
  }

  values.push(id); // para WHERE

  const query = `
    UPDATE usuarios
    SET ${fields.join(', ')}, atualizado_em = NOW()
    WHERE id = $${index}
    RETURNING id, email, nome, nome_fantasia, ativo, criado_em
  `;

  try {
    const result = await db.query(query, values);

    if (result.rowCount === 0) {
      return Response.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    return Response.json({ usuario: result.rows[0] });
  } catch (err) {
    console.error('Erro ao atualizar usuário:', err);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}
