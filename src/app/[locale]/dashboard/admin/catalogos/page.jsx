'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import AdminGuard from 'components/AdminGuard';
import { Eye, CheckCircle, Upload, Star } from 'lucide-react';

export default function ListaCatalogosPage() {
  const t = useTranslations('DashboardAdmin');
  const router = useRouter();

  const [catalogos, setCatalogos] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          `/api/v1/catalogos?status=${statusFilter || ''}`
        );
        if (!res.ok) throw new Error(t('ErrorLoadingCatalogs'));
        const data = await res.json();
        setCatalogos(data.catalogos);

        const userRes = await fetch('/api/v1/auth/me');
        if (!userRes.ok) throw new Error(t('ErrorLoadingData'));
        const userData = await userRes.json();
        setUserRole(userData.usuario.papel);
      } catch (err) {
        console.error(err);
        setMessage(t('ErrorLoadingData'));
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [statusFilter, t]);

  async function handlePublicar(id) {
    try {
      const res = await fetch(`/api/v1/catalogos/${id}/publicar`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error(t('ErrorPublishing'));
      setMessage(t('CatalogPublished'));
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      setMessage(t('ErrorPublishing'));
    }
  }

  async function handleAprovar(id) {
    try {
      const res = await fetch(`/api/v1/catalogos/${id}/aprovar`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error(t('ErrorApproving'));
      setMessage(t('CatalogApproved'));
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      setMessage(t('ErrorApproving'));
    }
  }

  async function handleReverter(id) {
    try {
      const res = await fetch(`/api/v1/catalogos/${id}/reverter`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error(t('ErrorReverting'));
      setMessage(t('CatalogReverted'));
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      setMessage(t('ErrorReverting'));
    }
  }

  async function handleAvaliar(id, rating) {
    try {
      const res = await fetch(`/api/v1/catalogos/${id}/rating`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating }),
      });
      if (!res.ok) throw new Error(t('ErrorRating'));
      setMessage(t('RatingRegistered'));
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      setMessage(t('ErrorRating'));
    }
  }
  if (loading) return <p>{t('Loading')}</p>;

  return (
    <AdminGuard>
      <div className='p-6'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-3xl font-bold'>{t('CatalogsList')}</h1>
          <Link
            href='/dashboard/admin'
            className='text-blue-600 hover:underline'
          >
            {t('Back')}
          </Link>
        </div>

        {message && <p className='mb-4 text-green-600'>{message}</p>}

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
                        router.push(`/dashboard/admin/catalogos/${cat.id}`)
                      }
                      className='flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'
                    >
                      <Eye size={16} /> {t('View')}
                    </button>

                    {userRole === 'administrador' &&
                      cat.status === 'pendente_aprovacao' && (
                        <button
                          onClick={() => handleAprovar(cat.id)}
                          className='flex items-center gap-1 px-3 py-1 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition'
                        >
                          <CheckCircle size={16} /> {t('Approve')}
                        </button>
                      )}

                    {userRole === 'administrador' &&
                      cat.status === 'aprovado' && (
                        <button
                          onClick={() => handlePublicar(cat.id)}
                          className='flex items-center gap-1 px-3 py-1 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition'
                        >
                          <Upload size={16} /> {t('Publish')}
                        </button>
                      )}

                    {userRole === 'administrador' &&
                      cat.status === 'publicado' && (
                        <button
                          onClick={() => handleReverter(cat.id)}
                          className='flex items-center gap-1 px-3 py-1 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition'
                        >
                          <Upload size={16} /> {t('Revert')}
                        </button>
                      )}

                    {userRole === 'administrador' && (
                      <select
                        value={cat.rating || ''}
                        onChange={(e) =>
                          handleAvaliar(cat.id, Number(e.target.value))
                        }
                        className='border px-2 py-1 rounded text-sm'
                      >
                        <option value=''>{t('Rate')}</option>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminGuard>
  );
}
