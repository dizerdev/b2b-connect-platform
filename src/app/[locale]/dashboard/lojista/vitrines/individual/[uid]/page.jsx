'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import SellerGuard from 'components/SellerGuard';

export default function VitrineFornecedorPage() {
  const t = useTranslations('LojistaVitrines');
  const { uid } = useParams();
  const router = useRouter();

  const [catalogos, setCatalogos] = useState([]);
  const [fornecedor, setFornecedor] = useState(null);
  const [ordenacao, setOrdenacao] = useState('nome_asc');

  // Fetch inicial
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          `/api/v1/vitrines/individual/${uid}?ordenacao=${ordenacao}`
        );
        if (!res.ok) throw new Error('Erro ao carregar catálogos');
        const data = await res.json();
        setFornecedor(data.usuario || null);
        setCatalogos(data.catalogos || []);
      } catch (err) {
        console.error(err);
      }
    }
    if (uid) fetchData();
  }, [uid, ordenacao]);

  return (
    <SellerGuard>
      <div className='p-6 space-y-6'>
        {/* Cabeçalho */}
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-bold'>
            {fornecedor ? `${t('CatalogsOf')} ${fornecedor.nome}` : t('Loading')}
          </h1>
          <button
            onClick={() => router.back()}
            className='px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300'
          >
            {t('BackButton')}
          </button>
        </div>

        {/* Filtro de Ordenação */}
        <div className='flex items-center space-x-4'>
          <label className='text-sm font-medium'>{t('SortBy')}:</label>
          <select
            value={ordenacao}
            onChange={(e) => setOrdenacao(e.target.value)}
            className='border rounded-lg px-3 py-2'
          >
            <option value='nome'>{t('Name')}</option>
            <option value='rating'>{t('Rating')}</option>
            <option value='data'>{t('Date')}</option>
          </select>
        </div>

        {/* Lista de Catálogos */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {catalogos.length > 0 ? (
            catalogos.map((cat) => (
              <div
                key={cat.id}
                className='border rounded-lg p-4 shadow hover:shadow-md transition'
              >
                <h2 className='font-bold text-lg'>{cat.nome}</h2>
                <p className='text-sm text-gray-600'>{t('Status')}: {cat.status}</p>
                <p className='text-sm'>⭐ {cat.rating}</p>
              </div>
            ))
          ) : (
            <p className='text-gray-600'>{t('NoCatalogsFound')}</p>
          )}
        </div>
      </div>
    </SellerGuard>
  );
}
