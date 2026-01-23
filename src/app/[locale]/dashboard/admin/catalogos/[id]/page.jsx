'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import AdminGuard from 'components/AdminGuard';
import {
  Eye,
  Edit,
  ArrowLeft,
  FolderOpen,
  Star,
  Package,
  Layers,
  MapPin,
  Tag,
  Globe,
  List,
  AlertCircle,
} from 'lucide-react';
import { Card, Badge, Button, Skeleton } from 'components/ui';

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

  // Status badge configuration
  const statusConfig = {
    pendente_aprovacao: { variant: 'warning', label: t('Pending') },
    aprovado: { variant: 'info', label: t('Approved') },
    publicado: { variant: 'success', label: t('Published') },
  };

  // Handlers
  const handleEditarInfo = () =>
    router.push(`/dashboard/admin/catalogos/${id}/editar`);
  const handleVerProduto = (produtoId) =>
    router.push(`/dashboard/admin/produtos/${produtoId}`);

  // Loading State
  if (loading) {
    return (
      <AdminGuard>
        <div className='space-y-6'>
          {/* Header Skeleton */}
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
            <div className='flex items-center gap-3'>
              <Skeleton variant='circular' width='40px' height='40px' />
              <div className='space-y-2'>
                <Skeleton variant='text' width='200px' height='28px' />
                <Skeleton variant='text' width='150px' />
              </div>
            </div>
            <Skeleton
              variant='rectangular'
              width='120px'
              height='40px'
              className='rounded-lg'
            />
          </div>

          {/* Content Skeleton */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <div className='lg:col-span-2 space-y-6'>
              <Card padding={false}>
                <div className='p-5 space-y-4'>
                  <Skeleton variant='text' width='40%' />
                  <Skeleton variant='text' width='100%' />
                  <Skeleton variant='text' width='80%' />
                </div>
              </Card>
              <Card padding={false}>
                <div className='p-5'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className='flex items-center gap-3 p-3 bg-[var(--color-gray-50)] rounded-lg'
                      >
                        <Skeleton
                          variant='rectangular'
                          width='48px'
                          height='48px'
                          className='rounded-lg'
                        />
                        <Skeleton variant='text' width='60%' />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
            <div className='space-y-6'>
              <Card padding={false}>
                <div className='p-5 space-y-3'>
                  <Skeleton variant='text' width='60%' />
                  <Skeleton variant='text' width='80%' />
                  <Skeleton variant='text' width='70%' />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </AdminGuard>
    );
  }

  // Error State
  if (error) {
    return (
      <AdminGuard>
        <div className='space-y-6'>
          <div className='flex items-center gap-3'>
            <Link
              href='/dashboard/admin/catalogos'
              className='p-2 -ml-2 rounded-lg text-[var(--color-gray-500)] hover:text-[var(--color-gray-700)] hover:bg-[var(--color-gray-100)] transition-colors'
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className='text-2xl font-heading font-bold text-[var(--color-gray-900)]'>
              {t('CatalogDetails')}
            </h1>
          </div>
          <Card className='border-[var(--color-accent-rose)]/20 bg-[var(--color-error-bg)]'>
            <div className='flex items-center gap-3 text-[var(--color-accent-rose)]'>
              <AlertCircle size={24} />
              <div>
                <p className='font-medium'>{t('ErrorLoadingData')}</p>
                <p className='text-sm opacity-80'>{error}</p>
              </div>
            </div>
          </Card>
        </div>
      </AdminGuard>
    );
  }

  // Not Found State
  if (!catalogo) {
    return (
      <AdminGuard>
        <div className='space-y-6'>
          <div className='flex items-center gap-3'>
            <Link
              href='/dashboard/admin/catalogos'
              className='p-2 -ml-2 rounded-lg text-[var(--color-gray-500)] hover:text-[var(--color-gray-700)] hover:bg-[var(--color-gray-100)] transition-colors'
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className='text-2xl font-heading font-bold text-[var(--color-gray-900)]'>
              {t('CatalogDetails')}
            </h1>
          </div>
          <Card>
            <div className='flex flex-col items-center gap-3 py-8 text-center'>
              <div className='w-16 h-16 rounded-full bg-[var(--color-gray-100)] flex items-center justify-center'>
                <FolderOpen
                  size={28}
                  className='text-[var(--color-gray-400)]'
                />
              </div>
              <p className='font-medium text-[var(--color-gray-700)]'>
                {t('CatalogNotFound')}
              </p>
              <Button
                variant='outline'
                onClick={() => router.push('/dashboard/admin/catalogos')}
              >
                Voltar para lista
              </Button>
            </div>
          </Card>
        </div>
      </AdminGuard>
    );
  }

  const cat = catalogo.catalogo;

  return (
    <AdminGuard>
      <div className='space-y-6'>
        {/* Page Header */}
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div>
            <div className='flex items-center gap-3 mb-1'>
              <Link
                href='/dashboard/admin/catalogos'
                className='p-2 -ml-2 rounded-lg text-[var(--color-gray-500)] hover:text-[var(--color-gray-700)] hover:bg-[var(--color-gray-100)] transition-colors'
                aria-label='Voltar'
              >
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className='text-2xl font-heading font-bold text-[var(--color-gray-900)]'>
                  {cat.nome}
                </h1>
                <div className='flex items-center gap-2 mt-1'>
                  <Badge
                    variant={statusConfig[cat.status]?.variant || 'default'}
                    size='sm'
                    dot
                  >
                    {statusConfig[cat.status]?.label || cat.status}
                  </Badge>
                  {cat.rating && (
                    <div className='flex items-center gap-1 text-[var(--color-accent-amber)]'>
                      <Star size={14} className='fill-current' />
                      <span className='text-sm font-medium'>{cat.rating}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <Button icon={Edit} onClick={handleEditarInfo}>
            {t('Edit')}
          </Button>
        </div>

        {/* Main Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Left Column - Main Info */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Basic Info Card */}
            <Card variant='default' padding={false}>
              <div className='p-5 border-b border-[var(--color-gray-100)]'>
                <div className='flex items-center gap-2'>
                  <FolderOpen
                    size={18}
                    className='text-[var(--color-primary-600)]'
                  />
                  <h2 className='font-semibold text-[var(--color-gray-900)]'>
                    {t('BasicInfo')}
                  </h2>
                </div>
              </div>
              <div className='p-5 space-y-4'>
                <div>
                  <p className='text-sm text-[var(--color-gray-500)] mb-1'>
                    {t('Description')}
                  </p>
                  <p className='text-[var(--color-gray-700)]'>
                    {cat.descricao || (
                      <span className='text-[var(--color-gray-400)] italic'>
                        Sem descrição
                      </span>
                    )}
                  </p>
                </div>

                {/* Cover Image */}
                {cat.imagem_url && (
                  <div>
                    <p className='text-sm text-[var(--color-gray-500)] mb-2'>
                      {t('Cover')}
                    </p>
                    <div className='w-full max-w-md h-48 rounded-lg overflow-hidden bg-[var(--color-gray-100)]'>
                      <img
                        src={cat.imagem_url}
                        alt={cat.nome}
                        className='w-full h-full object-cover'
                      />
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Products Card */}
            <Card variant='default' padding={false}>
              <div className='p-5 border-b border-[var(--color-gray-100)]'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Package
                      size={18}
                      className='text-[var(--color-accent-blue)]'
                    />
                    <h2 className='font-semibold text-[var(--color-gray-900)]'>
                      {t('Products')}
                    </h2>
                    {cat.produtos?.length > 0 && (
                      <Badge variant='info' size='sm'>
                        {cat.produtos.length}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className='p-5'>
                {cat.produtos?.length > 0 ? (
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                    {cat.produtos.map((p) => (
                      <div
                        key={p.id}
                        className='flex items-center gap-3 p-3 bg-[var(--color-gray-50)] rounded-lg hover:bg-[var(--color-gray-100)] transition-colors group'
                      >
                        <div className='w-12 h-12 rounded-lg overflow-hidden bg-[var(--color-gray-200)] flex-shrink-0'>
                          {p.imagens?.[0] ? (
                            <img
                              src={p.imagens[0]}
                              alt={p.nome}
                              className='w-full h-full object-cover'
                            />
                          ) : (
                            <div className='w-full h-full flex items-center justify-center text-[var(--color-gray-400)]'>
                              <Package size={20} />
                            </div>
                          )}
                        </div>
                        <div className='flex-1 min-w-0'>
                          <p className='font-medium text-[var(--color-gray-900)] truncate'>
                            {p.nome}
                          </p>
                        </div>
                        <Button
                          size='sm'
                          variant='ghost'
                          icon={Eye}
                          onClick={() => handleVerProduto(p.id)}
                        >
                          {t('View')}
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='text-center py-8'>
                    <div className='w-12 h-12 mx-auto rounded-full bg-[var(--color-gray-100)] flex items-center justify-center mb-3'>
                      <Package
                        size={20}
                        className='text-[var(--color-gray-400)]'
                      />
                    </div>
                    <p className='text-[var(--color-gray-500)]'>
                      {t('NoProducts')}
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Collections Card */}
            <Card variant='default' padding={false}>
              <div className='p-5 border-b border-[var(--color-gray-100)]'>
                <div className='flex items-center gap-2'>
                  <Layers
                    size={18}
                    className='text-[var(--color-accent-emerald)]'
                  />
                  <h2 className='font-semibold text-[var(--color-gray-900)]'>
                    {t('Collections')}
                  </h2>
                  {cat.colecoes?.length > 0 && (
                    <Badge variant='success' size='sm'>
                      {cat.colecoes.length}
                    </Badge>
                  )}
                </div>
              </div>
              <div className='p-5'>
                {cat.colecoes?.length > 0 ? (
                  <div className='flex flex-wrap gap-2'>
                    {cat.colecoes.map((c) => (
                      <div
                        key={c.id}
                        className='px-3 py-2 bg-[var(--color-gray-50)] rounded-lg border border-[var(--color-gray-200)] hover:border-[var(--color-primary-300)] transition-colors'
                      >
                        <span className='text-sm font-medium text-[var(--color-gray-700)]'>
                          {c.nome}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='text-center py-6'>
                    <p className='text-[var(--color-gray-500)]'>
                      {t('NoCollections')}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column - Metadata */}
          <div className='space-y-6'>
            {/* Metadata Card */}
            <Card variant='default' padding={false}>
              <div className='p-5 border-b border-[var(--color-gray-100)]'>
                <div className='flex items-center gap-2'>
                  <Tag size={18} className='text-[var(--color-primary-600)]' />
                  <h2 className='font-semibold text-[var(--color-gray-900)]'>
                    {t('Metadata')}
                  </h2>
                </div>
              </div>
              <div className='p-5 space-y-4'>
                {/* Continent */}
                <div className='flex items-start gap-3'>
                  <div className='w-8 h-8 rounded-lg bg-[var(--color-primary-50)] flex items-center justify-center flex-shrink-0'>
                    <Globe
                      size={16}
                      className='text-[var(--color-primary-600)]'
                    />
                  </div>
                  <div>
                    <p className='text-xs text-[var(--color-gray-500)] uppercase tracking-wide'>
                      {t('Continent')}
                    </p>
                    <p className='font-medium text-[var(--color-gray-800)]'>
                      {cat.metadados?.continente || '—'}
                    </p>
                  </div>
                </div>

                {/* Country */}
                <div className='flex items-start gap-3'>
                  <div className='w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0'>
                    <MapPin size={16} className='text-blue-600' />
                  </div>
                  <div>
                    <p className='text-xs text-[var(--color-gray-500)] uppercase tracking-wide'>
                      {t('Country')}
                    </p>
                    <p className='font-medium text-[var(--color-gray-800)]'>
                      {cat.metadados?.pais || '—'}
                    </p>
                  </div>
                </div>

                {/* Category */}
                <div className='flex items-start gap-3'>
                  <div className='w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0'>
                    <Tag size={16} className='text-emerald-600' />
                  </div>
                  <div>
                    <p className='text-xs text-[var(--color-gray-500)] uppercase tracking-wide'>
                      {t('Category')}
                    </p>
                    <p className='font-medium text-[var(--color-gray-800)]'>
                      {cat.metadados?.categoria || '—'}
                    </p>
                  </div>
                </div>

                {/* Subcategory */}
                <div className='flex items-start gap-3'>
                  <div className='w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0'>
                    <Tag size={16} className='text-amber-600' />
                  </div>
                  <div>
                    <p className='text-xs text-[var(--color-gray-500)] uppercase tracking-wide'>
                      {t('Subcategory')}
                    </p>
                    <p className='font-medium text-[var(--color-gray-800)]'>
                      {cat.metadados?.sub_categoria || '—'}
                    </p>
                  </div>
                </div>

                {/* Specifications */}
                {Array.isArray(cat.metadados?.especificacao) &&
                  cat.metadados.especificacao.length > 0 && (
                    <div className='pt-3 border-t border-[var(--color-gray-100)]'>
                      <div className='flex items-center gap-2 mb-3'>
                        <List
                          size={16}
                          className='text-[var(--color-gray-500)]'
                        />
                        <p className='text-xs text-[var(--color-gray-500)] uppercase tracking-wide'>
                          {t('Specifications')}
                        </p>
                      </div>
                      <div className='flex flex-wrap gap-2'>
                        {cat.metadados.especificacao.map((esp, idx) => (
                          <span
                            key={idx}
                            className='px-2 py-1 text-xs bg-[var(--color-gray-100)] text-[var(--color-gray-700)] rounded-full'
                          >
                            {esp}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </Card>

            {/* Quick Actions Card */}
            <Card className='bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-700)] text-white border-0'>
              <div className='flex items-center gap-3 mb-3'>
                <div className='w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center'>
                  <FolderOpen size={20} />
                </div>
                <div>
                  <p className='text-white/80 text-sm'>Catálogo</p>
                  <p className='font-bold'>#{id.slice(0, 8)}</p>
                </div>
              </div>
              <p className='text-white/90 text-sm'>
                {cat.produtos?.length || 0} produtos •{' '}
                {cat.colecoes?.length || 0} coleções
              </p>
            </Card>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
