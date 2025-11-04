'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import AdminGuard from 'components/AdminGuard';
import { extractFileKey } from 'lib/utils';

export default function EdicaoCatalogoPage() {
  const router = useRouter();
  const params = useParams();
  const catalogoId = params?.id;

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function fetchCatalogo() {
      try {
        const res = await fetch(`/api/v1/catalogos/${catalogoId}`);
        if (!res.ok) {
          throw new Error('Erro ao buscar catálogo');
        }
        const data = await res.json();
        setNome(data.catalogo.nome || '');
        setDescricao(data.catalogo.descricao || '');
        setImagemUrl(data.catalogo.imagem_url || '');
      } catch (err) {
        toast.error(err.message);
        router.push('/dashboard/parceiro/catalogos');
      } finally {
        setFetching(false);
      }
    }
    if (catalogoId) {
      fetchCatalogo();
    }
  }, [catalogoId, router]);

  console.log(imagemUrl);

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

      if (!prepareRes.ok) throw new Error('Erro ao preparar upload');
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
      if (!uploadRes.ok) throw new Error('Erro no upload do arquivo');

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
      toast.success('Upload concluído!');
    } catch (err) {
      toast.error(err.message || 'Erro no upload');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileUrl) => {
    try {
      const fileKey = extractFileKey(fileUrl);
      if (!fileKey) throw new Error('Chave do arquivo inválida');

      const res = await fetch('/api/v1/uploadthing/deleteFile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileKey }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao deletar arquivo');

      setImagemUrl('');
      toast.success('Imagem removida com sucesso!');
    } catch (err) {
      toast.error(err.message || 'Erro ao remover imagem');
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!nome.trim()) {
      toast.error('O nome é obrigatório.');
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
        throw new Error(err.error || 'Erro ao atualizar catálogo');
      }

      toast.success('Catálogo atualizado com sucesso!');
      router.push('/dashboard/parceiro/catalogos');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return <p className='p-6'>Carregando catálogo...</p>;
  }

  return (
    <AdminGuard>
      <div className='p-6 max-w-2xl mx-auto'>
        <h1 className='text-2xl font-bold mb-4'>Editar Catálogo</h1>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-1' htmlFor='nome'>
              Nome *
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
              Descrição
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
              Imagem de Capa
            </label>
            {imagemUrl ? (
              <div className='flex items-center gap-2'>
                <img
                  src={imagemUrl}
                  alt='Url'
                  className='w-32 h-32 object-cover rounded'
                />
                <button
                  type='button'
                  onClick={() => handleDelete(imagemUrl)}
                  className='bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700'
                  disabled={loading}
                >
                  Remover
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
              {loading ? 'Salvando...' : 'Salvar alterações'}
            </button>
            <button
              type='button'
              onClick={() => router.push('/dashboard/admin/catalogos')}
              className='bg-gray-300 px-4 py-2 rounded hover:bg-gray-400'
            >
              Cancelar
            </button>
          </div>
        </form>
        <Toaster />
      </div>
    </AdminGuard>
  );
}
