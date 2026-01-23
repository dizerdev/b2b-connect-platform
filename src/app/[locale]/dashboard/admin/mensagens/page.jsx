'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminGuard from 'components/AdminGuard';
import {
  MessageSquare,
  ArrowLeft,
  Filter,
  Eye,
  Mail,
  MailOpen,
  Clock,
  User,
  FolderOpen,
} from 'lucide-react';
import { Card, Badge, Button, Skeleton, Avatar } from 'components/ui';

export default function ListaMensagensPage() {
  const router = useRouter();
  const [mensagens, setMensagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('todas');
  const [catalogoFilter, setCatalogoFilter] = useState('');
  const [catalogos, setCatalogos] = useState([]);

  useEffect(() => {
    async function fetchMensagens() {
      setLoading(true);
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
          data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
        );

        // coletar catálogos distintos para filtro
        const uniqueCatalogos = [
          ...new Map(
            data.map((m) => [m.catalogo_id, m.catalogo_nome]),
          ).entries(),
        ].map(([id, nome]) => ({ id, nome }));
        setCatalogos(uniqueCatalogos);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMensagens();
  }, [statusFilter, catalogoFilter]);

  // Count new messages
  const newMessagesCount = mensagens.filter((m) => m.status === 'nova').length;

  // Status filter tabs
  const statusTabs = [
    { value: 'todas', label: 'Todas', count: mensagens.length },
    { value: 'nova', label: 'Novas', count: newMessagesCount },
    {
      value: 'respondida',
      label: 'Respondidas',
      count: mensagens.length - newMessagesCount,
    },
  ];

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
                Mensagens
              </h1>
              {newMessagesCount > 0 && (
                <Badge variant='error' size='sm'>
                  {newMessagesCount} nova{newMessagesCount !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            <p className='text-[var(--color-gray-500)] ml-10'>
              Gerencie as mensagens recebidas dos lojistas
            </p>
          </div>
          <div className='flex items-center gap-2 px-4 py-2 bg-[var(--color-primary-50)] rounded-lg'>
            <MessageSquare
              size={18}
              className='text-[var(--color-primary-600)]'
            />
            <span className='text-sm font-medium text-[var(--color-primary-700)]'>
              {mensagens.length} mensagen{mensagens.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Filters Section */}
        <div className='flex flex-col sm:flex-row sm:items-end gap-4'>
          {/* Status Filter Tabs */}
          <div className='flex-1'>
            <div className='flex items-center gap-1 text-[var(--color-gray-500)] mb-2'>
              <Filter size={14} />
              <span className='text-xs font-medium uppercase tracking-wide'>
                Status
              </span>
            </div>
            <div className='flex gap-2 flex-wrap'>
              {statusTabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setStatusFilter(tab.value)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2
                    ${
                      statusFilter === tab.value
                        ? 'bg-[var(--color-primary-600)] text-white shadow-md'
                        : 'bg-[var(--color-gray-100)] text-[var(--color-gray-600)] hover:bg-[var(--color-gray-200)]'
                    }
                  `}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span
                      className={`
                      px-1.5 py-0.5 text-xs rounded-full
                      ${
                        statusFilter === tab.value
                          ? 'bg-white/20 text-white'
                          : 'bg-[var(--color-gray-200)] text-[var(--color-gray-600)]'
                      }
                    `}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Catalog Filter */}
          <div>
            <label className='text-xs font-medium text-[var(--color-gray-500)] uppercase tracking-wide block mb-2'>
              <FolderOpen size={14} className='inline mr-1' />
              Catálogo
            </label>
            <select
              value={catalogoFilter}
              onChange={(e) => setCatalogoFilter(e.target.value)}
              className='
                px-4 py-2 rounded-lg text-sm
                border border-[var(--color-gray-200)]
                bg-white text-[var(--color-gray-700)]
                focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/20
                focus:border-[var(--color-primary-500)]
                transition-all min-w-[180px]
              '
            >
              <option value=''>Todos os catálogos</option>
              {catalogos.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Messages Table */}
        <Card variant='default' padding={false}>
          <div className='overflow-x-auto'>
            <table className='w-full text-left'>
              <thead>
                <tr className='border-b border-[var(--color-gray-100)]'>
                  <th className='px-5 py-4 text-xs font-semibold text-[var(--color-gray-500)] uppercase tracking-wider'>
                    Lojista
                  </th>
                  <th className='px-5 py-4 text-xs font-semibold text-[var(--color-gray-500)] uppercase tracking-wider'>
                    Catálogo
                  </th>
                  <th className='px-5 py-4 text-xs font-semibold text-[var(--color-gray-500)] uppercase tracking-wider'>
                    Status
                  </th>
                  <th className='px-5 py-4 text-xs font-semibold text-[var(--color-gray-500)] uppercase tracking-wider'>
                    Recebida em
                  </th>
                  <th className='px-5 py-4 text-xs font-semibold text-[var(--color-gray-500)] uppercase tracking-wider'>
                    Ações
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
                          <Skeleton variant='text' width='120px' />
                        </div>
                      </td>
                      <td className='px-5 py-4'>
                        <Skeleton variant='text' width='150px' />
                      </td>
                      <td className='px-5 py-4'>
                        <Skeleton variant='text' width='80px' />
                      </td>
                      <td className='px-5 py-4'>
                        <Skeleton variant='text' width='120px' />
                      </td>
                      <td className='px-5 py-4'>
                        <Skeleton
                          variant='rectangular'
                          width='100px'
                          height='32px'
                          className='rounded-lg'
                        />
                      </td>
                    </tr>
                  ))
                ) : mensagens.length === 0 ? (
                  // Empty State
                  <tr>
                    <td colSpan={5} className='px-5 py-16 text-center'>
                      <div className='flex flex-col items-center gap-3'>
                        <div className='w-16 h-16 rounded-full bg-[var(--color-gray-100)] flex items-center justify-center'>
                          <MessageSquare
                            size={28}
                            className='text-[var(--color-gray-400)]'
                          />
                        </div>
                        <div>
                          <p className='font-medium text-[var(--color-gray-700)]'>
                            Nenhuma mensagem encontrada
                          </p>
                          <p className='text-sm text-[var(--color-gray-500)]'>
                            {statusFilter !== 'todas' || catalogoFilter
                              ? 'Tente ajustar os filtros aplicados'
                              : 'As mensagens aparecerão aqui quando forem recebidas'}
                          </p>
                        </div>
                        {(statusFilter !== 'todas' || catalogoFilter) && (
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => {
                              setStatusFilter('todas');
                              setCatalogoFilter('');
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
                  mensagens.map((msg) => (
                    <tr
                      key={msg.id}
                      className={`
                        hover:bg-[var(--color-gray-50)] transition-colors group
                        ${msg.status === 'nova' ? 'bg-[var(--color-primary-50)]/30' : ''}
                      `}
                    >
                      {/* Lojista */}
                      <td className='px-5 py-4'>
                        <div className='flex items-center gap-3'>
                          <Avatar name={msg.lojista_nome} size='sm' />
                          <div>
                            <p
                              className={`text-[var(--color-gray-900)] ${msg.status === 'nova' ? 'font-semibold' : ''}`}
                            >
                              {msg.lojista_nome}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Catálogo */}
                      <td className='px-5 py-4'>
                        <p className='text-[var(--color-gray-700)]'>
                          {msg.catalogo_nome}
                        </p>
                      </td>

                      {/* Status */}
                      <td className='px-5 py-4'>
                        {msg.status === 'nova' ? (
                          <Badge variant='error' size='sm' dot>
                            <Mail size={12} className='mr-1' />
                            Nova
                          </Badge>
                        ) : (
                          <Badge variant='success' size='sm' dot>
                            <MailOpen size={12} className='mr-1' />
                            Respondida
                          </Badge>
                        )}
                      </td>

                      {/* Recebida em */}
                      <td className='px-5 py-4'>
                        <div className='flex items-center gap-1.5 text-[var(--color-gray-600)]'>
                          <Clock
                            size={14}
                            className='text-[var(--color-gray-400)]'
                          />
                          <span className='text-sm'>
                            {new Date(msg.created_at).toLocaleString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </td>

                      {/* Ações */}
                      <td className='px-5 py-4'>
                        <Button
                          size='sm'
                          variant={
                            msg.status === 'nova' ? 'primary' : 'secondary'
                          }
                          icon={Eye}
                          onClick={() =>
                            router.push(`/dashboard/admin/mensagens/${msg.id}`)
                          }
                        >
                          Ver detalhes
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminGuard>
  );
}
