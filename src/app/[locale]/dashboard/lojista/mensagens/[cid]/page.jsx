'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import SellerGuard from 'components/SellerGuard';

export default function EnvioMensagemPage() {
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { cid } = useParams();

  async function handleEnviar() {
    if (!mensagem.trim()) {
      toast.error('Digite uma mensagem antes de enviar.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/v1/mensagens/enviar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ catalogo_id: cid, mensagem }),
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

  return (
    <SellerGuard>
      <div className='p-6 max-w-2xl mx-auto'>
        <h1 className='text-2xl font-bold mb-4'>Enviar Mensagem</h1>

        <div className='mb-4'>
          <label className='block text-sm font-medium mb-1'>Catálogo</label>
          {cid ? (
            <p className='text-gray-700'>{cid}</p>
          ) : (
            <p className='text-red-500 text-sm'>Nenhum catálogo selecionado</p>
          )}
        </div>

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

        <button
          onClick={handleEnviar}
          disabled={loading || !mensagem.trim() || !cid}
          className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50'
        >
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </div>
    </SellerGuard>
  );
}
