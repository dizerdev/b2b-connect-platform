'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import SellerGuard from 'components/SellerGuard';
import Link from 'next/link';
import sanitizeHtml from 'sanitize-html';

export default function DetalhesVitrinePage() {
  const t = useTranslations('LojistaVitrines');
  const { id } = useParams();
  const router = useRouter();
  const [catalogo, setCatalogo] = useState(null);

  useEffect(() => {
    async function fetchCatalogo() {
      try {
        const res = await fetch(`/api/v1/catalogos/${id}`, {
          cache: 'no-store',
        });
        if (!res.ok) throw new Error('Erro ao carregar catálogo');
        const data = await res.json();
        setCatalogo(data.catalogo);
      } catch (err) {
        console.error(err);
      }
    }
    fetchCatalogo();
  }, [id]);

  if (!catalogo) {
    return <p className='p-4'>{t('LoadingCatalog')}</p>;
  }

  return (
    <SellerGuard>
      {/* Ações */}
      <div className='px-4 py-3 md:px-10 md:py-3 w-full'>
        <div className='flex justify-between items-center mb-4'>
          <button
            onClick={() => router.push(`/dashboard/lojista/mensagens/${id}`)}
            className='px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition'
          >
            {t('RequestService')}
          </button>
          <Link
            href='/dashboard/lojista/vitrines/principal'
            className='text-blue-500 hover:underline'
          >
            {t('Back')}
          </Link>
        </div>
      </div>

      <div className='w-full mx-auto p-6 space-y-10'>
        {/* Cabeçalho com imagem principal */}
        <div className='flex flex-col md:flex-row gap-6 items-start'>
          <div className='w-full md:w-1/3'>
            <img
              src={catalogo.imagem_url || '/assets/placeholder.png'}
              alt={catalogo.nome}
              className='w-full rounded-2xl shadow-md hover:scale-105 transition-transform'
            />
          </div>
          <div className='flex-1 space-y-3'>
            <h1 className='text-3xl font-bold'>{catalogo.nome}</h1>
            <p className='text-gray-600'>{catalogo.descricao}</p>

            <div className='flex flex-wrap gap-2 mt-2'>
              <span className='px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full'>
                {t('Status')}: {catalogo.status}
              </span>
              <span className='px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-full'>
                {t('Rating')}: ⭐ {catalogo.rating || 'N/A'}
              </span>
            </div>

            <p className='text-sm text-gray-500 mt-2'>
              {t('Supplier')}:{' '}
              {catalogo.fornecedor?.nomeFantasia || catalogo.fornecedor?.nome}
            </p>
          </div>
        </div>

        {/* Produtos */}
        <div>
          <h2 className='text-xl font-semibold mb-4'>{t('Products')}</h2>
          {catalogo.produtos?.length ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {catalogo.produtos.map((produto) => (
                <div
                  key={produto.id}
                  className='border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition cursor-pointer group'
                  onClick={() =>
                    router.push(`/dashboard/lojista/produtos/${produto.id}`)
                  }
                >
                  {/* Imagem */}
                  {produto.imagens?.length > 0 && (
                    <div className='h-48 w-full overflow-hidden'>
                      <img
                        src={produto.imagens[0]}
                        alt={produto.nome}
                        className='w-full h-full object-cover group-hover:scale-105 transition-transform'
                      />
                    </div>
                  )}
                  {/* Infos */}
                  <div className='p-4 space-y-2'>
                    <h3 className='font-semibold'>{produto.nome}</h3>

                    <p className='text-sm font-medium'>
                      💰{' '}
                      {produto.preco?.toFixed(2) == 0.0
                        ? t('OnRequest')
                        : `R$ ${produto.preco?.toFixed(2)}`}
                    </p>
                    {produto.destaque && (
                      <span className='inline-block text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full'>
                        {t('Featured')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-sm text-gray-500'>{t('NoProductsAvailable')}</p>
          )}
        </div>

        {/* Coleções */}

        {catalogo.colecoes?.length ? (
          <div>
            <h2 className='text-xl font-semibold mb-4'>{t('Collections')}</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {catalogo.colecoes.map((colecao) => (
                <div
                  key={colecao.id}
                  className='p-4 border rounded-lg hover:shadow-lg transition cursor-pointer'
                >
                  <h3 className='font-medium'>{colecao.nome}</h3>
                  <p className='text-sm text-gray-600'>{colecao.descricao}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Metadados */}
        <div>
          <h2 className='text-xl font-semibold mb-4'>{t('Metadata')}</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
            <div className='p-4 bg-gray-50 rounded-lg hover:shadow'>
              <p>
                🌍 {t('ContinentLabel')}: {catalogo.metadados?.continente}
              </p>
            </div>
            <div className='p-4 bg-gray-50 rounded-lg hover:shadow'>
              <p>
                🇵🇰 {t('CountryLabel')}: {catalogo.metadados?.pais}
              </p>
            </div>
            <div className='p-4 bg-gray-50 rounded-lg hover:shadow'>
              <p>
                📂 {t('CategoryLabel')}: {catalogo.metadados?.categoria}
              </p>
            </div>
            <div className='p-4 bg-gray-50 rounded-lg hover:shadow'>
              <p>
                🗂 {t('SubcategoryLabel')}: {catalogo.metadados?.sub_categoria}
              </p>
            </div>
            <div className='p-4 bg-gray-50 rounded-lg hover:shadow col-span-full'>
              <p>
                ⚙️ {t('Specifications')}:{' '}
                {catalogo.metadados?.especificacao
                  ? typeof catalogo.metadados.especificacao === 'object'
                    ? Object.entries(catalogo.metadados.especificacao)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(' | ')
                    : Array.isArray(catalogo.metadados.especificacao)
                      ? catalogo.metadados.especificacao.join(', ')
                      : String(catalogo.metadados.especificacao)
                  : t('None')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </SellerGuard>
  );
}
