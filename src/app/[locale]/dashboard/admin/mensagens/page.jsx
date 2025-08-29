'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminGuard from 'components/AdminGuard';

export default function ListaMensagensPage() {
  const router = useRouter();
  const [mensagens, setMensagens] = useState([]);
  const [statusFilter, setStatusFilter] = useState('todas');
  const [catalogoFilter, setCatalogoFilter] = useState('');
  const [catalogos, setCatalogos] = useState([]); // para popular filtro de catálogo

  useEffect(() => {
    async function fetchMensagens() {
      try {
        const params = new URLSearchParams();
        if (statusFilter !== 'todas') params.append('status', statusFilter);
        if (catalogoFilter) params.append('catalogo', catalogoFilter);

        const res = await fetch(`/api/v1/mensagens?${params.toString()}`, {
          cache: 'no-store',
        });
        if (!res.ok) throw new Error('Erro ao carregar mensagens');
        const data = await res.json();

        setMensagens(
          data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        );

        // coletar catálogos distintos para filtro
        const uniqueCatalogos = [
          ...new Map(
            data.map((m) => [m.catalogo_id, m.catalogo_nome])
          ).entries(),
        ].map(([id, nome]) => ({ id, nome }));
        setCatalogos(uniqueCatalogos);
      } catch (err) {
        console.error(err);
      }
    }
    fetchMensagens();
  }, [statusFilter, catalogoFilter]);

  return (
    <AdminGuard>
      <div className='p-6 space-y-6'>
        <div className='flex justify-between items-center mb-4'>
          <h1 className='text-2xl font-bold'>Mensagens</h1>
          <div>
            <Link
              href='/dashboard/admin'
              className='text-blue-500 hover:underline'
            >
              ← Voltar
            </Link>
          </div>
        </div>

        {/* Filtros */}
        <div className='flex flex-wrap gap-4 items-center'>
          <div>
            <label className='text-sm font-medium block mb-1'>Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className='border rounded-lg px-3 py-2'
            >
              <option value='todas'>Todas</option>
              <option value='nova'>Novas</option>
              <option value='respondida'>Respondidas</option>
            </select>
          </div>

          <div>
            <label className='text-sm font-medium block mb-1'>Catálogo</label>
            <select
              value={catalogoFilter}
              onChange={(e) => setCatalogoFilter(e.target.value)}
              className='border rounded-lg px-3 py-2'
            >
              <option value=''>Todos</option>
              {catalogos.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabela */}
        <div className='overflow-x-auto'>
          <table className='w-full border-collapse'>
            <thead>
              <tr className='bg-gray-100 text-left text-sm font-semibold'>
                <th className='p-3 border-b'>Catálogo</th>
                <th className='p-3 border-b'>Lojista</th>
                <th className='p-3 border-b'>Status</th>
                <th className='p-3 border-b'>Recebida em</th>
                <th className='p-3 border-b'></th>
              </tr>
            </thead>
            <tbody>
              {mensagens.length > 0 ? (
                mensagens.map((msg) => (
                  <tr
                    key={msg.id}
                    className={`text-sm hover:bg-gray-50 ${
                      msg.status === 'nova' ? 'font-semibold' : ''
                    }`}
                  >
                    <td className='p-3 border-b'>{msg.catalogo_nome}</td>
                    <td className='p-3 border-b'>{msg.lojista_nome}</td>
                    <td className='p-3 border-b'>
                      {msg.status === 'nova' ? (
                        <span className='px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full'>
                          Nova
                        </span>
                      ) : (
                        <span className='px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full'>
                          Respondida
                        </span>
                      )}
                    </td>
                    <td className='p-3 border-b'>
                      {new Date(msg.created_at).toLocaleString('pt-BR')}
                    </td>
                    <td className='p-3 border-b'>
                      <button
                        onClick={() =>
                          router.push(`/dashboard/admin/mensagens/${msg.id}`)
                        }
                        className='px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700'
                      >
                        Ver detalhes
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan='5'
                    className='p-4 text-center text-gray-500 italic'
                  >
                    Nenhuma mensagem encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminGuard>
  );
}
