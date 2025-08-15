'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import PartnerGuard from 'components/PartnerGuard';

export default function CadastroProdutoPage() {
  const router = useRouter();
  const params = useParams();
  const catalogoId = params?.id;

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [imagens, setImagens] = useState(['']);
  const [destaque, setDestaque] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImagemChange = (index, value) => {
    const novasImagens = [...imagens];
    novasImagens[index] = value;
    setImagens(novasImagens);
  };

  const adicionarImagem = () => setImagens([...imagens, '']);
  const removerImagem = (index) => {
    const novasImagens = imagens.filter((_, i) => i !== index);
    setImagens(novasImagens);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!nome.trim()) {
      toast.error('O nome é obrigatório.');
      return;
    }

    if (!preco || isNaN(preco)) {
      toast.error('Informe um preço válido.');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`/api/v1/catalogos/${catalogoId}/produtos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          descricao,
          preco: parseFloat(preco),
          imagens: imagens.filter((i) => i.trim() !== ''),
          destaque,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erro ao criar produto');
      }

      toast.success('Produto cadastrado com sucesso!');
      setTimeout(() => {
        router.push(`/dashboard/parceiro/catalogos/${catalogoId}`);
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
        <h1 className='text-2xl font-bold mb-4'>Cadastrar Produto</h1>

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

          <div>
            <label className='block text-sm font-medium mb-1' htmlFor='preco'>
              Preço *
            </label>
            <input
              id='preco'
              type='number'
              step='0.01'
              className='w-full border rounded p-2'
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              required
            />
          </div>

          <div className='space-y-2'>
            <label className='block text-sm font-medium mb-1'>Imagens</label>
            {imagens.map((img, idx) => (
              <div key={idx} className='flex gap-2 items-center'>
                <input
                  type='text'
                  placeholder='URL da imagem'
                  className='w-full border rounded p-2'
                  value={img}
                  onChange={(e) => handleImagemChange(idx, e.target.value)}
                />
                <button
                  type='button'
                  onClick={() => removerImagem(idx)}
                  className='bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700'
                >
                  Remover
                </button>
              </div>
            ))}
            <button
              type='button'
              onClick={adicionarImagem}
              className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
            >
              Adicionar Imagem
            </button>
          </div>

          <div className='flex items-center gap-2'>
            <input
              id='destaque'
              type='checkbox'
              checked={destaque}
              onChange={(e) => setDestaque(e.target.checked)}
            />
            <label htmlFor='destaque' className='text-sm'>
              Produto em destaque
            </label>
          </div>

          <div className='flex gap-2'>
            <button
              type='submit'
              disabled={loading}
              className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50'
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
            <button
              type='button'
              onClick={() =>
                router.push(`/dashboard/parceiro/catalogos/${catalogoId}`)
              }
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
