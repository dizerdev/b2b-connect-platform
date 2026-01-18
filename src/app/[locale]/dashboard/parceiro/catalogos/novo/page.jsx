'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast, Toaster } from 'react-hot-toast';
import PartnerGuard from 'components/PartnerGuard';

export default function CadastroCatalogoPage() {
  const t = useTranslations('DashboardParceiro');
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (file) => {
    try {
      setLoading(true);

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
          `/api/v1/uploadthing/pollUpload?fileKey=${uploadData.key}`
        );
        const pollData = await pollRes.json();
        status = pollData.status;
        if (status === 'still working')
          await new Promise((r) => setTimeout(r, 1000));
      }

      setImagemUrl(uploadData.ufsUrl);
      toast.success(t('UploadComplete'));
    } catch (err) {
      console.error(err);
      toast.error(err.message || t('UploadError'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileUrl) => {
    try {
      const fileKey = extractFileKey(fileUrl);
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
      console.error(err);
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

      const res = await fetch('/api/v1/catalogos/novo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, descricao, imagem_url: imagemUrl }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || t('ErrorCreating'));
      }

      toast.success(t('CatalogCreated'));
      setTimeout(() => {
        router.push('/dashboard/parceiro/catalogos');
      }, 1500);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PartnerGuard>
      <div className='p-6 max-w-2xl mx-auto'>
        <h1 className='text-2xl font-bold mb-4'>{t('RegisterCatalog')}</h1>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-1' htmlFor='nome'>
              {t('NameRequired')}
            </label>
            <input
              id='nome'
              type='text'
              className='w-full border rounded p-2'
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              className='block text-sm font-medium mb-1'
              htmlFor='descricao'
            >
              {t('Description')}
            </label>
            <textarea
              id='descricao'
              className='w-full border rounded p-2'
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={4}
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-1'>
              {t('CoverImage')}
            </label>
            {imagemUrl ? (
              <div className='flex items-center gap-2'>
                <img
                  src={imagemUrl}
                  alt='Capa'
                  className='w-32 h-32 object-cover rounded'
                />
                <button
                  type='button'
                  onClick={() => handleDelete(imagemUrl)}
                  className='bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700'
                  disabled={loading}
                >
                  {t('Remove')}
                </button>
              </div>
            ) : (
              <input
                type='file'
                onChange={(e) =>
                  e.target.files?.[0] && handleFileChange(e.target.files[0])
                }
                disabled={loading}
              />
            )}
          </div>

          <div className='flex gap-2'>
            <button
              type='submit'
              disabled={loading}
              className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50'
            >
              {loading ? t('Saving') : t('Save')}
            </button>
            <button
              type='button'
              onClick={() => router.push('/dashboard/parceiro/catalogos')}
              className='bg-gray-300 px-4 py-2 rounded hover:bg-gray-400'
            >
              {t('Cancel')}
            </button>
          </div>
        </form>
        <Toaster />
      </div>
    </PartnerGuard>
  );
}
