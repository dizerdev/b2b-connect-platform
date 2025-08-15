'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import PartnerGuard from 'components/PartnerGuard';

export default function DetalhesProdutoPage() {
  const { pid } = useParams();
  const router = useRouter();

  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProduto = async () => {
    try {
      const res = await fetch(`/api/v1/produtos/${pid}`);
      if (!res.ok) throw new Error('Erro ao buscar produto');
      const data = await res.json();
      setProduto(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduto();
  }, [pid]);

  if (loading) return <p className='p-4'>Carregando...</p>;
  if (!produto) return <p className='p-4'>Produto não encontrado.</p>;

  return (
    <PartnerGuard>
      <div className='p-6 space-y-6'>
        <header className='flex justify-between items-center'>
          <h1 className='text-2xl font-bold'>Lista de Catálogos</h1>
          <Link
            href={`/dashboard/parceiro/catalogos/${produto.catalogos[0].catalogo_id}`}
            className='text-blue-500 hover:underline'
          >
            ← Voltar
          </Link>
        </header>

        {/* Informações básicas */}
        <section className='bg-white shadow rounded p-4 space-y-2'>
          <h2 className='text-lg font-semibold'>Informações Básicas</h2>
          <p>
            <strong>Nome:</strong> {produto.produto.nome}
          </p>
          <p>
            <strong>Descrição:</strong> {produto.produto.descricao}
          </p>
          <p>
            <strong>Preço:</strong> R$ {produto.catalogos[0].preco}
          </p>
          <p>
            <strong>Status:</strong>{' '}
            <span
              className={`px-2 py-1 text-sm rounded ${
                produto.ativo
                  ? 'bg-green-200 text-green-800'
                  : 'bg-red-200 text-red-800'
              }`}
            >
              {produto.ativo ? 'Ativo' : 'Inativo'}
            </span>
          </p>
          <p>
            <strong>Criado em:</strong>{' '}
            {new Date(produto.produto.created_at).toLocaleDateString()}
          </p>
        </section>

        {/* Grades do produto */}
        {produto.grades && produto.grades.length > 0 && (
          <section className='bg-white shadow rounded p-4 space-y-2'>
            <h2 className='text-lg font-semibold'>Grades</h2>
            <table className='w-full border border-gray-200'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='border px-2 py-1 text-left'>Cor</th>
                  <th className='border px-2 py-1 text-left'>Tamanho</th>
                  <th className='border px-2 py-1 text-left'>Estoque</th>
                  <th className='border px-2 py-1 text-left'>Criado em</th>
                </tr>
              </thead>
              <tbody>
                {produto.grades.map((grade, idx) => (
                  <tr key={idx}>
                    <td className='border px-2 py-1'>{grade.cor}</td>
                    <td className='border px-2 py-1'>{grade.tamanho}</td>
                    <td className='border px-2 py-1'>{grade.estoque}</td>
                    <td className='border px-2 py-1'>
                      {new Date(grade.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* Ações extras */}
        <section className='bg-white shadow rounded p-4 space-y-4'>
          <h2 className='text-lg font-semibold'>Ações</h2>
          <div className='flex gap-4'>
            <Link
              href={`/dashboard/parceiro/produtos/${pid}/grades`}
              className='px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700'
            >
              Gerenciar Grades
            </Link>
            <Link
              href={`/dashboard/parceiro/produtos/${pid}/fotos`}
              className='px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700'
            >
              Gerenciar Fotos
            </Link>
            <Link
              href={`/dashboard/parceiro/produtos/${pid}/editar`}
              className='px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700'
            >
              Editar Produto
            </Link>
          </div>
        </section>

        {/* Imagens do produto */}
        {produto.fotos && produto.fotos.length > 0 && (
          <section className='bg-white shadow rounded p-4'>
            <h2 className='text-lg font-semibold mb-4'>Fotos</h2>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              {produto.fotos.map((foto, idx) => (
                <img
                  key={idx}
                  src={foto.url}
                  alt={`Foto ${idx + 1}`}
                  className='w-full h-40 object-cover rounded'
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </PartnerGuard>
  );
}
