'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [busca, setBusca] = useState('');
  const [papel, setPapel] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/usuarios');
      if (!res.ok) throw new Error('Erro ao buscar usuários');
      const data = await res.json();
      setUsuarios(Array.isArray(data.usuarios) ? data.usuarios : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filtrarUsuarios = () => {
    return usuarios.filter((user) => {
      const matchBusca =
        user.nome.toLowerCase().includes(busca.toLowerCase()) ||
        user.email.toLowerCase().includes(busca.toLowerCase());
      const matchPapel = papel ? user.papel === papel : true;
      const matchStatus =
        status !== '' ? (status === 'ativo' ? user.ativo : !user.ativo) : true;
      return matchBusca && matchPapel && matchStatus;
    });
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleToggleAtivo = async (id, ativoAtual) => {
    try {
      const res = await fetch(`/api/v1/usuarios/${id}/ativar`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ativo: !ativoAtual }),
      });
      if (!res.ok) throw new Error('Erro ao atualizar status');
      fetchUsuarios();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold'>Usuários</h1>
        <button
          onClick={() => router.push('/dashboard/admin/usuarios/novo')}
          className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
        >
          Novo Usuário
        </button>
      </div>

      {/* Filtros */}
      <div className='flex gap-4 mb-4'>
        <input
          type='text'
          placeholder='Buscar por nome ou e-mail'
          className='border p-2 rounded w-1/3'
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <select
          className='border p-2 rounded'
          value={papel}
          onChange={(e) => setPapel(e.target.value)}
        >
          <option value=''>Todos os papéis</option>
          <option value='administrador'>Administrador</option>
          <option value='fornecedor'>Fornecedor</option>
          <option value='representante'>Representante</option>
          <option value='lojista'>Lojista</option>
        </select>
        <select
          className='border p-2 rounded'
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value=''>Todos os status</option>
          <option value='ativo'>Ativo</option>
          <option value='inativo'>Inativo</option>
        </select>
      </div>

      {/* Tabela */}
      <div className='overflow-x-auto border rounded'>
        <table className='w-full border-collapse'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='p-2 border'>Nome</th>
              <th className='p-2 border'>E-mail</th>
              <th className='p-2 border'>Papel</th>
              <th className='p-2 border'>Status</th>
              <th className='p-2 border'>Criado em</th>
              <th className='p-2 border'>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan='6' className='text-center p-4'>
                  Carregando...
                </td>
              </tr>
            ) : filtrarUsuarios().length === 0 ? (
              <tr>
                <td colSpan='6' className='text-center p-4'>
                  Nenhum usuário encontrado.
                </td>
              </tr>
            ) : (
              filtrarUsuarios().map((user) => (
                <tr key={user.id}>
                  <td className='p-2 border'>{user.nome}</td>
                  <td className='p-2 border'>{user.email}</td>
                  <td className='p-2 border capitalize'>{user.papel}</td>
                  <td className='p-2 border'>
                    <span
                      className={`px-2 py-1 rounded text-white text-sm ${
                        user.ativo ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    >
                      {user.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className='p-2 border'>
                    {new Date(user.criadoEm).toLocaleDateString('pt-BR')}
                  </td>
                  <td className='p-2 border flex gap-2'>
                    <button
                      onClick={() =>
                        router.push(
                          `/dashboard/admin/usuarios/${user.id}/editar`
                        )
                      }
                      className='bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600'
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleToggleAtivo(user.id, user.ativo)}
                      className={`px-2 py-1 rounded text-white ${
                        user.ativo
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-green-500 hover:bg-green-600'
                      }`}
                    >
                      {user.ativo ? 'Desativar' : 'Ativar'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
