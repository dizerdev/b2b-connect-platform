// app/catalogos/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

  function handleEditar(id) {
    router.push(`dashboard/admin/catalogos/${id}/editar`);
  }

  async function handlePublicar(id) {
    try {
      const res = await fetch(`/api/v1/catalogos/${id}/publicar`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Erro ao publicar catálogo');
      setMessage('Catálogo publicado com sucesso');
      router.refresh();
    } catch (err) {
      setMessage('Erro ao publicar catálogo');
    }
  }

  async function handleAprovar(id) {
    try {
      const res = await fetch(`/api/v1/catalogos/${id}/aprovar`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Erro ao aprovar catálogo');
      setMessage('Catálogo aprovado com sucesso');
      router.refresh();
    } catch (err) {
      setMessage('Erro ao aprovar catálogo');
    }
  }

  async function handleAvaliar(id, rating) {
    try {
      const res = await fetch(`/api/v1/catalogos/${id}/rating`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating }),
      });
      if (!res.ok) throw new Error('Erro ao avaliar catálogo');
      setMessage('Avaliação registrada com sucesso');
      router.refresh();
    } catch (err) {
      setMessage('Erro ao avaliar catálogo');
    }
  }

  if (loading) return <p>Carregando...</p>;

  return (
    <div className='p-4'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Lista de Catálogos</h1>
        <Link href='/dashboard/admin' className='text-blue-500 hover:underline'>
          ← Voltar
        </Link>
      </div>
      {message && <p className='mb-2 text-sm text-green-500'>{message}</p>}

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
                    cat.status === 'pendente_aprovacao'
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
                {(userRole === 'administrador' ||
                  cat.status === 'pendente_aprovacao' ||
                  cat.status === 'aprovado') && (
                  <button
                    onClick={() => handleEditar(cat.id)}
                    className='text-green-600 underline'
                  >
                    Editar
                  </button>
                )}

                {/* Admin publica/aprova */}
                {userRole === 'administrador' &&
                  cat.status === 'pendente_aprovacao' && (
                    <button
                      onClick={() => handleAprovar(cat.id)}
                      className='text-yellow-600 underline'
                    >
                      Aprovar
                    </button>
                  )}

                {userRole === 'administrador' && cat.status === 'aprovado' && (
                  <button
                    onClick={() => handlePublicar(cat.id)}
                    className='text-purple-600 underline'
                  >
                    Publicar
                  </button>
                )}

                {/* Admin avalia */}
                {userRole === 'administrador' && (
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
