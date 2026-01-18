'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import AdminGuard from 'components/AdminGuard';

export default function DetalhesMensagemAdminPage() {
  const t = useTranslations('DashboardAdmin');
  const { mid } = useParams();
  const [mensagem, setMensagem] = useState([]);
  const [resposta, setResposta] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchMensagem() {
      try {
        const res = await fetch(`/api/v1/mensagens/${mid}`);
        if (!res.ok) throw new Error(t('ErrorLoadingData'));
        const data = await res.json();
        setMensagem(data);
        if (data.resposta) setResposta(data.resposta);
      } catch (err) {
        console.error(err);
      }
    }
    fetchMensagem();
  }, [mid, t]);

  async function handleResponder() {
    if (!resposta.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/mensagens/${mid}/responder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resposta }),
      });
      if (!res.ok) throw new Error(t('ErrorSendingResponse'));
      const data = await res.json();
      setMensagem({
        ...mensagem,
        status: 'respondida',
        resposta: data.resposta,
        resposta_data_hora: data.resposta_data_hora,
      });
    } catch (err) {
      console.error(err);
      alert(t('ErrorSendingResponse'));
    } finally {
      setLoading(false);
    }
  }

  if (!mensagem) {
    return <p className='p-6'>{t('Loading')}</p>;
  }

  return (
    <AdminGuard>
      <div className='p-6'>
        <div className='flex justify-between items-center mb-4'>
          <h1 className='text-2xl font-bold'>{t('MessageDetails')}</h1>
          <div>
            <Link
              href='/dashboard/admin/mensagens'
              className='text-blue-500 hover:underline'
            >
              {t('Back')}
            </Link>
          </div>
        </div>

        {/* Informações principais */}
        <div className='bg-white shadow rounded-xl p-6 mb-6'>
          <p>
            <span className='font-semibold'>{t('Catalog')}:</span>{' '}
            {mensagem.catalogo_nome}
          </p>
          <p>
            <span className='font-semibold'>{t('Shopkeeper')}:</span>{' '}
            {mensagem.lojista_nome}
          </p>
          <p>
            <span className='font-semibold'>{t('Status')}:</span>{' '}
            {mensagem.status === 'nova' ? (
              <span className='px-2 py-1 text-xs rounded bg-red-100 text-red-700'>
                {t('New')}
              </span>
            ) : (
              <span className='px-2 py-1 text-xs rounded bg-green-100 text-green-700'>
                {t('Answered')}
              </span>
            )}
          </p>
          <p>
            <span className='font-semibold'>{t('ReceivedAt')}:</span>{' '}
            {new Date(mensagem.created_at).toLocaleString()}
          </p>
        </div>

        {/* Mensagem original */}
        <div className='bg-gray-50 rounded-xl p-4 mb-6'>
          <h2 className='font-semibold mb-2'>{t('OriginalMessage')}</h2>
          <p>{mensagem.mensagem}</p>
        </div>

        {/* Resposta */}
        <div className='bg-gray-50 rounded-xl p-4 mb-6'>
          <h2 className='font-semibold mb-2'>{t('Response')}</h2>
          {mensagem.resposta ? (
            <div>
              <p>{mensagem.resposta}</p>
              <p className='text-sm text-gray-500 mt-2'>
                {t('AnsweredAt')}:{' '}
                {new Date(mensagem.resposta_data_hora).toLocaleString()}
              </p>
            </div>
          ) : (
            <div>
              <textarea
                value={resposta}
                onChange={(e) => setResposta(e.target.value)}
                rows={4}
                className='w-full border rounded-lg p-2'
                placeholder={t('TypeResponse')}
              />
              <button
                onClick={handleResponder}
                disabled={loading || !resposta.trim()}
                className='mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50'
              >
                {loading ? t('Sending') : t('SendResponse')}
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminGuard>
  );
}
