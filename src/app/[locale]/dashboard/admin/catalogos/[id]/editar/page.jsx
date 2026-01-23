'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';
import AdminGuard from 'components/AdminGuard';
import { extractFileKey } from 'lib/utils';
import {
  ArrowLeft,
  FolderOpen,
  FileText,
  Image as ImageIcon,
  Upload,
  X,
  Save,
  Loader2,
} from 'lucide-react';
import { Card, Badge, Button, Skeleton } from 'components/ui';

export default function EdicaoCatalogoPage() {
  const t = useTranslations('DashboardAdmin');
  const router = useRouter();
  const params = useParams();
  const catalogoId = params?.id;

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function fetchCatalogo() {
      try {
        const res = await fetch(`/api/v1/catalogos/${catalogoId}`);
        if (!res.ok) {
          throw new Error(t('ErrorLoadingData'));
        }
        const data = await res.json();
        setNome(data.catalogo.nome || '');
        setDescricao(data.catalogo.descricao || '');
        setImagemUrl(data.catalogo.imagem_url || '');
      } catch (err) {
        toast.error(err.message);
        router.push('/dashboard/admin/catalogos');
      } finally {
        setFetching(false);
      }
    }
    if (catalogoId) {
      fetchCatalogo();
    }
  }, [catalogoId, router, t]);

  const handleFileChange = async (file) => {
    try {
      setUploading(true);

      const prepareRes = await fetch('/api/v1/uploadthing/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          files: [
            {
              name: file.name,
              size: file.size,
              type: file.type,
              customId: null,
            },
          ],
          callbackUrl: 'https://meusite.com/api/upload/callback',
          callbackSlug: 'imageUploader',
        }),
      });

      if (!prepareRes.ok) throw new Error(t('UploadError'));
      const { uploadUrls } = await prepareRes.json();
      const uploadData = uploadUrls[0];

      const formData = new FormData();
      for (const [key, value] of Object.entries(uploadData.fields)) {
        formData.append(key, value);
      }
      formData.append('file', file);

      const uploadRes = await fetch(uploadData.url, {
        method: 'POST',
        body: formData,
      });
      if (!uploadRes.ok) throw new Error(t('UploadError'));

      let status = 'still working';
      while (status === 'still working') {
        const pollRes = await fetch(
          `/api/v1/uploadthing/pollUpload?fileKey=${uploadData.key}`,
        );
        const pollData = await pollRes.json();
        status = pollData.status;
        if (status === 'still working')
          await new Promise((r) => setTimeout(r, 1000));
      }

      setImagemUrl(uploadData.ufsUrl);
      toast.success(t('UploadComplete'));
    } catch (err) {
      toast.error(err.message || t('UploadError'));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileUrl) => {
    try {
      const fileKey = extractFileKey(fileUrl);
      if (!fileKey) throw new Error(t('UploadError'));

      const res = await fetch('/api/v1/uploadthing/deleteFile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileKey }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t('UploadError'));

      setImagemUrl('');
      toast.success(t('ImageRemoved'));
    } catch (err) {
      toast.error(err.message || t('UploadError'));
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!nome.trim()) {
      toast.error(t('NameIsRequired'));
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`/api/v1/catalogos/${catalogoId}/editar`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, descricao, imagem_url: imagemUrl }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || t('ErrorUpdating'));
      }

      toast.success(t('CatalogUpdated'));
      setTimeout(() => {
        router.push(`/dashboard/admin/catalogos/${catalogoId}`);
      }, 1000);
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  }

  const inputClasses = `
    w-full px-4 py-2.5 rounded-lg text-sm
    border border-[var(--color-gray-200)]
    bg-white text-[var(--color-gray-700)]
    placeholder:text-[var(--color-gray-400)]
    focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/20
    focus:border-[var(--color-primary-500)]
    transition-all
  `;

  // Skeleton Loading State
  if (fetching) {
    return (
      <AdminGuard>
        <div className='max-w-2xl mx-auto space-y-6'>
          <div className='flex items-center gap-3'>
            <Skeleton variant='circular' width='40px' height='40px' />
            <div className='space-y-2'>
              <Skeleton variant='text' width='200px' height='28px' />
              <Skeleton variant='text' width='150px' />
            </div>
          </div>
          <Card padding={false}>
            <div className='p-5 space-y-5'>
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i}>
                  <Skeleton variant='text' width='100px' className='mb-2' />
                  <Skeleton
                    variant='rectangular'
                    width='100%'
                    height='40px'
                    className='rounded-lg'
                  />
                </div>
              ))}
            </div>
          </Card>
          <Card padding={false}>
            <div className='p-5'>
              <Skeleton variant='text' width='120px' className='mb-4' />
              <Skeleton
                variant='rectangular'
                width='200px'
                height='200px'
                className='rounded-xl'
              />
            </div>
          </Card>
        </div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div className='max-w-2xl mx-auto space-y-6'>
        {/* Page Header */}
        <div className='flex items-center gap-3'>
          <Link
            href={`/dashboard/admin/catalogos/${catalogoId}`}
            className='p-2 -ml-2 rounded-lg text-[var(--color-gray-500)] hover:text-[var(--color-gray-700)] hover:bg-[var(--color-gray-100)] transition-colors'
            aria-label='Voltar'
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className='text-2xl font-heading font-bold text-[var(--color-gray-900)]'>
              {t('EditCatalog')}
            </h1>
            <p className='text-[var(--color-gray-500)]'>
              Atualize as informações do catálogo
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Basic Information Card */}
          <Card variant='default' padding={false}>
            <div className='p-5 border-b border-[var(--color-gray-100)]'>
              <div className='flex items-center gap-2'>
                <FolderOpen
                  size={18}
                  className='text-[var(--color-primary-600)]'
                />
                <h2 className='font-semibold text-[var(--color-gray-900)]'>
                  Informações do Catálogo
                </h2>
              </div>
            </div>
            <div className='p-5 space-y-5'>
              {/* Nome */}
              <div>
                <label
                  htmlFor='nome'
                  className='flex items-center gap-2 text-sm font-medium text-[var(--color-gray-700)] mb-2'
                >
                  <FileText
                    size={14}
                    className='text-[var(--color-gray-400)]'
                  />
                  {t('NameRequired')}
                </label>
                <input
                  id='nome'
                  type='text'
                  className={inputClasses}
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder='Nome do catálogo'
                  required
                />
              </div>

              {/* Descrição */}
              <div>
                <label
                  htmlFor='descricao'
                  className='flex items-center gap-2 text-sm font-medium text-[var(--color-gray-700)] mb-2'
                >
                  <FileText
                    size={14}
                    className='text-[var(--color-gray-400)]'
                  />
                  {t('Description')}
                </label>
                <textarea
                  id='descricao'
                  className={`${inputClasses} resize-none`}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  rows={4}
                  placeholder='Descrição do catálogo...'
                />
              </div>
            </div>
          </Card>

          {/* Cover Image Card */}
          <Card variant='default' padding={false}>
            <div className='p-5 border-b border-[var(--color-gray-100)]'>
              <div className='flex items-center gap-2'>
                <ImageIcon
                  size={18}
                  className='text-[var(--color-accent-violet)]'
                />
                <h2 className='font-semibold text-[var(--color-gray-900)]'>
                  {t('CoverImage')}
                </h2>
              </div>
            </div>
            <div className='p-5'>
              {imagemUrl ? (
                <div className='relative inline-block group'>
                  <div className='relative w-48 h-48 rounded-xl overflow-hidden bg-[var(--color-gray-100)]'>
                    <img
                      src={imagemUrl}
                      alt='Capa do catálogo'
                      className='w-full h-full object-cover'
                    />
                    <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                      <button
                        type='button'
                        onClick={() => handleDelete(imagemUrl)}
                        disabled={loading}
                        className='p-2 bg-white rounded-full text-[var(--color-accent-rose)] hover:bg-[var(--color-accent-rose)] hover:text-white transition-colors'
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                  <Badge
                    variant='success'
                    size='sm'
                    className='absolute -top-2 -right-2'
                  >
                    Imagem atual
                  </Badge>
                </div>
              ) : (
                <label
                  htmlFor='cover-image'
                  className={`
                    relative w-48 h-48 rounded-xl border-2 border-dashed 
                    ${
                      uploading
                        ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-50)]'
                        : 'border-[var(--color-gray-300)] hover:border-[var(--color-primary-500)]'
                    }
                    flex flex-col items-center justify-center gap-2 cursor-pointer transition-all
                    hover:bg-[var(--color-gray-50)]
                  `}
                >
                  {uploading ? (
                    <>
                      <Loader2
                        size={32}
                        className='text-[var(--color-primary-600)] animate-spin'
                      />
                      <span className='text-sm text-[var(--color-primary-600)]'>
                        Enviando...
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload
                        size={32}
                        className='text-[var(--color-gray-400)]'
                      />
                      <span className='text-sm text-[var(--color-gray-500)]'>
                        Selecionar imagem
                      </span>
                      <span className='text-xs text-[var(--color-gray-400)]'>
                        PNG, JPG até 4MB
                      </span>
                    </>
                  )}
                  <input
                    id='cover-image'
                    type='file'
                    accept='image/*'
                    className='hidden'
                    onChange={(e) =>
                      e.target.files?.[0] && handleFileChange(e.target.files[0])
                    }
                    disabled={uploading}
                  />
                </label>
              )}
            </div>
          </Card>

          {/* Form Actions */}
          <div className='flex gap-3 justify-end'>
            <Button
              type='button'
              variant='outline'
              onClick={() =>
                router.push(`/dashboard/admin/catalogos/${catalogoId}`)
              }
            >
              {t('Cancel')}
            </Button>
            <Button type='submit' loading={loading} icon={Save}>
              {loading ? t('Saving') : t('SaveChanges')}
            </Button>
          </div>
        </form>
        <Toaster />
      </div>
    </AdminGuard>
  );
}
