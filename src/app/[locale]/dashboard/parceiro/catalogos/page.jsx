'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PartnerGuard from 'components/PartnerGuard';
import Link from 'next/link';

export default function ListaCatalogosPage() {
  const router = useRouter();

  const [catalogos, setCatalogos] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          `/api/v1/catalogos/usuario?status=${statusFilter || ''}`
        );
        if (!res.ok) throw new Error('Erro ao carregar catálogos');
        const data = await res.json();
        setCatalogos(data.catalogos);
      } catch (err) {
        console.error(err);
        setMessage('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [statusFilter, router]);

  function handleCriar() {
    router.push('/dashboard/parceiro/catalogos/novo');
  }

  function handleEditar(id) {
    router.push(`/dashboard/parceiro/catalogos/${id}/editar`);
  }

  if (loading) return <p>Carregando...</p>;

  return (
    <PartnerGuard>
      <div className='p-4'>
        <div className='flex justify-between items-center mb-4'>
          <h1 className='text-xl font-bold'>Catálogos</h1>
          <div>
            <Link
              href='/dashboard/parceiro'
              className='text-blue-500 hover:underline'
            >
              ← Voltar
            </Link>
            <button
              onClick={handleCriar}
              className='bg-blue-600 text-white ml-5 px-4 py-2 rounded hover:bg-blue-700'
            >
              Novo Catálogo
            </button>
          </div>
        </div>

        {message && <p className='mb-2 text-sm text-red-500'>{message}</p>}

        <div className='flex gap-4 mb-4'>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className='border px-2 py-1 rounded'
          >
            <option value=''>Todos os status</option>
            <option value='pendente_aprovacao'>Pendente</option>
            <option value='aprovado'>Aprovado</option>
            <option value='publicado'>Publicado</option>
          </select>
        </div>
        {catalogos.length === 0 ? (
          <p>Você não possui catálogos cadastrados.</p>
        ) : (
          <table className='w-full border-collapse border border-gray-300'>
            <thead>
              <tr className='bg-gray-100'>
                <th className='border px-2 py-1'>Nome</th>
                <th className='border px-2 py-1'>Status</th>
                <th className='border px-2 py-1'>Rating</th>
                <th className='border px-2 py-1'>Criado em</th>
                <th className='border px-2 py-1'>Ações</th>
              </tr>
            </thead>
            <tbody>
              {catalogos.map((cat) => (
                <tr key={cat.id}>
                  <td className='border px-2 py-1'>{cat.nome}</td>
                  <td className='border px-2 py-1'>
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        cat.status === 'pendente'
                          ? 'bg-yellow-500'
                          : cat.status === 'aprovado'
                          ? 'bg-green-500'
                          : 'bg-blue-600'
                      }`}
                    >
                      {cat.status}
                    </span>
                  </td>
                  <td className='border px-2 py-1'>{cat.rating || '-'}</td>
                  <td className='border px-2 py-1'>
                    {new Date(cat.criadoEm).toLocaleDateString()}
                  </td>
                  <td className='border px-2 py-1 flex gap-2'>
                    <button
                      onClick={() =>
                        router.push(`/dashboard/parceiro/catalogos/${cat.id}`)
                      }
                      className='text-blue-600 underline'
                    >
                      Ver
                    </button>

                    <button
                      onClick={() => handleEditar(cat.id)}
                      className='text-green-600 underline'
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </PartnerGuard>
  );
}
