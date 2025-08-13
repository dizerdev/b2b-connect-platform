// app/catalogos/[id]/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import PartnerGuard from 'components/PartnerGuard';

export default function CatalogoDetalhesPage() {
  const router = useRouter();
  const { id } = useParams();
  const [catalogo, setCatalogo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/v1/catalogos/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao carregar catálogo');
        return res.json();
      })
      .then((data) => setCatalogo(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  function handleEditarInfo() {
    router.push(`/dashboard/parceiro/catalogos/${id}/editar`);
  }

  function handleAdicionarColecao() {
    router.push(`/dashboard/parceiro/catalogos/${id}/colecoes/nova`);
  }

  function handleAdicionarProduto() {
    router.push(`/dashboard/parceiro/catalogos/${id}/produtos/novo`);
  }

  function handleDefinirMetadados() {
    router.push(`/dashboard/parceiro/catalogos/${id}/metadados`);
  }

  if (loading) return <p>Carregando...</p>;
  if (error) return <p className='text-red-500'>{error}</p>;
  if (!catalogo) return <p>Catálogo não encontrado</p>;

  return (
    <PartnerGuard>
      <div className='p-4'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold'>Detalhes do Catálogo</h1>
          <Link
            href='/dashboard/parceiro/catalogos'
            className='text-blue-500 hover:underline'
          >
            ← Voltar
          </Link>
        </div>

        {/* Informações básicas */}
        <section className='mb-6'>
          <h2 className='text-lg font-semibold mb-2'>Informações básicas</h2>
          <p>
            <strong>Nome:</strong> {catalogo.catalogo.nome}
          </p>
          <p>
            <strong>Descrição:</strong> {catalogo.catalogo.descricao}
          </p>
          <p>
            <strong>Status:</strong> {catalogo.catalogo.status}
          </p>
          <p>
            <strong>Rating:</strong>{' '}
            {catalogo.catalogo.rating || 'Sem avaliação'}
          </p>
          <button onClick={handleEditarInfo} className='btn-primary mt-2'>
            Editar nome/descrição
          </button>
        </section>

        {/* Coleções */}
        <section className='mb-6'>
          <div className='flex justify-between items-center mb-2'>
            <h2 className='text-lg font-semibold'>Coleções</h2>
            <button onClick={handleAdicionarColecao} className='btn-secondary'>
              + Adicionar coleção
            </button>
          </div>
          {catalogo.colecoes?.length ? (
            <ul className='list-disc pl-6'>
              {catalogo.colecoes.map((c) => (
                <li key={c.id}>{c.nome}</li>
              ))}
            </ul>
          ) : (
            <p>Nenhuma coleção cadastrada</p>
          )}
        </section>

        {/* Produtos */}
        <section className='mb-6'>
          <div className='flex justify-between items-center mb-2'>
            <h2 className='text-lg font-semibold'>Produtos</h2>
            <button onClick={handleAdicionarProduto} className='btn-secondary'>
              + Adicionar produto
            </button>
          </div>
          {catalogo.produtos?.length ? (
            <ul className='list-disc pl-6'>
              {catalogo.produtos.map((p) => (
                <li key={p.id}>{p.nome}</li>
              ))}
            </ul>
          ) : (
            <p>Nenhum produto cadastrado</p>
          )}
        </section>

        {/* Metadados */}
        <section className='mb-6'>
          <h2 className='text-lg font-semibold mb-2'>Metadados</h2>
          <p>
            <strong>Continente:</strong> {catalogo.metadados?.continente || '-'}
          </p>
          <p>
            <strong>País:</strong> {catalogo.metadados?.pais || '-'}
          </p>
          <p>
            <strong>Categoria:</strong> {catalogo.metadados?.categoria || '-'}
          </p>
          <p>
            <strong>Especificações:</strong>{' '}
            {catalogo.metadados?.especificacoes || '-'}
          </p>
          <button
            onClick={handleDefinirMetadados}
            className='btn-secondary mt-2'
          >
            Definir metadados
          </button>
        </section>
      </div>
    </PartnerGuard>
  );
}
