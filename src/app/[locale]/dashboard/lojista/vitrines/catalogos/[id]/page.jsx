'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SellerGuard from 'components/SellerGuard';
import Link from 'next/link';

export default function DetalhesVitrinePage() {
  const { id } = useParams();
  const router = useRouter();

  const [catalogo, setCatalogo] = useState(null);

  useEffect(() => {
    async function fetchCatalogo() {
      try {
        const res = await fetch(`/api/v1/catalogos/${id}`, {
          cache: 'no-store',
        });
        if (!res.ok) throw new Error('Erro ao carregar catálogo');
        const data = await res.json();
        setCatalogo(data.catalogo);
      } catch (err) {
        console.error(err);
      }
    }
    fetchCatalogo();
  }, [id]);

  if (!catalogo) {
    return <p className='p-4'>Carregando catálogo...</p>;
  }

  return (
    <SellerGuard>
      <div className='max-w-5xl mx-auto p-6'>
        {/* Cabeçalho */}
        <div className='mb-6'>
          <h1 className='text-2xl font-bold'>{catalogo.nome}</h1>
          <p className='text-gray-600'>{catalogo.descricao}</p>
          <p className='text-sm text-gray-500 mt-1'>
            Fornecedor:{' '}
            {catalogo.fornecedor?.nomeFantasia || catalogo.fornecedor?.nome}
          </p>
          <p className='text-sm text-gray-500'>Status: {catalogo.status}</p>
          <p className='text-sm text-gray-500'>
            Rating: ⭐ {catalogo.rating || 'N/A'}
          </p>
        </div>

        {/* Seção Metadados */}
        <div className='mb-6'>
          <h2 className='text-lg font-semibold mb-2'>Metadados</h2>
          <ul className='list-disc ml-5 text-sm text-gray-700'>
            <li>Continente: {catalogo.metadados?.continente}</li>
            <li>País: {catalogo.metadados?.pais}</li>
            <li>Categoria: {catalogo.metadados?.categoria}</li>
            <li>
              Especificações:{' '}
              {catalogo.metadados?.especificacoes?.join(', ') || 'Nenhuma'}
            </li>
          </ul>
        </div>

        {/* Seção Coleções */}
        <div className='mb-6'>
          <h2 className='text-lg font-semibold mb-2'>Coleções</h2>
          {catalogo.colecoes?.length ? (
            <ul className='space-y-2'>
              {catalogo.colecoes.map((colecao) => (
                <li key={colecao.id} className='border p-2 rounded'>
                  {colecao.nome}
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-sm text-gray-500'>Nenhuma coleção cadastrada.</p>
          )}
        </div>

        {/* Seção Produtos */}
        <div className='mb-6'>
          <h2 className='text-lg font-semibold mb-2'>Produtos</h2>
          {catalogo.produtos?.length ? (
            <ul className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {catalogo.produtos.map((produto) => (
                <li key={produto.id} className='border p-4 rounded shadow-sm'>
                  <h3 className='font-medium'>{produto.nome}</h3>
                  <p className='text-sm text-gray-600'>
                    Preço: R$ {produto.preco?.toFixed(2) || 'N/A'}
                  </p>
                  <Link
                    href={`/dashboard/lojista/produtos/${produto.id}`}
                    className='text-blue-600 text-sm mt-2 inline-block hover:underline'
                  >
                    Ver detalhes
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-sm text-gray-500'>Nenhum produto disponível.</p>
          )}
        </div>

        {/* Ações */}
        <div className='flex space-x-4 mt-6'>
          <button
            onClick={() => router.push('/dashboard/lojista/vitrines/principal')}
            className='px-4 py-2 rounded bg-gray-200 hover:bg-gray-300'
          >
            Voltar
          </button>
          <button
            className='px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700'
            onClick={() => router.push(`/dashboard/lojista/mensagens/${id}`)}
          >
            Solicitar Contato
          </button>
        </div>
      </div>
    </SellerGuard>
  );
}
