// app/catalogos/[catalogoId]/produtos/[produtoId]/editar/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function EdicaoProdutoPage() {
  const router = useRouter();
  const params = useParams();
  const { pid } = params;

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [catalogoId, setCatalogoId] = useState('');
  const [imagens, setImagens] = useState(['']);
  const [destaque, setDestaque] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarProduto();
  }, []);

  async function carregarProduto() {
    try {
      const res = await fetch(`/api/v1/produtos/${pid}`);
      if (!res.ok) throw new Error('Erro ao carregar produto');
      const data = await res.json();
      setNome(data.produto.nome || '');
      setDescricao(data.produto.descricao || '');
      setPreco(data.catalogos[0].preco || '');
      setImagens(
        data.produto.imagens && data.produto.imagens.length > 0
          ? data.produto.imagens
          : ['']
      );
      setCatalogoId(data.catalogos[0].catalogo_id);
      setDestaque(data.catalogos[0].destaque);
    } catch (err) {
      toast.error(err.message);
    }
  }

  const handleImagemChange = (index, value) => {
    const novas = [...imagens];
    novas[index] = value;
    setImagens(novas);
  };

  const adicionarImagem = () => setImagens([...imagens, '']);
  const removerImagem = (index) => {
    const novas = imagens.filter((_, i) => i !== index);
    setImagens(novas);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!nome.trim()) {
      toast.error('O nome é obrigatório.');
      return;
    }
    if (!preco || isNaN(preco) || parseFloat(preco) <= 0) {
      toast.error('Informe um preço válido.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `/api/v1/catalogos/${catalogoId}/produtos/${pid}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nome,
            descricao,
            imagens: imagens.filter((i) => i.trim() !== ''),
            preco: parseFloat(preco),
            destaque: true,
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erro ao atualizar produto');
      }

      toast.success('Produto atualizado com sucesso!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
      router.push(`/dashboard/parceiro/produtos/${pid}`);
    }
  }

  return (
    <div className='p-6 max-w-2xl mx-auto'>
      <h1 className='text-2xl font-bold mb-4'>Editar Produto</h1>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label htmlFor='nome' className='block text-sm font-medium mb-1'>
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
          <label htmlFor='descricao' className='block text-sm font-medium mb-1'>
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
          <label htmlFor='preco' className='block text-sm font-medium mb-1'>
            Preço *
          </label>
          <input
            id='preco'
            type='number'
            step='1'
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
            id='ativo'
            type='checkbox'
            checked={destaque}
            onChange={(e) => setDestaque(e.target.checked)}
          />
          <label htmlFor='ativo' className='text-sm'>
            Destaque
          </label>
        </div>

        <div className='flex gap-2'>
          <button
            type='submit'
            disabled={loading}
            className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50'
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
          <button
            type='button'
            onClick={() => router.push(`/dashboard/parceiro/produtos/${pid}`)}
            className='bg-gray-300 px-4 py-2 rounded hover:bg-gray-400'
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
