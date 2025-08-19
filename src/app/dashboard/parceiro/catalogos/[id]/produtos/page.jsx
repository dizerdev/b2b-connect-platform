'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import PartnerGuard from 'components/PartnerGuard';
import Image from 'next/image';

export default function CadastroProdutoPage() {
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

      const prepareRes = await fetch('/api/upload', {
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
          callbackUrl: 'https://meusite.com/api/upload/callback', // opcional
          callbackSlug: 'imageUploader',
        }),
      });

      if (!prepareRes.ok) throw new Error('Erro ao preparar upload');
      const { uploadUrls } = await prepareRes.json();
      const uploadData = uploadUrls[0];
      console.log(uploadData);
      // 2️⃣ Faz upload direto
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

      // 3️⃣ Poll até o upload concluir
      let status = 'still working';
      while (status === 'still working') {
        const pollRes = await fetch(
          `/api/pollUpload?fileKey=${uploadData.key}`
        );
        const pollData = await pollRes.json();
        console.log(pollData);
        status = pollData.status;
        if (status === 'still working')
          await new Promise((r) => setTimeout(r, 1000));
      }

      // 4️⃣ Atualiza array de imagens com URL final
      setImagens((prev) => {
        const newImgs = [...prev];
        newImgs[index] = uploadData.ufsUrl;
        return newImgs;
      });
      console.log(imagens);
      toast.success('Upload concluído!');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Erro no upload');
    } finally {
      setLoading(false);
    }
  };

  const adicionarImagem = () => setImagens([...imagens, '']);
  const removerImagem = (index) =>
    setImagens(imagens.filter((_, i) => i !== index));

  async function handleSubmit(e) {
    e.preventDefault();

    if (!nome.trim()) {
      toast.error('O nome é obrigatório.');
      return;
    }

    if (!preco || isNaN(preco)) {
      toast.error('Informe um preço válido.');
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
        throw new Error(err.error || 'Erro ao criar produto');
      }

      toast.success('Produto cadastrado com sucesso!');
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
      <div className='p-6 max-w-2xl mx-auto'>
        <h1 className='text-2xl font-bold mb-4'>Cadastrar Produto</h1>

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
            <label className='block text-sm font-medium mb-1' htmlFor='preco'>
              Preço *
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

          <div className='space-y-2'>
            <label className='block text-sm font-medium mb-1'>Imagens</label>
            {imagens.map((img, idx) => (
              <div key={idx} className='flex gap-2 items-center'>
                {img ? (
                  <img
                    src={img}
                    alt={`Imagem ${idx}`}
                    className='w-20 h-20 object-cover rounded'
                  />
                ) : (
                  <input
                    type='file'
                    onChange={(e) =>
                      e.target.files[0] &&
                      handleFileChange(e.target.files[0], idx)
                    }
                    disabled={loading}
                  />
                )}
                <button
                  type='button'
                  onClick={() => removerImagem(idx)}
                  className='bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700'
                >
                  Remover
                </button>
              </div>
            ))}
            <button
              type='button'
              onClick={adicionarImagem}
              className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
            >
              Adicionar Imagem
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
              Produto em destaque
            </label>
          </div>

          <div className='flex gap-2'>
            <button
              type='submit'
              disabled={loading}
              className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50'
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
            <button
              type='button'
              onClick={() =>
                router.push(`/dashboard/parceiro/catalogos/${catalogoId}`)
              }
              className='bg-gray-300 px-4 py-2 rounded hover:bg-gray-400'
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </PartnerGuard>
  );
}
