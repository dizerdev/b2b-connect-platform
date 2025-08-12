// app/catalogos/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ListaCatalogosPage() {
  const router = useRouter();

  const [catalogos, setCatalogos] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [userRole, setUserRole] = useState(''); // admin | fornecedor | representante | lojista

  useEffect(() => {
    async function fetchData() {
      try {
        // Busca catálogos
        const res = await fetch(
          `/api/v1/catalogos?status=${statusFilter || ''}`
        );
        if (!res.ok) throw new Error('Erro ao carregar catálogos');
        const data = await res.json();
        setCatalogos(data.catalogos);

        // Busca perfil do usuário logado (para regras de negócio)
        const userRes = await fetch('/api/v1/auth/me');
        if (!userRes.ok) throw new Error('Erro ao carregar usuário');
        const userData = await userRes.json();
        setUserRole(userData.usuario.papel);
      } catch (err) {
        console.error(err);
        setMessage('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [statusFilter]);

  function handleCriar() {
    router.push('/catalogos/novo');
  }

  function handleEditar(id) {
    router.push(`/catalogos/${id}/editar`);
  }

  async function handlePublicar(id) {
    try {
      const res = await fetch(`/api/v1/catalogos/${id}/publicar`, {
        method: 'PATCH',
      });
      if (!res.ok) throw new Error('Erro ao publicar catálogo');
      setMessage('Catálogo publicado com sucesso');
    } catch (err) {
      setMessage('Erro ao publicar catálogo');
    }
  }

  async function handleAprovar(id) {
    try {
      const res = await fetch(`/api/v1/catalogos/${id}/aprovar`, {
        method: 'PATCH',
      });
      if (!res.ok) throw new Error('Erro ao aprovar catálogo');
      setMessage('Catálogo aprovado com sucesso');
    } catch (err) {
      setMessage('Erro ao aprovar catálogo');
    }
  }

  async function handleAvaliar(id, rating) {
    try {
      const res = await fetch(`/api/v1/catalogos/${id}/rating`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating }),
      });
      if (!res.ok) throw new Error('Erro ao avaliar catálogo');
      setMessage('Avaliação registrada com sucesso');
    } catch (err) {
      setMessage('Erro ao avaliar catálogo');
    }
  }

  if (loading) return <p>Carregando...</p>;

  return (
    <div className='p-4'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-xl font-bold'>Catálogos</h1>
        {(userRole === 'admin' ||
          userRole === 'fornecedor' ||
          userRole === 'representante') && (
          <button
            onClick={handleCriar}
            className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
          >
            Novo Catálogo
          </button>
        )}
      </div>

      {message && <p className='mb-2 text-sm text-red-500'>{message}</p>}

      <div className='flex gap-4 mb-4'>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className='border px-2 py-1 rounded'
        >
          <option value=''>Todos os status</option>
          <option value='pendente'>Pendente</option>
          <option value='aprovado'>Aprovado</option>
          <option value='publicado'>Publicado</option>
        </select>
      </div>

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
                  onClick={() => router.push(`/catalogos/${cat.id}`)}
                  className='text-blue-600 underline'
                >
                  Ver
                </button>

                {/* Regras: Admin pode editar qualquer um; fornecedor/representante só pendente/aprovado próprios */}
                {(userRole === 'admin' ||
                  ((userRole === 'fornecedor' ||
                    userRole === 'representante') &&
                    (cat.status === 'pendente' ||
                      cat.status === 'aprovado'))) && (
                  <button
                    onClick={() => handleEditar(cat.id)}
                    className='text-green-600 underline'
                  >
                    Editar
                  </button>
                )}

                {/* Admin publica/aprova */}
                {userRole === 'admin' && cat.status === 'pendente' && (
                  <button
                    onClick={() => handleAprovar(cat.id)}
                    className='text-yellow-600 underline'
                  >
                    Aprovar
                  </button>
                )}

                {userRole === 'admin' && cat.status === 'aprovado' && (
                  <button
                    onClick={() => handlePublicar(cat.id)}
                    className='text-purple-600 underline'
                  >
                    Publicar
                  </button>
                )}

                {/* Admin avalia */}
                {userRole === 'admin' && (
                  <select
                    value={cat.rating || ''}
                    onChange={(e) =>
                      handleAvaliar(cat.id, Number(e.target.value))
                    }
                    className='border px-1 py-0 rounded text-sm'
                  >
                    <option value=''>Avaliar</option>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
