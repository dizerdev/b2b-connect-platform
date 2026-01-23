'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import AdminGuard from 'components/AdminGuard';
import {
  Eye,
  CheckCircle,
  Upload,
  Star,
  FolderOpen,
  ArrowLeft,
  Filter,
  RotateCcw,
  FolderCheck,
} from 'lucide-react';
import { Card, Badge, Button, Skeleton, IconButton } from 'components/ui';

export default function ListaCatalogosPage() {
  const t = useTranslations('DashboardAdmin');
  const router = useRouter();

  const [catalogos, setCatalogos] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [userRole, setUserRole] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/v1/catalogos?status=${statusFilter || ''}`,
        );
        if (!res.ok) throw new Error(t('ErrorLoadingCatalogs'));
        const data = await res.json();
        setCatalogos(data.catalogos || []);

        const userRes = await fetch('/api/v1/auth/me');
        if (!userRes.ok) throw new Error(t('ErrorLoadingData'));
        const userData = await userRes.json();
        setUserRole(userData.usuario.papel);
      } catch (err) {
        console.error(err);
        setMessage(t('ErrorLoadingData'));
        setMessageType('error');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [statusFilter, t]);

  async function handlePublicar(id) {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/v1/catalogos/${id}/publicar`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error(t('ErrorPublishing'));
      setMessage(t('CatalogPublished'));
      setMessageType('success');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      setMessage(t('ErrorPublishing'));
      setMessageType('error');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleAprovar(id) {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/v1/catalogos/${id}/aprovar`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error(t('ErrorApproving'));
      setMessage(t('CatalogApproved'));
      setMessageType('success');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      setMessage(t('ErrorApproving'));
      setMessageType('error');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReverter(id) {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/v1/catalogos/${id}/reverter`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error(t('ErrorReverting'));
      setMessage(t('CatalogReverted'));
      setMessageType('success');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      setMessage(t('ErrorReverting'));
      setMessageType('error');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleAvaliar(id, rating) {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/v1/catalogos/${id}/rating`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating }),
      });
      if (!res.ok) throw new Error(t('ErrorRating'));
      setMessage(t('RatingRegistered'));
      setMessageType('success');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      setMessage(t('ErrorRating'));
      setMessageType('error');
    } finally {
      setActionLoading(null);
    }
  }

  // Status badge variants
  const statusConfig = {
    pendente_aprovacao: { variant: 'warning', label: t('Pending') },
    aprovado: { variant: 'info', label: t('Approved') },
    publicado: { variant: 'success', label: t('Published') },
  };

  // Filter tabs configuration
  const filterTabs = [
    { value: '', label: t('AllStatus'), count: null },
    { value: 'pendente_aprovacao', label: t('Pending') },
    { value: 'aprovado', label: t('Approved') },
    { value: 'publicado', label: t('Published') },
  ];

  return (
    <AdminGuard>
      <div className='space-y-6'>
        {/* Page Header */}
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div>
            <div className='flex items-center gap-3 mb-1'>
              <Link
                href='/dashboard/admin'
                className='p-2 -ml-2 rounded-lg text-[var(--color-gray-500)] hover:text-[var(--color-gray-700)] hover:bg-[var(--color-gray-100)] transition-colors'
                aria-label='Voltar'
              >
                <ArrowLeft size={20} />
              </Link>
              <h1 className='text-2xl font-heading font-bold text-[var(--color-gray-900)]'>
                {t('CatalogsList')}
              </h1>
            </div>
            <p className='text-[var(--color-gray-500)] ml-10'>
              Gerencie todos os catálogos do sistema
            </p>
          </div>
          <div className='flex items-center gap-2 px-4 py-2 bg-[var(--color-primary-50)] rounded-lg'>
            <FolderOpen size={18} className='text-[var(--color-primary-600)]' />
            <span className='text-sm font-medium text-[var(--color-primary-700)]'>
              {catalogos.length} catálogo{catalogos.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div
            className={`
              p-4 rounded-lg border animate-fade-in-down
              ${
                messageType === 'success'
                  ? 'bg-[var(--color-success-bg)] border-[var(--color-accent-emerald)]/20 text-[var(--color-accent-emerald)]'
                  : 'bg-[var(--color-error-bg)] border-[var(--color-accent-rose)]/20 text-[var(--color-accent-rose)]'
              }
            `}
          >
            <div className='flex items-center gap-2'>
              {messageType === 'success' ? (
                <CheckCircle size={18} />
              ) : (
                <Eye size={18} />
              )}
              {message}
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className='flex items-center gap-2 flex-wrap'>
          <div className='flex items-center gap-1 text-[var(--color-gray-500)] mr-2'>
            <Filter size={16} />
            <span className='text-sm font-medium'>Filtrar:</span>
          </div>
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${
                  statusFilter === tab.value
                    ? 'bg-[var(--color-primary-600)] text-white shadow-md'
                    : 'bg-[var(--color-gray-100)] text-[var(--color-gray-600)] hover:bg-[var(--color-gray-200)]'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Table Card */}
        <Card variant='default' padding={false}>
          <div className='overflow-x-auto'>
            <table className='w-full text-left'>
              <thead>
                <tr className='border-b border-[var(--color-gray-100)]'>
                  <th className='px-5 py-4 text-xs font-semibold text-[var(--color-gray-500)] uppercase tracking-wider'>
                    {t('Cover')}
                  </th>
                  <th className='px-5 py-4 text-xs font-semibold text-[var(--color-gray-500)] uppercase tracking-wider'>
                    {t('Name')}
                  </th>
                  <th className='px-5 py-4 text-xs font-semibold text-[var(--color-gray-500)] uppercase tracking-wider'>
                    {t('Status')}
                  </th>
                  <th className='px-5 py-4 text-xs font-semibold text-[var(--color-gray-500)] uppercase tracking-wider'>
                    {t('Rating')}
                  </th>
                  <th className='px-5 py-4 text-xs font-semibold text-[var(--color-gray-500)] uppercase tracking-wider'>
                    {t('CreatedAt')}
                  </th>
                  <th className='px-5 py-4 text-xs font-semibold text-[var(--color-gray-500)] uppercase tracking-wider'>
                    {t('Actions')}
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-[var(--color-gray-100)]'>
                {loading ? (
                  // Skeleton Loading State
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className='px-5 py-4'>
                        <Skeleton
                          variant='rectangular'
                          width='64px'
                          height='64px'
                          className='rounded-lg'
                        />
                      </td>
                      <td className='px-5 py-4'>
                        <Skeleton variant='text' width='180px' />
                      </td>
                      <td className='px-5 py-4'>
                        <Skeleton variant='text' width='80px' />
                      </td>
                      <td className='px-5 py-4'>
                        <Skeleton variant='text' width='40px' />
                      </td>
                      <td className='px-5 py-4'>
                        <Skeleton variant='text' width='80px' />
                      </td>
                      <td className='px-5 py-4'>
                        <div className='flex gap-2'>
                          <Skeleton
                            variant='rectangular'
                            width='70px'
                            height='32px'
                            className='rounded-lg'
                          />
                          <Skeleton
                            variant='rectangular'
                            width='70px'
                            height='32px'
                            className='rounded-lg'
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : catalogos.length === 0 ? (
                  // Empty State
                  <tr>
                    <td colSpan={6} className='px-5 py-16 text-center'>
                      <div className='flex flex-col items-center gap-3'>
                        <div className='w-16 h-16 rounded-full bg-[var(--color-gray-100)] flex items-center justify-center'>
                          <FolderCheck
                            size={28}
                            className='text-[var(--color-gray-400)]'
                          />
                        </div>
                        <div>
                          <p className='font-medium text-[var(--color-gray-700)]'>
                            Nenhum catálogo encontrado
                          </p>
                          <p className='text-sm text-[var(--color-gray-500)]'>
                            {statusFilter
                              ? 'Tente remover os filtros aplicados'
                              : 'Os catálogos aparecerão aqui quando forem criados'}
                          </p>
                        </div>
                        {statusFilter && (
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => setStatusFilter('')}
                          >
                            Limpar filtros
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  // Data Rows
                  catalogos.map((cat) => (
                    <tr
                      key={cat.id}
                      className='hover:bg-[var(--color-gray-50)] transition-colors group'
                    >
                      {/* Cover Image */}
                      <td className='px-5 py-4'>
                        <div className='w-16 h-16 rounded-lg overflow-hidden bg-[var(--color-gray-100)] flex-shrink-0'>
                          {cat.imagem_url ? (
                            <img
                              src={cat.imagem_url}
                              alt={cat.nome}
                              className='w-full h-full object-cover transition-transform group-hover:scale-110'
                            />
                          ) : (
                            <div className='w-full h-full flex items-center justify-center text-[var(--color-gray-400)]'>
                              <FolderOpen size={24} />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Name */}
                      <td className='px-5 py-4'>
                        <p className='font-medium text-[var(--color-gray-900)]'>
                          {cat.nome}
                        </p>
                      </td>

                      {/* Status Badge */}
                      <td className='px-5 py-4'>
                        <Badge
                          variant={
                            statusConfig[cat.status]?.variant || 'default'
                          }
                          size='sm'
                          dot
                        >
                          {statusConfig[cat.status]?.label || cat.status}
                        </Badge>
                      </td>

                      {/* Rating */}
                      <td className='px-5 py-4'>
                        {cat.rating ? (
                          <div className='flex items-center gap-1 text-[var(--color-accent-amber)]'>
                            <Star size={16} className='fill-current' />
                            <span className='font-medium'>{cat.rating}</span>
                          </div>
                        ) : (
                          <span className='text-[var(--color-gray-400)]'>
                            —
                          </span>
                        )}
                      </td>

                      {/* Created At */}
                      <td className='px-5 py-4'>
                        <span className='text-sm text-[var(--color-gray-600)]'>
                          {new Date(cat.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className='px-5 py-4'>
                        <div className='flex items-center gap-2 flex-wrap'>
                          <Button
                            size='sm'
                            variant='secondary'
                            icon={Eye}
                            onClick={() =>
                              router.push(
                                `/dashboard/admin/catalogos/${cat.id}`,
                              )
                            }
                          >
                            {t('View')}
                          </Button>

                          {userRole === 'administrador' &&
                            cat.status === 'pendente_aprovacao' && (
                              <Button
                                size='sm'
                                variant='primary'
                                icon={CheckCircle}
                                onClick={() => handleAprovar(cat.id)}
                                loading={actionLoading === cat.id}
                              >
                                {t('Approve')}
                              </Button>
                            )}

                          {userRole === 'administrador' &&
                            cat.status === 'aprovado' && (
                              <Button
                                size='sm'
                                variant='primary'
                                icon={Upload}
                                onClick={() => handlePublicar(cat.id)}
                                loading={actionLoading === cat.id}
                              >
                                {t('Publish')}
                              </Button>
                            )}

                          {userRole === 'administrador' &&
                            cat.status === 'publicado' && (
                              <Button
                                size='sm'
                                variant='outline'
                                icon={RotateCcw}
                                onClick={() => handleReverter(cat.id)}
                                loading={actionLoading === cat.id}
                              >
                                {t('Revert')}
                              </Button>
                            )}

                          {userRole === 'administrador' && (
                            <select
                              value={cat.rating || ''}
                              onChange={(e) =>
                                handleAvaliar(cat.id, Number(e.target.value))
                              }
                              className='
                                px-3 py-1.5 text-sm rounded-lg
                                border border-[var(--color-gray-200)]
                                bg-white text-[var(--color-gray-700)]
                                focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/20
                                focus:border-[var(--color-primary-500)]
                                transition-all
                              '
                              aria-label='Avaliar catálogo'
                            >
                              <option value=''>{t('Rate')}</option>
                              {[1, 2, 3, 4, 5].map((n) => (
                                <option key={n} value={n}>
                                  ⭐ {n}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminGuard>
  );
}
