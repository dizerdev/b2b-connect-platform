// app/admin/produtos/[pid]/editar/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast, Toaster } from 'react-hot-toast';
import { extractFileKey } from 'lib/utils';
import AdminGuard from 'components/AdminGuard';

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
          : ['']
      );
      setCatalogoId(data.catalogos[0].catalogo_id);
      setDestaque(data.catalogos[0].destaque);
    } catch (err) {
      toast.error(err.message);
    }
  }

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
            destaque: true,
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || t('ErrorUpdatingProduct'));
      }

      toast.success(t('ProductUpdated'));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
      router.push(`/dashboard/admin/produtos/${pid}`);
    }
  }

  return (
    <AdminGuard>
      <div className='p-6 max-w-2xl mx-auto'>
        <h1 className='text-2xl font-bold mb-4'>{t('EditProduct')}</h1>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label htmlFor='nome' className='block text-sm font-medium mb-1'>
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
            <label htmlFor='descricao' className='block text-sm font-medium mb-1'>
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
            <label htmlFor='preco' className='block text-sm font-medium mb-1'>
              {t('PriceRequired')}
            </label>
            <input
              id='preco'
              type='number'
              step='1'
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
              id='ativo'
              type='checkbox'
              checked={destaque}
              onChange={(e) => setDestaque(e.target.checked)}
            />
            <label htmlFor='ativo' className='text-sm'>
              {t('Highlight')}
            </label>
          </div>

          <div className='flex gap-2'>
            <button
              type='submit'
              disabled={loading}
              className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50'
            >
              {loading ? t('Saving') : t('SaveChanges')}
            </button>
            <button
              type='button'
              onClick={() => router.push(`/dashboard/admin/produtos/${pid}`)}
              className='bg-gray-300 px-4 py-2 rounded hover:bg-gray-400'
            >
              {t('Cancel')}
            </button>
          </div>
          <Toaster />
        </form>
      </div>
    </AdminGuard>
  );
}
