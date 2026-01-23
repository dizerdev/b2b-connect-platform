// app/admin/produtos/[pid]/editar/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';
import { extractFileKey } from 'lib/utils';
import AdminGuard from 'components/AdminGuard';
import {
  ArrowLeft,
  Package,
  FileText,
  DollarSign,
  Image as ImageIcon,
  Plus,
  X,
  Upload,
  Star,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Card, Badge, Button, Skeleton } from 'components/ui';

export default function EdicaoProdutoPage() {
  const t = useTranslations('DashboardAdmin');
  const router = useRouter();
  const params = useParams();
  const { pid } = params;

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [catalogoId, setCatalogoId] = useState('');
  const [imagens, setImagens] = useState(['']);
  const [destaque, setDestaque] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [uploadingIndex, setUploadingIndex] = useState(null);

  useEffect(() => {
    carregarProduto();
  }, []);

  async function carregarProduto() {
    try {
      const res = await fetch(`/api/v1/produtos/${pid}`);
      if (!res.ok) throw new Error(t('ErrorLoadingData'));
      const data = await res.json();
      setNome(data.produto.nome || '');
      setDescricao(data.produto.descricao || '');
      setPreco(data.catalogos[0].preco || '');
      setImagens(
        data.produto.imagens && data.produto.imagens.length > 0
          ? data.produto.imagens
          : [''],
      );
      setCatalogoId(data.catalogos[0].catalogo_id);
      setDestaque(data.catalogos[0].destaque);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingData(false);
    }
  }

  const handleFileChange = async (file, index) => {
    try {
      setUploadingIndex(index);

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
        if (status === 'still working') {
          await new Promise((r) => setTimeout(r, 1000));
        }
      }

      setImagens((prev) => {
        const newImgs = [...prev];
        newImgs[index] = uploadData.ufsUrl;
        return newImgs;
      });

      toast.success(t('UploadComplete'));
    } catch (err) {
      console.error(err);
      toast.error(err.message || t('UploadError'));
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleDelete = async (fileKey) => {
    try {
      const res = await fetch('/api/v1/uploadthing/deleteFile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileKey }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t('UploadError'));

      toast.success(t('ImageRemoved'));
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const adicionarImagem = () => setImagens([...imagens, '']);
  const removerImagem = (index) =>
    setImagens(imagens.filter((_, i) => i !== index));

  async function handleSubmit(e) {
    e.preventDefault();

    if (!nome.trim()) {
      toast.error(t('NameIsRequired'));
      return;
    }
    if (!preco || isNaN(preco)) {
      toast.error(t('InvalidPrice'));
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `/api/v1/catalogos/${catalogoId}/produtos/${pid}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nome,
            descricao,
            imagens: imagens.filter((i) => i.trim() !== ''),
            preco: parseFloat(preco),
            destaque,
          }),
        },
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || t('ErrorUpdatingProduct'));
      }

      toast.success(t('ProductUpdated'));
      setTimeout(() => {
        router.push(`/dashboard/admin/produtos/${pid}`);
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
  if (loadingData) {
    return (
      <AdminGuard>
        <div className='max-w-3xl mx-auto space-y-6'>
          <div className='flex items-center gap-3'>
            <Skeleton variant='circular' width='40px' height='40px' />
            <div className='space-y-2'>
              <Skeleton variant='text' width='200px' height='28px' />
              <Skeleton variant='text' width='150px' />
            </div>
          </div>
          <Card padding={false}>
            <div className='p-5 space-y-5'>
              {Array.from({ length: 4 }).map((_, i) => (
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
              <Skeleton variant='text' width='100px' className='mb-4' />
              <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    variant='rectangular'
                    width='100%'
                    height='100px'
                    className='rounded-lg'
                  />
                ))}
              </div>
            </div>
          </Card>
        </div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div className='max-w-3xl mx-auto space-y-6'>
        {/* Page Header */}
        <div className='flex items-center gap-3'>
          <Link
            href={`/dashboard/admin/produtos/${pid}`}
            className='p-2 -ml-2 rounded-lg text-[var(--color-gray-500)] hover:text-[var(--color-gray-700)] hover:bg-[var(--color-gray-100)] transition-colors'
            aria-label='Voltar'
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className='text-2xl font-heading font-bold text-[var(--color-gray-900)]'>
              {t('EditProduct')}
            </h1>
            <p className='text-[var(--color-gray-500)]'>
              Atualize as informações do produto
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Basic Information Card */}
          <Card variant='default' padding={false}>
            <div className='p-5 border-b border-[var(--color-gray-100)]'>
              <div className='flex items-center gap-2'>
                <Package
                  size={18}
                  className='text-[var(--color-primary-600)]'
                />
                <h2 className='font-semibold text-[var(--color-gray-900)]'>
                  Informações do Produto
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
                  placeholder='Nome do produto'
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
                  placeholder='Descrição detalhada do produto...'
                />
              </div>

              {/* Preço */}
              <div>
                <label
                  htmlFor='preco'
                  className='flex items-center gap-2 text-sm font-medium text-[var(--color-gray-700)] mb-2'
                >
                  <DollarSign
                    size={14}
                    className='text-[var(--color-gray-400)]'
                  />
                  {t('PriceRequired')}
                </label>
                <div className='relative'>
                  <span className='absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-gray-500)]'>
                    R$
                  </span>
                  <input
                    id='preco'
                    type='number'
                    step='0.01'
                    className={`${inputClasses} pl-12`}
                    value={preco}
                    onChange={(e) => setPreco(e.target.value)}
                    placeholder='0,00'
                    required
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Images Card */}
          <Card variant='default' padding={false}>
            <div className='p-5 border-b border-[var(--color-gray-100)]'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <ImageIcon
                    size={18}
                    className='text-[var(--color-accent-violet)]'
                  />
                  <h2 className='font-semibold text-[var(--color-gray-900)]'>
                    {t('Images')}
                  </h2>
                  <Badge variant='default' size='sm'>
                    {imagens.filter((i) => i).length}
                  </Badge>
                </div>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  icon={Plus}
                  onClick={adicionarImagem}
                >
                  {t('AddImage')}
                </Button>
              </div>
            </div>
            <div className='p-5'>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                {imagens.map((img, idx) => {
                  const key = extractFileKey(img);
                  const isUploading = uploadingIndex === idx;

                  return (
                    <div key={idx} className='relative'>
                      {img ? (
                        <div className='relative aspect-square rounded-xl overflow-hidden bg-[var(--color-gray-100)] group'>
                          <img
                            src={img}
                            alt={`Imagem ${idx + 1}`}
                            className='w-full h-full object-cover'
                          />
                          {idx === 0 && (
                            <div className='absolute top-2 left-2'>
                              <Badge variant='warning' size='sm'>
                                <Star size={10} className='mr-1' />
                                Principal
                              </Badge>
                            </div>
                          )}
                          <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                            <button
                              type='button'
                              onClick={() => {
                                handleDelete(key);
                                removerImagem(idx);
                              }}
                              className='p-2 bg-white rounded-full text-[var(--color-accent-rose)] hover:bg-[var(--color-accent-rose)] hover:text-white transition-colors'
                            >
                              <X size={18} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label
                          htmlFor={`file-input-${idx}`}
                          className={`
                            relative aspect-square rounded-xl border-2 border-dashed 
                            ${
                              isUploading
                                ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-50)]'
                                : 'border-[var(--color-gray-300)] hover:border-[var(--color-primary-500)]'
                            }
                            flex flex-col items-center justify-center gap-2 cursor-pointer transition-all
                            hover:bg-[var(--color-gray-50)]
                          `}
                        >
                          {isUploading ? (
                            <>
                              <Loader2
                                size={24}
                                className='text-[var(--color-primary-600)] animate-spin'
                              />
                              <span className='text-xs text-[var(--color-primary-600)]'>
                                Enviando...
                              </span>
                            </>
                          ) : (
                            <>
                              <Upload
                                size={24}
                                className='text-[var(--color-gray-400)]'
                              />
                              <span className='text-xs text-[var(--color-gray-500)]'>
                                {t('SelectFile')}
                              </span>
                            </>
                          )}
                          <input
                            id={`file-input-${idx}`}
                            type='file'
                            accept='image/*'
                            className='hidden'
                            onChange={(e) => {
                              if (e.target.files[0])
                                handleFileChange(e.target.files[0], idx);
                            }}
                            disabled={isUploading}
                          />
                          {imagens.length > 1 && (
                            <button
                              type='button'
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                removerImagem(idx);
                              }}
                              className='absolute top-2 right-2 p-1 bg-white rounded-full shadow text-[var(--color-gray-500)] hover:text-[var(--color-accent-rose)] transition-colors'
                            >
                              <X size={14} />
                            </button>
                          )}
                        </label>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Highlight Card */}
          <Card variant='default' padding={false}>
            <div className='p-5'>
              <button
                type='button'
                onClick={() => setDestaque(!destaque)}
                className={`
                  w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all
                  ${
                    destaque
                      ? 'border-[var(--color-accent-amber)] bg-[var(--color-accent-amber)]/5'
                      : 'border-[var(--color-gray-200)] hover:border-[var(--color-gray-300)]'
                  }
                `}
              >
                <div
                  className={`
                  w-12 h-12 rounded-lg flex items-center justify-center
                  ${
                    destaque
                      ? 'bg-[var(--color-accent-amber)]/20'
                      : 'bg-[var(--color-gray-100)]'
                  }
                `}
                >
                  <Star
                    size={24}
                    className={
                      destaque
                        ? 'text-[var(--color-accent-amber)]'
                        : 'text-[var(--color-gray-400)]'
                    }
                    fill={destaque ? 'currentColor' : 'none'}
                  />
                </div>
                <div className='text-left flex-1'>
                  <p
                    className={`font-medium ${destaque ? 'text-[var(--color-gray-900)]' : 'text-[var(--color-gray-700)]'}`}
                  >
                    {t('Highlight')}
                  </p>
                  <p className='text-sm text-[var(--color-gray-500)]'>
                    Produtos em destaque aparecem na vitrine principal
                  </p>
                </div>
                <div
                  className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center
                  ${
                    destaque
                      ? 'border-[var(--color-accent-amber)] bg-[var(--color-accent-amber)]'
                      : 'border-[var(--color-gray-300)]'
                  }
                `}
                >
                  {destaque && <CheckCircle size={14} className='text-white' />}
                </div>
              </button>
            </div>
          </Card>

          {/* Form Actions */}
          <div className='flex gap-3 justify-end'>
            <Button
              type='button'
              variant='outline'
              onClick={() => router.push(`/dashboard/admin/produtos/${pid}`)}
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
