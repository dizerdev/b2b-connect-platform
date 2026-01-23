'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import AdminGuard from 'components/AdminGuard';
import {
  ArrowLeft,
  Users,
  Search,
  Filter,
  UserPlus,
  Edit,
  Power,
  Key,
  Shield,
  Store,
  Briefcase,
  UserCheck,
  Calendar,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Card, Badge, Button, Skeleton, Avatar } from 'components/ui';

export default function UsuariosPage() {
  const t = useTranslations('DashboardAdmin');
  const [usuarios, setUsuarios] = useState([]);
  const [busca, setBusca] = useState('');
  const [papel, setPapel] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });

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
    setActionLoading((prev) => ({ ...prev, [id]: 'toggle' }));
    try {
      const res = await fetch(`/api/v1/usuarios/${id}/ativar`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ativo: !ativoAtual }),
      });
      if (!res.ok) throw new Error(t('ErrorUpdatingUser'));
      setMessage({
        type: 'success',
        text: ativoAtual
          ? 'Usuário desativado com sucesso!'
          : 'Usuário ativado com sucesso!',
      });
      fetchUsuarios();
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: t('ErrorUpdatingUser') });
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: null }));
    }
  };

  const handleResetPassword = async (id, email) => {
    setActionLoading((prev) => ({ ...prev, [`reset-${id}`]: true }));
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

      setMessage({ type: 'success', text: t('ResetEmailSent') });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setActionLoading((prev) => ({ ...prev, [`reset-${id}`]: false }));
    }
  };

  // Role config for badges
  const roleConfig = {
    administrador: {
      variant: 'error',
      icon: Shield,
      label: t('Administrator'),
    },
    fornecedor: { variant: 'info', icon: Briefcase, label: t('Supplier') },
    representante: {
      variant: 'warning',
      icon: UserCheck,
      label: t('Representative'),
    },
    lojista: { variant: 'success', icon: Store, label: t('Shopkeeper2') },
  };

  const filteredUsers = filtrarUsuarios();

  return (
    <AdminGuard>
      <div className='space-y-6'>
        {/* Page Header */}
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div>
            <div className='flex items-center gap-3 mb-1'>
              <Link
                href='/dashboard/admin'
                className='p-2 -ml-2 rounded-lg text-[var(--color-gray-500)] hover:text-[var(--color-gray-700)] hover:bg-[var(--color-gray-100)] transition-colors'
                aria-label='Voltar'
              >
                <ArrowLeft size={20} />
              </Link>
              <h1 className='text-2xl font-heading font-bold text-[var(--color-gray-900)]'>
                {t('Users')}
              </h1>
              <Badge variant='default' size='sm'>
                {usuarios.length} usuário{usuarios.length !== 1 ? 's' : ''}
              </Badge>
            </div>
            <p className='text-[var(--color-gray-500)] ml-10'>
              Gerencie os usuários do sistema
            </p>
          </div>
          <Button
            icon={UserPlus}
            onClick={() => router.push('/dashboard/admin/usuarios/novo')}
          >
            {t('NewUser')}
          </Button>
        </div>

        {/* Success/Error Messages */}
        {message.text && (
          <div
            className={`
            p-4 rounded-lg border animate-fade-in-down flex items-center gap-2
            ${
              message.type === 'success'
                ? 'bg-[var(--color-success-bg)] border-[var(--color-accent-emerald)]/20 text-[var(--color-accent-emerald)]'
                : 'bg-[var(--color-error-bg)] border-[var(--color-accent-rose)]/20 text-[var(--color-accent-rose)]'
            }
          `}
          >
            {message.type === 'success' ? (
              <CheckCircle size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            {message.text}
            <button
              onClick={() => setMessage({ type: '', text: '' })}
              className='ml-auto text-current opacity-60 hover:opacity-100'
            >
              ×
            </button>
          </div>
        )}

        {/* Filters Section */}
        <div className='flex flex-col sm:flex-row gap-4'>
          {/* Search */}
          <div className='flex-1 relative'>
            <Search
              size={18}
              className='absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-gray-400)]'
            />
            <input
              type='text'
              placeholder={t('SearchByNameOrEmail')}
              className='
                w-full pl-11 pr-4 py-2.5 rounded-lg text-sm
                border border-[var(--color-gray-200)]
                bg-white text-[var(--color-gray-700)]
                placeholder:text-[var(--color-gray-400)]
                focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/20
                focus:border-[var(--color-primary-500)]
                transition-all
              '
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          {/* Role Filter */}
          <div className='flex items-center gap-2'>
            <div className='flex items-center gap-1 text-[var(--color-gray-500)]'>
              <Filter size={14} />
            </div>
            <select
              className='
                px-4 py-2.5 rounded-lg text-sm
                border border-[var(--color-gray-200)]
                bg-white text-[var(--color-gray-700)]
                focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/20
                focus:border-[var(--color-primary-500)]
                transition-all min-w-[140px]
              '
              value={papel}
              onChange={(e) => setPapel(e.target.value)}
            >
              <option value=''>{t('AllRoles')}</option>
              <option value='administrador'>{t('Administrator')}</option>
              <option value='fornecedor'>{t('Supplier')}</option>
              <option value='representante'>{t('Representative')}</option>
              <option value='lojista'>{t('Shopkeeper2')}</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              className='
                px-4 py-2.5 rounded-lg text-sm
                border border-[var(--color-gray-200)]
                bg-white text-[var(--color-gray-700)]
                focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/20
                focus:border-[var(--color-primary-500)]
                transition-all min-w-[120px]
              '
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value=''>{t('AllStatus')}</option>
              <option value='ativo'>{t('Active')}</option>
              <option value='inativo'>{t('Inactive')}</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <Card variant='default' padding={false}>
          <div className='overflow-x-auto'>
            <table className='w-full text-left'>
              <thead>
                <tr className='border-b border-[var(--color-gray-100)]'>
                  <th className='px-5 py-4 text-xs font-semibold text-[var(--color-gray-500)] uppercase tracking-wider'>
                    Usuário
                  </th>
                  <th className='px-5 py-4 text-xs font-semibold text-[var(--color-gray-500)] uppercase tracking-wider'>
                    {t('Role')}
                  </th>
                  <th className='px-5 py-4 text-xs font-semibold text-[var(--color-gray-500)] uppercase tracking-wider'>
                    {t('Status')}
                  </th>
                  <th className='px-5 py-4 text-xs font-semibold text-[var(--color-gray-500)] uppercase tracking-wider'>
                    {t('CreatedAt')}
                  </th>
                  <th className='px-5 py-4 text-xs font-semibold text-[var(--color-gray-500)] uppercase tracking-wider'>
                    {t('Actions')}
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-[var(--color-gray-100)]'>
                {loading ? (
                  // Skeleton Loading State
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className='px-5 py-4'>
                        <div className='flex items-center gap-3'>
                          <Skeleton
                            variant='circular'
                            width='40px'
                            height='40px'
                          />
                          <div className='space-y-1'>
                            <Skeleton variant='text' width='120px' />
                            <Skeleton variant='text' width='160px' />
                          </div>
                        </div>
                      </td>
                      <td className='px-5 py-4'>
                        <Skeleton variant='text' width='100px' />
                      </td>
                      <td className='px-5 py-4'>
                        <Skeleton variant='text' width='70px' />
                      </td>
                      <td className='px-5 py-4'>
                        <Skeleton variant='text' width='90px' />
                      </td>
                      <td className='px-5 py-4'>
                        <div className='flex gap-2'>
                          <Skeleton
                            variant='rectangular'
                            width='36px'
                            height='36px'
                            className='rounded-lg'
                          />
                          <Skeleton
                            variant='rectangular'
                            width='36px'
                            height='36px'
                            className='rounded-lg'
                          />
                          <Skeleton
                            variant='rectangular'
                            width='36px'
                            height='36px'
                            className='rounded-lg'
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : filteredUsers.length === 0 ? (
                  // Empty State
                  <tr>
                    <td colSpan={5} className='px-5 py-16 text-center'>
                      <div className='flex flex-col items-center gap-3'>
                        <div className='w-16 h-16 rounded-full bg-[var(--color-gray-100)] flex items-center justify-center'>
                          <Users
                            size={28}
                            className='text-[var(--color-gray-400)]'
                          />
                        </div>
                        <div>
                          <p className='font-medium text-[var(--color-gray-700)]'>
                            {t('NoUsersFound')}
                          </p>
                          <p className='text-sm text-[var(--color-gray-500)]'>
                            {busca || papel || status
                              ? 'Tente ajustar os filtros aplicados'
                              : 'Cadastre novos usuários para começar'}
                          </p>
                        </div>
                        {(busca || papel || status) && (
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => {
                              setBusca('');
                              setPapel('');
                              setStatus('');
                            }}
                          >
                            Limpar filtros
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  // Data Rows
                  filteredUsers.map((user) => {
                    const RoleIcon = roleConfig[user.papel]?.icon || Users;
                    return (
                      <tr
                        key={user.id}
                        className='hover:bg-[var(--color-gray-50)] transition-colors group'
                      >
                        {/* User Info */}
                        <td className='px-5 py-4'>
                          <div className='flex items-center gap-3'>
                            <Avatar name={user.nome} size='md' />
                            <div>
                              <p className='font-medium text-[var(--color-gray-900)]'>
                                {user.nome}
                              </p>
                              <p className='text-sm text-[var(--color-gray-500)]'>
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className='px-5 py-4'>
                          <Badge
                            variant={
                              roleConfig[user.papel]?.variant || 'default'
                            }
                            size='sm'
                          >
                            <RoleIcon size={12} className='mr-1' />
                            {roleConfig[user.papel]?.label || user.papel}
                          </Badge>
                        </td>

                        {/* Status */}
                        <td className='px-5 py-4'>
                          <Badge
                            variant={user.ativo ? 'success' : 'error'}
                            size='sm'
                            dot
                          >
                            {user.ativo ? t('Active') : t('Inactive')}
                          </Badge>
                        </td>

                        {/* Created At */}
                        <td className='px-5 py-4'>
                          <div className='flex items-center gap-1.5 text-[var(--color-gray-600)]'>
                            <Calendar
                              size={14}
                              className='text-[var(--color-gray-400)]'
                            />
                            <span className='text-sm'>
                              {new Date(user.criadoEm).toLocaleDateString(
                                'pt-BR',
                              )}
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className='px-5 py-4'>
                          <div className='flex items-center gap-2'>
                            <button
                              onClick={() =>
                                router.push(
                                  `/dashboard/admin/usuarios/${user.id}/editar`,
                                )
                              }
                              className='p-2 rounded-lg text-[var(--color-gray-500)] hover:text-amber-600 hover:bg-amber-50 transition-colors'
                              title={t('Edit')}
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() =>
                                handleToggleAtivo(user.id, user.ativo)
                              }
                              disabled={actionLoading[user.id] === 'toggle'}
                              className={`
                                p-2 rounded-lg transition-colors
                                ${
                                  user.ativo
                                    ? 'text-[var(--color-gray-500)] hover:text-[var(--color-accent-rose)] hover:bg-red-50'
                                    : 'text-[var(--color-gray-500)] hover:text-[var(--color-accent-emerald)] hover:bg-emerald-50'
                                }
                                disabled:opacity-50
                              `}
                              title={
                                user.ativo ? t('Deactivate') : t('Activate')
                              }
                            >
                              <Power size={18} />
                            </button>
                            <button
                              onClick={() =>
                                handleResetPassword(user.id, user.email)
                              }
                              disabled={actionLoading[`reset-${user.id}`]}
                              className='p-2 rounded-lg text-[var(--color-gray-500)] hover:text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50'
                              title={t('ResetPassword')}
                            >
                              <Key size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminGuard>
  );
}
