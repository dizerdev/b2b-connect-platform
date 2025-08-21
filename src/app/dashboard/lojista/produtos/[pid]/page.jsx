'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SellerGuard from 'components/SellerGuard';
import Banner from 'components/shared/Banner';

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

  return (
    <SellerGuard>
      <div className='max-w-5xl mx-auto p-6'>
        {/* Header */}
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold'>{produto.nome}</h1>
          <button
            onClick={() => router.back()}
            className='bg-gray-200 px-4 py-2 rounded hover:bg-gray-300'
          >
            Voltar
          </button>
        </div>
        <Banner src={produto.produto.imagens[0]} alt='Catálogo X' />
        <br />
        {/* Fotos */}
        <div className='flex gap-4 overflow-x-auto mb-6'>
          {produto.produto.imagens?.length > 0 ? (
            produto.produto.imagens.map((foto, index) => (
              <img
                key={index}
                src={foto}
                alt={`Foto ${index + 1}`}
                className='h-48 w-48 object-cover rounded'
              />
            ))
          ) : (
            <div className='text-gray-500'>Sem fotos disponíveis</div>
          )}
        </div>

        {/* Informações básicas */}
        <div className='bg-white rounded-lg shadow p-4 mb-6'>
          <p className='mb-2'>
            <span className='font-semibold'>Nome:</span>{' '}
            {produto.produto.nome || '—'}
          </p>
          <p className='mb-2'>
            <span className='font-semibold'>Descrição:</span>{' '}
            {produto.produto.descricao || '—'}
          </p>
          <p className='mb-2'>
            <span className='font-semibold'>Preço:</span> R${' '}
            {produto.catalogos[0].preco?.toFixed(2) || '—'}
          </p>
          <p className='mb-2'>
            <span className='font-semibold'>Fornecedor:</span>{' '}
            {produto.fornecedor?.nome || '—'}
          </p>
          <p>
            <span className='font-semibold'>Rating:</span> ⭐{' '}
            {produto.rating || 'N/A'}
          </p>
        </div>
        <div>
          <button
            onClick={() =>
              router.push(
                `/dashboard/lojista/vitrines/individual/${produto.catalogos[0].fornecedor_id}`
              )
            }
            className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
          >
            Ver Vitrine do Fornecedor
          </button>
        </div>
        <br />
        {/* Grades */}
        <div className='bg-white rounded-lg shadow p-4'>
          <h2 className='text-lg font-semibold mb-4'>Grades disponíveis</h2>
          {produto.grades?.length > 0 ? (
            <table className='w-full border-collapse border'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='border px-4 py-2'>Cor</th>
                  <th className='border px-4 py-2'>Tamanho</th>
                  <th className='border px-4 py-2'>Estoque</th>
                </tr>
              </thead>
              <tbody>
                {produto.grades.map((g, idx) => (
                  <tr key={idx}>
                    <td className='border px-4 py-2'>{g.cor}</td>
                    <td className='border px-4 py-2'>{g.tamanho}</td>
                    <td className='border px-4 py-2'>{g.estoque}</td>
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
