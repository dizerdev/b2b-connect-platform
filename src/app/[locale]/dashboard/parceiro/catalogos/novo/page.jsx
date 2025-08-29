'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import PartnerGuard from 'components/PartnerGuard';

export default function CadastroCatalogoPage() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!nome.trim()) {
      toast.error('O nome é obrigatório.');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch('/api/v1/catalogos/novo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, descricao }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erro ao criar catálogo');
      }

      toast.success('Catálogo criado com sucesso!');
      setTimeout(() => {
        router.push('/dashboard/parceiro/catalogos');
      }, 1500);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PartnerGuard>
      <div className='p-6 max-w-2xl mx-auto'>
        <h1 className='text-2xl font-bold mb-4'>Cadastrar Catálogo</h1>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-1' htmlFor='nome'>
              Nome *
            </label>
            <input
              id='nome'
              type='text'
              className='w-full border rounded p-2'
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              className='block text-sm font-medium mb-1'
              htmlFor='descricao'
            >
              Descrição
            </label>
            <textarea
              id='descricao'
              className='w-full border rounded p-2'
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={4}
            />
          </div>

          <div className='flex gap-2'>
            <button
              type='submit'
              disabled={loading}
              className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50'
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
            <button
              type='button'
              onClick={() => router.push('/dashboard/parceiro/catalogos')}
              className='bg-gray-300 px-4 py-2 rounded hover:bg-gray-400'
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </PartnerGuard>
  );
}
