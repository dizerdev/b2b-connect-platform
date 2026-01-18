'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast, Toaster } from 'react-hot-toast';
import PartnerGuard from 'components/PartnerGuard';
import { extractFileKey } from 'lib/utils';

export default function CadastroProdutoPage() {
  const t = useTranslations('DashboardParceiro');
  const router = useRouter();
  const params = useParams();
  const catalogoId = params?.id;

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [imagens, setImagens] = useState(['']);
  const [destaque, setDestaque] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (file, index) => {
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
      setLoading(false);
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

      const res = await fetch(`/api/v1/catalogos/${catalogoId}/produtos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          descricao,
          preco: parseFloat(preco),
          imagens: imagens.filter((i) => i.trim() !== ''),
          destaque,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || t('ErrorCreatingProduct'));
      }

      toast.success(t('ProductCreated'));
      setTimeout(() => {
        router.push(`/dashboard/parceiro/catalogos/${catalogoId}`);
      }, 1500);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PartnerGuard>
      <div className='p-6 max-w-3xl mx-auto'>
        <h1 className='text-3xl font-bold mb-6 text-gray-800'>
          {t('RegisterProduct')}
        </h1>

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
            <label className='block text-sm font-medium mb-1' htmlFor='preco'>
              {t('PriceRequired')}
            </label>
            <input
              id='preco'
              type='number'
              step='0.01'
              className='w-full border rounded p-2'
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              required
            />
          </div>

          <div className='space-y-4'>
            <label className='block text-sm font-medium mb-1'>{t('Images')}</label>

            {/* Grid de imagens */}
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              {imagens.slice().map((img, idx) => {
                const key = extractFileKey(img);

                return (
                  <div key={idx} className='flex flex-col items-center'>
                    {img ? (
                      <div className='flex flex-col items-center gap-2'>
                        <img
                          src={img}
                          alt={`Imagem ${idx}`}
                          className='w-20 h-20 object-cover rounded'
                        />
                        <button
                          type='button'
                          onClick={() => {
                            handleDelete(key);
                            removerImagem(idx);
                          }}
                          className='bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700'
                        >
                          {t('Remove')}
                        </button>
                      </div>
                    ) : (
                      <div className='flex flex-col items-center gap-2'>
                        <label
                          htmlFor={`file-input-${idx}`}
                          className='cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'
                        >
                          {t('SelectFile')}
                        </label>
                        <span className='text-gray-700'>
                          {img[idx] || t('NoFileSelected')}
                        </span>
                        <input
                          id={`file-input-${idx}`}
                          type='file'
                          className='hidden'
                          onChange={(e) => {
                            if (e.target.files[0])
                              handleFileChange(e.target.files[0], idx);
                          }}
                          disabled={loading}
                        />
                        <button
                          className='bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700'
                          onClick={() => {
                            removerImagem(idx);
                          }}
                        >
                          X
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              type='button'
              onClick={adicionarImagem}
              className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
            >
              {t('AddImage')}
            </button>
          </div>

          <div className='flex items-center gap-2'>
            <input
              id='destaque'
              type='checkbox'
              checked={destaque}
              onChange={(e) => setDestaque(e.target.checked)}
            />
            <label htmlFor='destaque' className='text-sm'>
              {t('FeaturedProduct')}
            </label>
          </div>

          <div className='flex gap-2'>
            <button
              type='submit'
              disabled={loading}
              className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50'
            >
              {loading ? t('Saving') : t('Save')}
            </button>
            <button
              type='button'
              onClick={() =>
                router.push(`/dashboard/parceiro/catalogos/${catalogoId}`)
              }
              className='bg-gray-300 px-4 py-2 rounded hover:bg-gray-400'
            >
              {t('Cancel')}
            </button>
          </div>
          <Toaster />
        </form>
      </div>
    </PartnerGuard>
  );
}
