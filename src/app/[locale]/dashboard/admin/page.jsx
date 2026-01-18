'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  Users,
  Package,
  FolderCheck,
  FolderClock,
  FolderOpen,
  MessageSquare,
  ArrowRight,
  Shield,
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  UserPlus,
} from 'lucide-react';
import { MetricCard } from 'components/charts';
import { Card, Badge, Avatar, Skeleton, Button } from 'components/ui';

export default function DashboardAdmin() {
  const t = useTranslations('DashboardAdmin');

  const [data, setData] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [pendingCatalogs, setPendingCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const [reportsRes, usersRes, catalogsRes] = await Promise.all([
          fetch('/api/v1/reports/admin', { cache: 'no-store' }),
          fetch('/api/v1/usuarios', { cache: 'no-store' }),
          fetch('/api/v1/catalogos', { cache: 'no-store' }),
        ]);

        if (reportsRes.ok) {
          const reportsData = await reportsRes.json();
          setData(reportsData);
        }

        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setRecentUsers((usersData.usuarios || []).slice(0, 5));
        }

        if (catalogsRes.ok) {
          const catalogsData = await catalogsRes.json();
          const pending = (catalogsData.catalogos || [])
            .filter(c => c.status === 'pendente_aprovacao')
            .slice(0, 5);
          setPendingCatalogs(pending);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  // Sample sparkline data
  const sparklineData = {
    users: [5, 6, 5, 7, 8, 7, 8, 9, 8, 10],
    products: [120, 135, 142, 155, 163, 170, 182, 195, 205, 218],
    catalogs: [15, 16, 18, 19, 22, 25, 28, 30, 32, 35],
    messages: [8, 12, 10, 15, 18, 14, 20, 22, 19, 25],
  };

  const roleLabels = {
    administrador: { label: 'Admin', color: 'error' },
    fornecedor: { label: 'Fornecedor', color: 'primary' },
    representante: { label: 'Representante', color: 'info' },
    lojista: { label: 'Lojista', color: 'success' },
  };

  // Recent activities (mock data - in production would come from logs)
  const recentActivities = [
    { icon: UserPlus, text: 'Novo usuário registrado: Fernanda Fashion', time: '5 min atrás', color: 'text-emerald-600' },
    { icon: FolderCheck, text: 'Catálogo "Tênis Premium" aprovado', time: '23 min atrás', color: 'text-blue-600' },
    { icon: MessageSquare, text: 'Nova mensagem de lojista', time: '1 hora atrás', color: 'text-amber-600' },
    { icon: AlertCircle, text: 'Catálogo pendente há mais de 7 dias', time: '2 horas atrás', color: 'text-rose-600' },
    { icon: CheckCircle2, text: 'Catálogo "Botas Inverno" publicado', time: '3 horas atrás', color: 'text-emerald-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-[var(--color-gray-900)]">
            {t('DashboardTitle')}
          </h1>
          <p className="text-[var(--color-gray-500)] mt-1">
            Visão geral do sistema e ações pendentes
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary-50)] rounded-lg">
          <Shield size={18} className="text-[var(--color-primary-600)]" />
          <span className="text-sm font-medium text-[var(--color-primary-700)]">
            Painel Administrativo
          </span>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-[var(--color-error-bg)] border border-[var(--color-accent-rose)]/20 rounded-lg text-[var(--color-accent-rose)]">
          {t('ErrorLoadingReports')}
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title={t('ActiveUsers')}
          value={data?.relatorios?.usuarios_ativos ?? 0}
          icon={Users}
          trend={15}
          sparklineData={sparklineData.users}
          color="emerald"
          loading={loading}
        />
        <MetricCard
          title={t('RegisteredProducts')}
          value={data?.relatorios?.produtos_cadastrados ?? 0}
          icon={Package}
          trend={8}
          sparklineData={sparklineData.products}
          color="blue"
          loading={loading}
        />
        <MetricCard
          title={t('ActiveCatalogs')}
          value={data?.relatorios?.catalogos_publicados ?? 0}
          icon={FolderCheck}
          trend={12}
          sparklineData={sparklineData.catalogs}
          color="primary"
          loading={loading}
        />
        <MetricCard
          title={t('PendingApproval')}
          value={data?.relatorios?.catalogos_pendentes_aprovacao ?? 0}
          icon={FolderClock}
          color="amber"
          loading={loading}
        />
        <MetricCard
          title={t('PendingPublication')}
          value={data?.relatorios?.catalogos_pendentes_publicacao ?? 0}
          icon={FolderOpen}
          color="rose"
          loading={loading}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Users */}
        <Card variant="default" padding={false} className="lg:col-span-1">
          <div className="p-5 border-b border-[var(--color-gray-100)]">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-[var(--color-gray-900)]">
                Usuários Recentes
              </h2>
              <Link
                href="/dashboard/admin/usuarios"
                className="text-sm text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] flex items-center gap-1"
              >
                Ver todos
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="divide-y divide-[var(--color-gray-100)]">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-4 flex items-center gap-3">
                  <Skeleton variant="circular" width="40px" />
                  <div className="flex-1 space-y-2">
                    <Skeleton variant="text" width="70%" />
                    <Skeleton variant="text" width="50%" />
                  </div>
                </div>
              ))
            ) : recentUsers.length > 0 ? (
              recentUsers.map((user) => (
                <Link
                  key={user.id}
                  href={`/dashboard/admin/usuarios/${user.id}/editar`}
                  className="flex items-center gap-3 p-4 hover:bg-[var(--color-gray-50)] transition-colors"
                >
                  <Avatar
                    name={user.nome}
                    size="sm"
                    status={user.ativo ? 'online' : 'offline'}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[var(--color-gray-900)] truncate">
                      {user.nome}
                    </p>
                    <p className="text-sm text-[var(--color-gray-500)] truncate">
                      {user.email}
                    </p>
                  </div>
                  <Badge
                    variant={roleLabels[user.papel]?.color || 'default'}
                    size="sm"
                  >
                    {roleLabels[user.papel]?.label || user.papel}
                  </Badge>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center text-[var(--color-gray-500)]">
                Nenhum usuário encontrado
              </div>
            )}
          </div>
        </Card>

        {/* Pending Catalogs */}
        <Card variant="default" padding={false} className="lg:col-span-1">
          <div className="p-5 border-b border-[var(--color-gray-100)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-[var(--color-gray-900)]">
                  Aguardando Aprovação
                </h2>
                {pendingCatalogs.length > 0 && (
                  <Badge variant="warning" size="sm">
                    {pendingCatalogs.length}
                  </Badge>
                )}
              </div>
              <Link
                href="/dashboard/admin/catalogos?status=pendente_aprovacao"
                className="text-sm text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] flex items-center gap-1"
              >
                Ver todos
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="divide-y divide-[var(--color-gray-100)]">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4">
                  <Skeleton.TableRow columns={3} />
                </div>
              ))
            ) : pendingCatalogs.length > 0 ? (
              pendingCatalogs.map((catalog) => (
                <Link
                  key={catalog.id}
                  href={`/dashboard/admin/catalogos/${catalog.id}`}
                  className="flex items-center gap-3 p-4 hover:bg-[var(--color-gray-50)] transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-[var(--color-gray-100)] flex-shrink-0">
                    {catalog.imagem_url ? (
                      <img
                        src={catalog.imagem_url}
                        alt={catalog.nome}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[var(--color-gray-400)]">
                        <FolderClock size={18} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[var(--color-gray-900)] truncate">
                      {catalog.nome}
                    </p>
                    <p className="text-xs text-[var(--color-gray-500)] flex items-center gap-1">
                      <Clock size={10} />
                      {new Date(catalog.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Revisar
                  </Button>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center">
                <CheckCircle2 size={32} className="mx-auto text-[var(--color-accent-emerald)] mb-2" />
                <p className="text-[var(--color-gray-600)] font-medium">Tudo em dia!</p>
                <p className="text-sm text-[var(--color-gray-500)]">
                  Nenhum catálogo pendente
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card variant="default" padding={false} className="lg:col-span-1">
          <div className="p-5 border-b border-[var(--color-gray-100)]">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-[var(--color-gray-500)]" />
              <h2 className="font-semibold text-[var(--color-gray-900)]">
                Atividade Recente
              </h2>
            </div>
          </div>

          <div className="divide-y divide-[var(--color-gray-100)]">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-4">
                <div className={`mt-0.5 ${activity.color}`}>
                  <activity.icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--color-gray-700)]">
                    {activity.text}
                  </p>
                  <p className="text-xs text-[var(--color-gray-400)] mt-0.5">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--color-gray-900)] mb-4">
          {t('Shortcuts')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/dashboard/admin/usuarios" className="group">
            <Card clickable className="hover:border-blue-200 hover:bg-blue-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--color-gray-900)]">
                    {t('ManageUsers')}
                  </h3>
                  <p className="text-sm text-[var(--color-gray-500)]">
                    {t('ManageUsersDesc')}
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/admin/catalogos" className="group">
            <Card clickable className="hover:border-emerald-200 hover:bg-emerald-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                  <FolderCheck size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--color-gray-900)]">
                    {t('ManageCatalogs')}
                  </h3>
                  <p className="text-sm text-[var(--color-gray-500)]">
                    {t('ManageCatalogsDesc')}
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/admin/mensagens" className="group">
            <Card clickable className="hover:border-amber-200 hover:bg-amber-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--color-gray-900)]">
                    {t('Messages')}
                  </h3>
                  <p className="text-sm text-[var(--color-gray-500)]">
                    {t('MessagesDesc')}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
