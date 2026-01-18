'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import SellerGuard from 'components/SellerGuard';
import ProductGallery from 'components/shared/ProductGallery';
import sanitizeHtml from 'sanitize-html';

export default function DetalhesProdutoLojistaPage() {
  const t = useTranslations('LojistaProducts');
  const { pid } = useParams();
  const router = useRouter();

  const [produto, setProduto] = useState(null);

  useEffect(() => {
    async function fetchProduto() {
      try {
        const res = await fetch(`/api/v1/produtos/${pid}`);
        if (!res.ok) throw new Error('Erro ao buscar produto');
        const data = await res.json();
        setProduto(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchProduto();
  }, [pid]);

  if (!produto) {
    return <div className='p-6'>{t('LoadingProduct')}</div>;
  }

  const imagens = produto.produto.imagens || [];
  const catalogo = produto.catalogos?.[0];

  // Sanitiza o HTML antes de injetar
  const safeDescription = sanitizeHtml(produto.produto.descricao, {
    allowedTags: [
      'div',
      'h1',
      'h2',
      'p',
      'span',
      'strong',
      'em',
      'ul',
      'li',
      'br',
    ],
    allowedAttributes: {
      '*': ['class', 'style'],
    },
  });

  return (
    <SellerGuard>
      <div className='w-full mx-auto p-6'>
        {/* Header */}
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold'>{produto.produto.nome}</h1>
          <button
            onClick={() => router.back()}
            className='text-blue-500 hover:underline'
          >
            {t('Back')}
          </button>
        </div>

        {/* Layout principal */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {/* Galeria de imagens */}
          {imagens.length > 0 ? (
            <ProductGallery images={imagens} />
          ) : (
            <div className='flex items-center justify-center h-80 bg-gray-100 text-gray-500 rounded'>
              {t('NoPhotos')}
            </div>
          )}

          {/* Informações do produto */}
          <div className='flex flex-col gap-4'>
            <div className='bg-white rounded-lg shadow p-4'>
              <p className='mb-2'>{produto.produto.nome || '—'}</p>
              <div className='mb-2'>
                <span className='font-semibold'>{t('Description')}</span>{' '}
                <div
                  className='prose max-w-none itens-center'
                  dangerouslySetInnerHTML={{ __html: safeDescription }}
                />
              </div>
              <p className='mb-2'>
                <span className='font-semibold'>{t('Price')}</span>{' '}
                {catalogo?.preco
                  ? `R$ ${catalogo.preco.toFixed(2)}`
                  : t('OnRequest')}
              </p>
            </div>

            <button
              onClick={() =>
                router.push(
                  `/dashboard/lojista/vitrines/individual/${catalogo?.fornecedor_id}`,
                )
              }
              className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
            >
              {t('ViewSupplierShowcase')}
            </button>
          </div>
        </div>

        {/* Grades */}
        <div className='bg-white rounded-lg shadow p-4 mt-8'>
          <h2 className='text-lg font-semibold mb-4'>{t('AvailableGrades')}</h2>
          {produto.grades?.length > 0 ? (
            <table className='w-full border-collapse border'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='border px-4 py-2'>{t('Color')}</th>
                  <th className='border px-4 py-2'>{t('Size')}</th>
                  <th className='border px-4 py-2'>{t('Type')}</th>
                  <th className='border px-4 py-2'>{t('ReadyDelivery')}</th>
                  <th className='border px-4 py-2'>{t('Stock')}</th>
                </tr>
              </thead>
              <tbody>
                {produto.grades.map((g, idx) => (
                  <tr key={idx}>
                    <td className='border px-4 py-2'>{g.cor}</td>
                    <td className='border px-4 py-2'>{g.tamanho}</td>
                    <td className='border px-4 py-2'>{g.tipo}</td>
                    <td className='border px-4 py-2'>
                      {g.estoque ? t('Yes') : t('No')}
                    </td>
                    <td className='border px-4 py-2'>
                      {g.estoque > 0 ? g.estoque : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className='text-gray-500'>{t('NoGrades')}</p>
          )}
        </div>
      </div>
    </SellerGuard>
  );
}
