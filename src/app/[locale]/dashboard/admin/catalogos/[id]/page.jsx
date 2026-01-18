'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import AdminGuard from 'components/AdminGuard';
import { Eye, Edit } from 'lucide-react';

export default function CatalogoDetalhesPage() {
  const t = useTranslations('DashboardAdmin');
  const router = useRouter();
  const { id } = useParams();
  const [catalogo, setCatalogo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/v1/catalogos/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(t('ErrorLoadingData'));
        return res.json();
      })
      .then((data) => setCatalogo(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, t]);

  if (loading) return <p className='p-4'>{t('Loading')}</p>;
  if (error) return <p className='p-4 text-red-500'>{error}</p>;
  if (!catalogo) return <p className='p-4'>{t('CatalogNotFound')}</p>;

  // Handlers
  const handleEditarInfo = () =>
    router.push(`/dashboard/admin/catalogos/${id}/editar`);
  const handleVerProduto = (produtoId) =>
    router.push(`/dashboard/admin/produtos/${produtoId}`);

  return (
    <AdminGuard>
      <div className='p-6 space-y-6'>
        {/* Header */}
        <div className='flex justify-between items-center'>
          <h1 className='text-3xl font-bold'>{t('CatalogDetails')}</h1>
          <Link
            href='/dashboard/admin/catalogos'
            className='text-blue-500 hover:underline'
          >
            {t('Back')}
          </Link>
        </div>

        {/* Informações básicas */}
        <section className='p-4 bg-white rounded-lg shadow flex flex-col gap-3'>
          <div className='flex justify-between items-center'>
            <h2 className='text-xl font-semibold'>{t('BasicInfo')}</h2>
            <button
              onClick={handleEditarInfo}
              className='flex items-center gap-1 px-3 py-1 text-sm bg-purple-600 text-white rounded-lg hover:bg-blue-700 transition'
            >
              <Edit size={16} /> {t('Edit')}
            </button>
          </div>
          <p>
            <strong>{t('Name')}:</strong> {catalogo.catalogo.nome}
          </p>
          <p>
            <strong>{t('Description')}:</strong> {catalogo.catalogo.descricao}
          </p>
          <p>
            <strong>{t('Status')}:</strong>{' '}
            <span
              className={`px-2 py-1 rounded-full text-white text-sm font-semibold ${
                catalogo.catalogo.status === 'pendente_aprovacao'
                  ? 'bg-yellow-500'
                  : catalogo.catalogo.status === 'aprovado'
                  ? 'bg-green-500'
                  : 'bg-blue-600'
              }`}
            >
              {catalogo.catalogo.status}
            </span>
          </p>
          <p>
            <strong>{t('Rating')}:</strong>{' '}
            {catalogo.catalogo.rating || t('NoRating')}
          </p>
        </section>

        {/* Coleções */}
        <section className='p-4 bg-white rounded-lg shadow flex flex-col gap-3'>
          <div className='flex justify-between items-center'>
            <h2 className='text-xl font-semibold'>{t('Collections')}</h2>
          </div>
          {catalogo.catalogo.colecoes?.length ? (
            <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2'>
              {catalogo.catalogo.colecoes.map((c) => (
                <li
                  key={c.id}
                  className='bg-gray-50 p-2 rounded shadow flex justify-between items-center'
                >
                  {c.nome}
                </li>
              ))}
            </ul>
          ) : (
            <p>{t('NoCollections')}</p>
          )}
        </section>

        {/* Produtos */}
        <section className='p-4 bg-white rounded-lg shadow flex flex-col gap-3'>
          <div className='flex justify-between items-center'>
            <h2 className='text-xl font-semibold'>{t('Products')}</h2>
          </div>
          {catalogo.catalogo.produtos?.length ? (
            <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2'>
              {catalogo.catalogo.produtos.map((p) => (
                <li
                  key={p.id}
                  className='bg-gray-50 p-2 rounded shadow flex justify-between items-center'
                >
                  <div className='flex items-center gap-2'>
                    {/* Miniatura da primeira imagem */}
                    {p.imagens?.[0] && (
                      <img
                        src={p.imagens[0]}
                        alt={p.nome}
                        className='w-12 h-12 object-cover rounded'
                      />
                    )}
                    <span>{p.nome}</span>
                  </div>

                  <button
                    onClick={() => handleVerProduto(p.id)}
                    className='text-blue-500 hover:underline text-sm flex items-center gap-1'
                  >
                    <Eye size={14} /> {t('View')}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>{t('NoProducts')}</p>
          )}
        </section>

        {/* Metadados */}
        <section className='p-4 bg-white rounded-2xl shadow flex flex-col gap-4'>
          <div className='flex justify-between items-center'>
            <h2 className='text-xl font-semibold'>{t('Metadata')}</h2>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'>
            <div className='bg-gray-50 p-3 rounded-lg hover:shadow-lg transition'>
              <p className='text-gray-500 text-sm'>{t('Continent')}</p>
              <p className='font-medium text-gray-800'>
                {catalogo.catalogo.metadados?.continente || '-'}
              </p>
            </div>

            <div className='bg-gray-50 p-3 rounded-lg hover:shadow-lg transition'>
              <p className='text-gray-500 text-sm'>{t('Country')}</p>
              <p className='font-medium text-gray-800'>
                {catalogo.catalogo.metadados?.pais || '-'}
              </p>
            </div>

            <div className='bg-gray-50 p-3 rounded-lg hover:shadow-lg transition'>
              <p className='text-gray-500 text-sm'>{t('Category')}</p>
              <p className='font-medium text-gray-800'>
                {catalogo.catalogo.metadados?.categoria || '-'}
              </p>
            </div>

            <div className='bg-gray-50 p-3 rounded-lg hover:shadow-lg transition'>
              <p className='text-gray-500 text-sm'>{t('Subcategory')}</p>
              <p className='font-medium text-gray-800'>
                {catalogo.catalogo.metadados?.sub_categoria || '-'}
              </p>
            </div>

            {Array.isArray(catalogo.catalogo.metadados?.especificacao) &&
            catalogo.catalogo.metadados.especificacao.length > 0 ? (
              <div className='bg-gray-50 p-3 rounded-lg hover:shadow-lg transition col-span-full'>
                <p className='text-gray-500 text-sm mb-1'>{t('Specifications')}</p>
                <ul className='list-disc pl-5 text-gray-700'>
                  {catalogo.catalogo.metadados.especificacao.map((esp, idx) => (
                    <li key={idx}>{esp}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </AdminGuard>
  );
}
