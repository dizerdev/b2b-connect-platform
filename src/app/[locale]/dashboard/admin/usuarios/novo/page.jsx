'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminGuard from 'components/AdminGuard';

export default function NovoUsuarioPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    nome: '',
    nome_fantasia: '',
    email: '',
    senha: '',
    papel: '',
  });

  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState(null);

  const papeis = ['administrador', 'fornecedor', 'representante', 'lojista'];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem(null);

    // Validações simples no client
    if (!form.nome.trim())
      return setMensagem({ tipo: 'erro', texto: 'Nome é obrigatório.' });
    if (!form.nome_fantasia.trim())
      return setMensagem({
        tipo: 'erro',
        texto: 'Nome Fantasia é obrigatório.',
      });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return setMensagem({ tipo: 'erro', texto: 'E-mail inválido.' });
    if (form.senha.length < 6)
      return setMensagem({
        tipo: 'erro',
        texto: 'Senha deve ter no mínimo 6 caracteres.',
      });
    if (!papeis.includes(form.papel))
      return setMensagem({ tipo: 'erro', texto: 'Papel inválido.' });

    try {
      setLoading(true);

      const res = await fetch('/api/v1/usuarios/novo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const erro = await res.json();
        throw new Error(erro.error || 'Erro ao criar usuário');
      }

      setMensagem({ tipo: 'sucesso', texto: 'Usuário criado com sucesso!' });

      setTimeout(() => {
        router.push('/dashboard/admin/usuarios');
      }, 1500);
    } catch (error) {
      setMensagem({ tipo: 'erro', texto: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminGuard>
      <div className='p-6 max-w-lg mx-auto'>
        <h1 className='text-2xl font-bold mb-6'>Novo Usuário</h1>

        {mensagem && (
          <div
            className={`p-3 mb-4 rounded ${
              mensagem.tipo === 'sucesso'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {mensagem.texto}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block mb-1 font-medium'>Nome</label>
            <input
              type='text'
              name='nome'
              value={form.nome}
              onChange={handleChange}
              className='border border-gray-300 rounded px-3 py-2 w-full'
            />
          </div>

          <div>
            <label className='block mb-1 font-medium'>Nome Fantasia</label>
            <input
              type='text'
              name='nome_fantasia'
              value={form.nome_fantasia}
              onChange={handleChange}
              className='border border-gray-300 rounded px-3 py-2 w-full'
            />
          </div>

          <div>
            <label className='block mb-1 font-medium'>E-mail</label>
            <input
              type='email'
              name='email'
              value={form.email}
              onChange={handleChange}
              className='border border-gray-300 rounded px-3 py-2 w-full'
            />
          </div>

          <div>
            <label className='block mb-1 font-medium'>Senha</label>
            <input
              type='password'
              name='senha'
              value={form.senha}
              onChange={handleChange}
              className='border border-gray-300 rounded px-3 py-2 w-full'
            />
          </div>

          <div>
            <label className='block mb-1 font-medium'>Papel</label>
            <select
              name='papel'
              value={form.papel}
              onChange={handleChange}
              className='border border-gray-300 rounded px-3 py-2 w-full'
            >
              <option value=''>Selecione...</option>
              {papeis.map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className='flex gap-4'>
            <button
              type='submit'
              disabled={loading}
              className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded'
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>

            <button
              type='button'
              onClick={() => router.push('/dashboard/admin/usuarios')}
              className='bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded'
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </AdminGuard>
  );
}
