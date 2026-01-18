'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import AdminGuard from 'components/AdminGuard';

export default function UsuariosPage() {
  const t = useTranslations('DashboardAdmin');
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
      if (!res.ok) throw new Error(t('ErrorLoadingData'));
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
      if (!res.ok) throw new Error(t('ErrorUpdatingUser'));
      fetchUsuarios();
    } catch (error) {
      console.error(error);
    }
  };

  const handleResetPassword = async (email) => {
    try {
      const res = await fetch('/api/v1/auth/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || t('ErrorSendingEmail'));
      }

      alert(t('ResetEmailSent'));
    } catch (err) {
      alert(`Erro: ${err.message}`);
    }
  };

  return (
    <AdminGuard>
      <div className='p-6'>
        <div className='flex justify-between items-center mb-4'>
          <h1 className='text-2xl font-bold'>{t('Users')}</h1>
          <div>
            <Link
              href='/dashboard/admin'
              className='text-blue-500 hover:underline'
            >
              {t('Back')}
            </Link>
            <button
              onClick={() => router.push('/dashboard/admin/usuarios/novo')}
              className='bg-blue-600 text-white px-4 py-2 ml-3 rounded hover:bg-blue-700'
            >
              {t('NewUser')}
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className='flex gap-4 mb-4'>
          <input
            type='text'
            placeholder={t('SearchByNameOrEmail')}
            className='border p-2 rounded w-1/3'
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <select
            className='border p-2 rounded'
            value={papel}
            onChange={(e) => setPapel(e.target.value)}
          >
            <option value=''>{t('AllRoles')}</option>
            <option value='administrador'>{t('Administrator')}</option>
            <option value='fornecedor'>{t('Supplier')}</option>
            <option value='representante'>{t('Representative')}</option>
            <option value='lojista'>{t('Shopkeeper2')}</option>
          </select>
          <select
            className='border p-2 rounded'
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value=''>{t('AllStatus')}</option>
            <option value='ativo'>{t('Active')}</option>
            <option value='inativo'>{t('Inactive')}</option>
          </select>
        </div>

        {/* Tabela */}
        <div className='overflow-x-auto border rounded'>
          <table className='w-full border-collapse'>
            <thead className='bg-gray-100'>
              <tr>
                <th className='p-2 border'>{t('Name')}</th>
                <th className='p-2 border'>{t('Email')}</th>
                <th className='p-2 border'>{t('Role')}</th>
                <th className='p-2 border'>{t('Status')}</th>
                <th className='p-2 border'>{t('CreatedAt')}</th>
                <th className='p-2 border'>{t('Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan='6' className='text-center p-4'>
                    {t('Loading')}
                  </td>
                </tr>
              ) : filtrarUsuarios().length === 0 ? (
                <tr>
                  <td colSpan='6' className='text-center p-4'>
                    {t('NoUsersFound')}
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
                        {user.ativo ? t('Active') : t('Inactive')}
                      </span>
                    </td>
                    <td className='p-2 border'>
                      {new Date(user.criadoEm).toLocaleDateString('pt-BR')}
                    </td>
                    <td className='p-2 border flex justify-center gap-2'>
                      <button
                        onClick={() =>
                          router.push(
                            `/dashboard/admin/usuarios/${user.id}/editar`
                          )
                        }
                        className='bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600'
                      >
                        {t('Edit')}
                      </button>
                      <button
                        onClick={() => handleToggleAtivo(user.id, user.ativo)}
                        className={`px-2 py-1 rounded text-white ${
                          user.ativo
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-green-500 hover:bg-green-600'
                        }`}
                      >
                        {user.ativo ? t('Deactivate') : t('Activate')}
                      </button>

                      <button
                        onClick={() => handleResetPassword(user.email)}
                        className='bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600'
                      >
                        {t('ResetPassword')}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminGuard>
  );
}
