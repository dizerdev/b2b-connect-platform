'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import AdminGuard from 'components/AdminGuard';
import {
  ArrowLeft,
  Package,
  Info,
  Grid3X3,
  Image as ImageIcon,
  FolderOpen,
  Calendar,
  DollarSign,
  Tag,
  CheckCircle,
  XCircle,
  Palette,
  Ruler,
  Box,
  Truck,
  Archive,
  Edit,
  Star,
  AlertCircle,
} from 'lucide-react';
import { Card, Badge, Button, Skeleton } from 'components/ui';

export default function DetalhesProdutoPage() {
  const t = useTranslations('DashboardAdmin');
  const { pid } = useParams();

  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProduto = async () => {
    try {
      const res = await fetch(`/api/v1/produtos/${pid}`);
      if (!res.ok) throw new Error(t('ErrorLoadingData'));
      const data = await res.json();
      setProduto(data);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduto();
  }, [pid]);

  // Skeleton Loading State
  if (loading) {
    return (
      <AdminGuard>
        <div className='space-y-6'>
          {/* Header Skeleton */}
          <div className='flex items-center gap-3'>
            <Skeleton variant='circular' width='40px' height='40px' />
            <div className='space-y-2 flex-1'>
              <Skeleton variant='text' width='250px' height='28px' />
              <Skeleton variant='text' width='150px' />
            </div>
            <Skeleton
              variant='rectangular'
              width='80px'
              height='28px'
              className='rounded-full'
            />
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {/* Main Content Skeleton */}
            <div className='lg:col-span-2 space-y-6'>
              <Card padding={false}>
                <div className='p-5 space-y-4'>
                  <Skeleton variant='text' width='150px' height='24px' />
                  <Skeleton variant='text' width='100%' />
                  <Skeleton variant='text' width='80%' />
                </div>
              </Card>
              <Card padding={false}>
                <div className='p-5'>
                  <Skeleton
                    variant='text'
                    width='100px'
                    height='24px'
                    className='mb-4'
                  />
                  <Skeleton
                    variant='rectangular'
                    width='100%'
                    height='200px'
                    className='rounded-lg'
                  />
                </div>
              </Card>
            </div>
            {/* Sidebar Skeleton */}
            <div className='space-y-6'>
              <Card>
                <div className='space-y-4'>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className='flex items-center gap-3'>
                      <Skeleton variant='circular' width='32px' height='32px' />
                      <div className='flex-1'>
                        <Skeleton variant='text' width='60px' />
                        <Skeleton variant='text' width='100px' />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </AdminGuard>
    );
  }

  // Error State
  if (error || !produto) {
    return (
      <AdminGuard>
        <div className='flex flex-col items-center justify-center py-16'>
          <Card className='max-w-md w-full text-center'>
            <AlertCircle
              size={48}
              className='mx-auto text-[var(--color-accent-rose)] mb-4'
            />
            <h2 className='text-lg font-semibold text-[var(--color-gray-900)] mb-2'>
              {t('ProductNotFound')}
            </h2>
            <p className='text-[var(--color-gray-500)] mb-4'>
              {error ||
                'O produto não foi encontrado ou você não tem permissão para acessá-lo.'}
            </p>
            <Link href='/dashboard/admin'>
              <Button variant='outline' icon={ArrowLeft}>
                {t('Back')}
              </Button>
            </Link>
          </Card>
        </div>
      </AdminGuard>
    );
  }

  const { produto: produtoData, catalogos, grades } = produto;
  const catalogoPrincipal = catalogos?.[0];

  return (
    <AdminGuard>
      <div className='space-y-6'>
        {/* Page Header */}
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div className='flex items-center gap-3'>
            <Link
              href={
                catalogoPrincipal
                  ? `/dashboard/admin/catalogos/${catalogoPrincipal.catalogo_id}`
                  : '/dashboard/admin'
              }
              className='p-2 -ml-2 rounded-lg text-[var(--color-gray-500)] hover:text-[var(--color-gray-700)] hover:bg-[var(--color-gray-100)] transition-colors'
              aria-label='Voltar'
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <div className='flex items-center gap-3'>
                <h1 className='text-2xl font-heading font-bold text-[var(--color-gray-900)]'>
                  {produtoData?.nome || t('ProductDetails')}
                </h1>
                <Badge
                  variant={produtoData?.ativo ? 'success' : 'error'}
                  size='sm'
                  dot
                >
                  {produtoData?.ativo ? t('Active') : t('Inactive')}
                </Badge>
              </div>
              <p className='text-[var(--color-gray-500)]'>
                Detalhes e informações do produto
              </p>
            </div>
          </div>
          <Link href={`/dashboard/admin/produtos/${pid}/editar`}>
            <Button icon={Edit}>{t('EditProduct')}</Button>
          </Link>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Main Content */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Basic Information */}
            <Card variant='default' padding={false}>
              <div className='p-5 border-b border-[var(--color-gray-100)]'>
                <div className='flex items-center gap-2'>
                  <Info size={18} className='text-[var(--color-primary-600)]' />
                  <h2 className='font-semibold text-[var(--color-gray-900)]'>
                    {t('BasicInformation')}
                  </h2>
                </div>
              </div>
              <div className='p-5 space-y-4'>
                <div>
                  <p className='text-sm text-[var(--color-gray-500)] mb-1'>
                    {t('Name')}
                  </p>
                  <p className='font-medium text-[var(--color-gray-900)]'>
                    {produtoData?.nome}
                  </p>
                </div>
                {produtoData?.descricao && (
                  <div>
                    <p className='text-sm text-[var(--color-gray-500)] mb-1'>
                      {t('Description')}
                    </p>
                    <p className='text-[var(--color-gray-700)]'>
                      {produtoData.descricao}
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Product Images */}
            {produtoData?.imagens && produtoData.imagens.length > 0 && (
              <Card variant='default' padding={false}>
                <div className='p-5 border-b border-[var(--color-gray-100)]'>
                  <div className='flex items-center gap-2'>
                    <ImageIcon
                      size={18}
                      className='text-[var(--color-accent-violet)]'
                    />
                    <h2 className='font-semibold text-[var(--color-gray-900)]'>
                      {t('Photos')}
                    </h2>
                    <Badge variant='default' size='sm'>
                      {produtoData.imagens.length}
                    </Badge>
                  </div>
                </div>
                <div className='p-5'>
                  <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                    {produtoData.imagens.map((url, idx) => (
                      <div
                        key={idx}
                        className='relative aspect-square rounded-lg overflow-hidden bg-[var(--color-gray-100)] group'
                      >
                        <img
                          src={url}
                          alt={`Foto ${idx + 1}`}
                          className='w-full h-full object-cover transition-transform group-hover:scale-105'
                        />
                        {idx === 0 && (
                          <div className='absolute top-2 left-2'>
                            <Badge variant='warning' size='sm'>
                              <Star size={10} className='mr-1' />
                              Principal
                            </Badge>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Grades Table */}
            {grades && grades.length > 0 && (
              <Card variant='default' padding={false}>
                <div className='p-5 border-b border-[var(--color-gray-100)]'>
                  <div className='flex items-center gap-2'>
                    <Grid3X3
                      size={18}
                      className='text-[var(--color-accent-blue)]'
                    />
                    <h2 className='font-semibold text-[var(--color-gray-900)]'>
                      {t('Grades')}
                    </h2>
                    <Badge variant='primary' size='sm'>
                      {grades.length}
                    </Badge>
                  </div>
                </div>
                <div className='overflow-x-auto'>
                  <table className='w-full'>
                    <thead>
                      <tr className='bg-[var(--color-gray-50)] border-b border-[var(--color-gray-100)]'>
                        <th className='px-5 py-3 text-left text-xs font-medium text-[var(--color-gray-500)] uppercase tracking-wider'>
                          <div className='flex items-center gap-2'>
                            <Palette size={14} />
                            {t('Color')}
                          </div>
                        </th>
                        <th className='px-5 py-3 text-left text-xs font-medium text-[var(--color-gray-500)] uppercase tracking-wider'>
                          <div className='flex items-center gap-2'>
                            <Ruler size={14} />
                            {t('Size')}
                          </div>
                        </th>
                        <th className='px-5 py-3 text-left text-xs font-medium text-[var(--color-gray-500)] uppercase tracking-wider'>
                          <div className='flex items-center gap-2'>
                            <Box size={14} />
                            {t('Type')}
                          </div>
                        </th>
                        <th className='px-5 py-3 text-left text-xs font-medium text-[var(--color-gray-500)] uppercase tracking-wider'>
                          <div className='flex items-center gap-2'>
                            <Truck size={14} />
                            {t('ReadyDelivery')}
                          </div>
                        </th>
                        <th className='px-5 py-3 text-left text-xs font-medium text-[var(--color-gray-500)] uppercase tracking-wider'>
                          <div className='flex items-center gap-2'>
                            <Archive size={14} />
                            {t('Stock')}
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-[var(--color-gray-100)]'>
                      {grades.map((grade, idx) => (
                        <tr
                          key={idx}
                          className='hover:bg-[var(--color-gray-50)] transition-colors'
                        >
                          <td className='px-5 py-4'>
                            <div className='flex items-center gap-2'>
                              <div
                                className='w-4 h-4 rounded-full border border-[var(--color-gray-200)]'
                                style={{
                                  backgroundColor:
                                    grade.cor?.toLowerCase() || '#ccc',
                                }}
                              />
                              <span className='text-[var(--color-gray-900)]'>
                                {grade.cor}
                              </span>
                            </div>
                          </td>
                          <td className='px-5 py-4'>
                            <Badge variant='default' size='sm'>
                              {grade.tamanho}
                            </Badge>
                          </td>
                          <td className='px-5 py-4 text-[var(--color-gray-700)]'>
                            {grade.tipo || '-'}
                          </td>
                          <td className='px-5 py-4'>
                            {grade.pronta_entrega ? (
                              <Badge variant='success' size='sm'>
                                <CheckCircle size={12} className='mr-1' />
                                {t('Yes')}
                              </Badge>
                            ) : (
                              <Badge variant='error' size='sm'>
                                <XCircle size={12} className='mr-1' />
                                {t('No')}
                              </Badge>
                            )}
                          </td>
                          <td className='px-5 py-4'>
                            <span
                              className={`font-medium ${
                                grade.estoque > 0
                                  ? 'text-[var(--color-accent-emerald)]'
                                  : 'text-[var(--color-gray-400)]'
                              }`}
                            >
                              {grade.estoque > 0 ? grade.estoque : '-'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            {/* Catalog Info */}
            {catalogoPrincipal && (
              <Card variant='default'>
                <div className='space-y-4'>
                  <div className='flex items-center gap-3 pb-4 border-b border-[var(--color-gray-100)]'>
                    <div className='w-10 h-10 rounded-lg bg-[var(--color-primary-100)] flex items-center justify-center'>
                      <FolderOpen
                        size={20}
                        className='text-[var(--color-primary-600)]'
                      />
                    </div>
                    <div>
                      <p className='text-xs text-[var(--color-gray-500)]'>
                        Catálogo
                      </p>
                      <p className='font-medium text-[var(--color-gray-900)]'>
                        {catalogoPrincipal.catalogo_nome}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-lg bg-[var(--color-accent-emerald)]/10 flex items-center justify-center'>
                      <DollarSign
                        size={20}
                        className='text-[var(--color-accent-emerald)]'
                      />
                    </div>
                    <div>
                      <p className='text-xs text-[var(--color-gray-500)]'>
                        {t('Price')}
                      </p>
                      <p className='font-semibold text-[var(--color-gray-900)]'>
                        R$ {catalogoPrincipal.preco?.toFixed(2) || '-'}
                      </p>
                    </div>
                  </div>

                  {catalogoPrincipal.destaque && (
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 rounded-lg bg-[var(--color-accent-amber)]/10 flex items-center justify-center'>
                        <Star
                          size={20}
                          className='text-[var(--color-accent-amber)]'
                        />
                      </div>
                      <div>
                        <p className='text-xs text-[var(--color-gray-500)]'>
                          Destaque
                        </p>
                        <Badge variant='warning' size='sm'>
                          Em destaque
                        </Badge>
                      </div>
                    </div>
                  )}

                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-lg bg-[var(--color-gray-100)] flex items-center justify-center'>
                      <Calendar
                        size={20}
                        className='text-[var(--color-gray-500)]'
                      />
                    </div>
                    <div>
                      <p className='text-xs text-[var(--color-gray-500)]'>
                        {t('CreatedAt')}
                      </p>
                      <p className='text-[var(--color-gray-700)]'>
                        {new Date(produtoData?.created_at).toLocaleDateString(
                          'pt-BR',
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Other Catalogs */}
            {catalogos && catalogos.length > 1 && (
              <Card variant='default' padding={false}>
                <div className='p-4 border-b border-[var(--color-gray-100)]'>
                  <div className='flex items-center gap-2'>
                    <Tag size={16} className='text-[var(--color-gray-500)]' />
                    <h3 className='text-sm font-medium text-[var(--color-gray-700)]'>
                      Outros Catálogos
                    </h3>
                    <Badge variant='default' size='sm'>
                      {catalogos.length - 1}
                    </Badge>
                  </div>
                </div>
                <div className='p-2'>
                  {catalogos.slice(1).map((cat, idx) => (
                    <Link
                      key={idx}
                      href={`/dashboard/admin/catalogos/${cat.catalogo_id}`}
                      className='flex items-center justify-between p-3 rounded-lg hover:bg-[var(--color-gray-50)] transition-colors'
                    >
                      <span className='text-sm text-[var(--color-gray-700)]'>
                        {cat.catalogo_nome}
                      </span>
                      <span className='text-sm font-medium text-[var(--color-accent-emerald)]'>
                        R$ {cat.preco?.toFixed(2) || '-'}
                      </span>
                    </Link>
                  ))}
                </div>
              </Card>
            )}

            {/* Quick Stats */}
            <Card className='bg-gradient-to-br from-[var(--color-primary-600)] to-[var(--color-primary-800)] text-white'>
              <div className='flex items-center gap-3'>
                <div className='w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center'>
                  <Package size={24} />
                </div>
                <div>
                  <p className='text-white/70 text-sm'>Total de Grades</p>
                  <p className='text-2xl font-bold'>{grades?.length || 0}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
