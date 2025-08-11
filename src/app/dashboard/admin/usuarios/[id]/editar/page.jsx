// app/usuarios/[id]/editar/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditarUsuarioPage() {
  const router = useRouter();
  const params = useParams();
  const usuarioId = params?.id;

  const [form, setForm] = useState({
    nome: '',
    nome_fantasia: '',
    email: '',
    papel: '',
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const papeis = ['administrador', 'fornecedor', 'representante', 'lojista'];
  // Carrega dados do usuário e opções de papel
  useEffect(() => {
    async function fetchData() {
      try {
        const [userRes] = await Promise.all([
          fetch(`/api/v1/usuarios/${usuarioId}`),
        ]);

        if (!userRes.ok) throw new Error('Erro ao carregar dados');

        const userData = await userRes.json();

        setForm({
          nome: userData.nome || '',
          nome_fantasia: userData.nome_fantasia || '',
          email: userData.email || '',
          papel: userData.papel || '',
        });
      } catch (err) {
        console.error(err);
        setMessage('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    }

    if (usuarioId) fetchData();
  }, [usuarioId]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');

    // Validação simples
    if (!form.nome || !form.email || !form.papel) {
      setMessage('Preencha todos os campos obrigatórios');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setMessage('E-mail inválido');
      return;
    }
    if (!papeis.includes(form.papel)) {
      setMessage('Papel inválido');
      return;
    }

    try {
      const res = await fetch(`/api/v1/usuarios/${usuarioId}/editar`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Erro ao atualizar usuário');

      setMessage('Usuário atualizado com sucesso');
      setTimeout(() => {
        router.push('/dashboard/admin/usuarios');
      }, 1500);
    } catch (err) {
      console.error(err);
      setMessage('Erro ao atualizar usuário');
    }
  }

  if (loading) return <p>Carregando...</p>;

  return (
    <div className='max-w-lg mx-auto p-4'>
      <h1 className='text-xl font-bold mb-4'>Editar Usuário</h1>
      {message && <p className='mb-2 text-sm text-green-500'>{message}</p>}
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block text-sm font-medium'>Nome *</label>
          <input
            type='text'
            name='nome'
            value={form.nome}
            onChange={handleChange}
            className='w-full border px-2 py-1 rounded'
          />
        </div>

        <div>
          <label className='block text-sm font-medium'>Nome Fantasia</label>
          <input
            type='text'
            name='nome_fantasia'
            value={form.nome_fantasia}
            onChange={handleChange}
            className='w-full border px-2 py-1 rounded'
          />
        </div>

        <div>
          <label className='block text-sm font-medium'>E-mail *</label>
          <input
            type='email'
            name='email'
            value={form.email}
            onChange={handleChange}
            className='w-full border px-2 py-1 rounded'
          />
        </div>

        <div>
          <label className='block text-sm font-medium'>Papel *</label>
          <select
            name='papel'
            value={form.papel}
            onChange={handleChange}
            className='w-full border px-2 py-1 rounded'
          >
            <option value=''>Selecione...</option>
            {papeis.map((papel) => (
              <option key={papel} value={papel}>
                {papel}
              </option>
            ))}
          </select>
        </div>

        <button
          type='submit'
          className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
        >
          Salvar alterações
        </button>
      </form>
    </div>
  );
}
