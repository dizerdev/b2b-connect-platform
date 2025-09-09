'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import SellerGuard from 'components/SellerGuard';

export default function EnvioMensagemPage() {
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);
  const [catalogo, setCatalogo] = useState(null);
  const [produtosSelecionados, setProdutosSelecionados] = useState([]);

  const router = useRouter();
  const { cid } = useParams();

  // Busca catálogo
  useEffect(() => {
    if (!cid) return;

    async function fetchCatalogo() {
      try {
        const res = await fetch(`/api/v1/catalogos/${cid}`, {
          cache: 'no-store',
        });
        if (!res.ok) throw new Error('Erro ao carregar catálogo.');
        const data = await res.json();
        setCatalogo(data.catalogo);
      } catch (err) {
        toast.error(err.message || 'Erro ao carregar catálogo.');
      }
    }

    fetchCatalogo();
  }, [cid]);

  function toggleProduto(id) {
    setProdutosSelecionados((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  async function handleEnviar() {
    if (!mensagem.trim()) {
      toast.error('Digite uma mensagem antes de enviar.');
      return;
    }

    if (produtosSelecionados.length === 0) {
      toast.error('Selecione pelo menos um produto.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/v1/mensagens/enviar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          catalogo_id: cid,
          mensagem,
          produtos: produtosSelecionados,
        }),
      });

      if (!res.ok) throw new Error('Erro ao enviar mensagem.');

      toast.success('Mensagem enviada com sucesso!');
      router.push('/dashboard/lojista/mensagens');
    } catch (err) {
      toast.error(err.message || 'Erro inesperado.');
    } finally {
      setLoading(false);
    }
  }

  if (!catalogo) return <p className='p-4'>Carregando catálogo...</p>;
  console.log(catalogo);

  return (
    <SellerGuard>
      <div className='px-4 py-3 md:px-10 md:py-3 w-full'>
        <div className='flex justify-between items-center mb-4'>
          <h1 className='text-2xl font-bold mb-4'>Solicitar atendimento</h1>
          <button
            className='text-blue-500 hover:underline'
            onClick={() => router.back()}
          >
            ← Voltar
          </button>
        </div>

        {/* Catálogo */}
        <div className='mb-4'>
          <label className='block text-sm font-medium mb-1'>Catálogo</label>
          <p className='text-gray-700'>{catalogo.nome}</p>
        </div>

        {/* Produtos */}
        {catalogo.produtos?.length > 0 && (
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-1'>Produtos</label>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
              {catalogo.produtos.map((produto) => (
                <label
                  key={produto.id}
                  className='flex items-center gap-2 border rounded-lg p-2 hover:bg-gray-100 cursor-pointer'
                >
                  <input
                    type='checkbox'
                    checked={produtosSelecionados.includes(produto.id)}
                    onChange={() => toggleProduto(produto.id)}
                  />
                  <span>{produto.nome}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Mensagem */}
        <div className='mb-4'>
          <label className='block text-sm font-medium mb-1'>Mensagem</label>
          <textarea
            className='w-full border rounded-lg p-2 focus:ring focus:ring-blue-500'
            rows={5}
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            maxLength={500}
          />
          <p className='text-sm text-gray-500 mt-1'>
            {mensagem.length}/500 caracteres
          </p>
        </div>

        {/* Botão */}
        <button
          onClick={handleEnviar}
          disabled={
            loading || !mensagem.trim() || produtosSelecionados.length === 0
          }
          className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50'
        >
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </div>
    </SellerGuard>
  );
}
