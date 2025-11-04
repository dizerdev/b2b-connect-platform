'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SellerGuard from 'components/SellerGuard';
import ProductGallery from 'components/shared/ProductGallery';
import sanitizeHtml from 'sanitize-html';

export default function DetalhesProdutoLojistaPage() {
  const { pid } = useParams();
  const router = useRouter();

  const [produto, setProduto] = useState(null);

  useEffect(() => {
    async function fetchProduto() {
      try {
        const res = await fetch(`/api/v1/produtos/${pid}`);
        if (!res.ok) throw new Error('Erro ao buscar produto');
        const data = await res.json();
        setProduto(data);
        console.log(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchProduto();
  }, [pid]);

  if (!produto) {
    return <div className='p-6'>Carregando produto...</div>;
  }

  const imagens = produto.produto.imagens || [];
  const catalogo = produto.catalogos?.[0];

  // Sanitiza o HTML antes de injetar
  const safeDescription = sanitizeHtml(produto.produto.descricao, {
    allowedTags: [
      'div',
      'h1',
      'h2',
      'p',
      'span',
      'strong',
      'em',
      'ul',
      'li',
      'br',
    ],
    allowedAttributes: {
      '*': ['class', 'style'],
    },
  });

  return (
    <SellerGuard>
      <div className='w-full mx-auto p-6'>
        {/* Header */}
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold'>{produto.produto.nome}</h1>
          <button
            onClick={() => router.back()}
            className='text-blue-500 hover:underline'
          >
            ← Voltar
          </button>
        </div>

        {/* Layout principal */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {/* Galeria de imagens */}
          {imagens.length > 0 ? (
            <ProductGallery images={imagens} />
          ) : (
            <div className='flex items-center justify-center h-80 bg-gray-100 text-gray-500 rounded'>
              Sem fotos disponíveis
            </div>
          )}

          {/* Informações do produto */}
          <div className='flex flex-col gap-4'>
            <div className='bg-white rounded-lg shadow p-4'>
              <p className='mb-2'>{produto.produto.nome || '—'}</p>
              <div className='mb-2'>
                <span className='font-semibold'>Descrição</span>{' '}
                <div
                  className='prose max-w-none itens-center'
                  dangerouslySetInnerHTML={{ __html: safeDescription }}
                />
              </div>
              <p className='mb-2'>
                <span className='font-semibold'>Preço</span>{' '}
                {catalogo?.preco
                  ? `R$ ${catalogo.preco.toFixed(2)}`
                  : 'Sob consulta'}
              </p>
            </div>

            <button
              onClick={() =>
                router.push(
                  `/dashboard/lojista/vitrines/individual/${catalogo?.fornecedor_id}`
                )
              }
              className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
            >
              Ver Vitrine do Fornecedor
            </button>
          </div>
        </div>

        {/* Grades */}
        <div className='bg-white rounded-lg shadow p-4 mt-8'>
          <h2 className='text-lg font-semibold mb-4'>Grades disponíveis</h2>
          {produto.grades?.length > 0 ? (
            <table className='w-full border-collapse border'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='border px-4 py-2'>Cor</th>
                  <th className='border px-4 py-2'>Tamanho</th>
                  <th className='border px-4 py-2'>Tipo</th>
                  <th className='border px-4 py-2'>Pronta Entrega</th>
                  <th className='border px-4 py-2'>Estoque</th>
                </tr>
              </thead>
              <tbody>
                {produto.grades.map((g, idx) => (
                  <tr key={idx}>
                    <td className='border px-4 py-2'>{g.cor}</td>
                    <td className='border px-4 py-2'>{g.tamanho}</td>
                    <td className='border px-4 py-2'>{g.tipo}</td>
                    <td className='border px-4 py-2'>
                      {g.estoque ? 'Sim' : 'Não'}
                    </td>
                    <td className='border px-4 py-2'>
                      {g.estoque > 0 ? g.estoque : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className='text-gray-500'>Nenhuma grade cadastrada</p>
          )}
        </div>
      </div>
    </SellerGuard>
  );
}
