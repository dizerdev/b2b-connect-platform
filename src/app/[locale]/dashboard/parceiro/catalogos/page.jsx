'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import PartnerGuard from 'components/PartnerGuard';
import { EmptyState } from 'components/ui';
import Link from 'next/link';
import { Eye, Star, SquarePen } from 'lucide-react';

export default function ListaCatalogosPage() {
  const t = useTranslations('DashboardParceiro');
  const router = useRouter();

  const [catalogos, setCatalogos] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          `/api/v1/catalogos/usuario?status=${statusFilter || ''}`,
        );
        if (!res.ok) throw new Error(t('ErrorLoadingData'));
        const data = await res.json();
        setCatalogos(data.catalogos);
      } catch (err) {
        console.error(err);
        setMessage(t('ErrorLoadingData'));
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [statusFilter, router, t]);

  function handleCriar() {
    router.push('/dashboard/parceiro/catalogos/novo');
  }

  function handleEditar(id) {
    router.push(`/dashboard/parceiro/catalogos/${id}/editar`);
  }

  if (loading) return <p className='p-4'>{t('Loading')}</p>;

  return (
    <PartnerGuard>
      <div className='p-6'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-3xl font-bold'>{t('CatalogsList')}</h1>
          <div className='flex gap-4'>
            <Link
              href='/dashboard/parceiro'
              className='text-sm text-blue-500 hover:underline'
            >
              {t('Back')}
            </Link>
            <button
              onClick={handleCriar}
              className='bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition'
            >
              {t('NewCatalog')}
            </button>
          </div>
        </div>

        {/* Mensagem de erro */}
        {message && <p className='mb-4 text-sm text-red-500'>{message}</p>}

        {/* Filtro */}
        <div className='flex gap-4 mb-6'>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className='border px-3 py-2 rounded-lg shadow-sm'
          >
            <option value=''>{t('AllStatus')}</option>
            <option value='pendente_aprovacao'>{t('Pending')}</option>
            <option value='aprovado'>{t('Approved')}</option>
            <option value='publicado'>{t('Published')}</option>
          </select>
        </div>

        {/* Tabela */}
        <div className='overflow-x-auto rounded-xl shadow'>
          <table className='w-full text-left border-collapse'>
            <thead className='bg-gray-100 text-gray-700'>
              <tr>
                <th className='px-4 py-3'>{t('Cover')}</th>
                <th className='px-4 py-3'>{t('Name')}</th>
                <th className='px-4 py-3'>{t('Status')}</th>
                <th className='px-4 py-3'>{t('Rating')}</th>
                <th className='px-4 py-3'>{t('CreatedAt')}</th>
                <th className='px-4 py-3'>{t('Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {catalogos.map((cat, idx) => (
                <tr
                  key={cat.id}
                  className={`${
                    idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } hover:bg-gray-100 transition`}
                >
                  {/* Miniatura da capa */}
                  <td className='px-4 py-3'>
                    <div className='w-16 h-16 bg-gray-200 rounded flex items-center justify-center overflow-hidden'>
                      <img
                        src={cat.imagem_url || '/assets/empty.jpg'}
                        alt={`Imagem ${idx}`}
                        className='w-20 h-20 object-cover rounded'
                      />
                    </div>
                  </td>

                  <td className='px-4 py-3 font-semibold text-gray-800'>
                    {cat.nome}
                  </td>

                  <td className='px-4 py-3'>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                        cat.status === 'pendente_aprovacao'
                          ? 'bg-yellow-100 text-yellow-700'
                          : cat.status === 'aprovado'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {cat.status}
                    </span>
                  </td>

                  <td className='px-4 py-3'>
                    {cat.rating ? (
                      <div className='flex items-center gap-1 text-yellow-500'>
                        <Star className='w-4 h-4 fill-current' />
                        {cat.rating}
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>

                  <td className='px-4 py-3 text-sm text-gray-600'>
                    {new Date(cat.created_at).toLocaleDateString()}
                  </td>

                  <td className='px-4 py-3 flex gap-2'>
                    <button
                      onClick={() =>
                        router.push(`/dashboard/parceiro/catalogos/${cat.id}`)
                      }
                      className='flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'
                    >
                      <Eye size={16} /> {t('View')}
                    </button>
                    <button
                      onClick={() => handleEditar(cat.id)}
                      className='flex items-center gap-1 px-3 py-1 text-sm bg-purple-600 text-white rounded-lg hover:bg-blue-700 transition'
                    >
                      <SquarePen size={16} /> {t('Edit')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {catalogos.length === 0 && (
            <EmptyState.NoCatalogs createHref='/dashboard/parceiro/catalogos/novo' />
          )}
        </div>
      </div>
    </PartnerGuard>
  );
}
