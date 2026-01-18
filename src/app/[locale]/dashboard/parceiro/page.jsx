'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  Package,
  FolderOpen,
  FolderCheck,
  FolderClock,
  MessageSquare,
  Plus,
  ArrowRight,
  Eye,
  TrendingUp,
} from 'lucide-react';
import { MetricCard } from 'components/charts';
import { Button, Card, Badge, Skeleton } from 'components/ui';

export default function DashboardParceiro() {
  const t = useTranslations('DashboardParceiro');
  const [stats, setStats] = useState(null);
  const [recentCatalogs, setRecentCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        // Fetch stats from API
        const [catalogsRes, productsRes] = await Promise.all([
          fetch('/api/v1/meus-catalogos', { cache: 'no-store' }),
          fetch('/api/v1/meus-produtos', { cache: 'no-store' }),
        ]);

        const catalogsData = catalogsRes.ok ? await catalogsRes.json() : { catalogos: [] };
        const productsData = productsRes.ok ? await productsRes.json() : { produtos: [] };

        // Calculate stats
        const catalogs = catalogsData.catalogos || [];
        const products = productsData.produtos || [];

        setStats({
          totalProducts: products.length,
          activeCatalogs: catalogs.filter(c => c.status === 'publicado').length,
          pendingApproval: catalogs.filter(c => c.status === 'pendente_aprovacao').length,
          pendingPublication: catalogs.filter(c => c.status === 'aprovado').length,
        });

        // Get recent catalogs
        setRecentCatalogs(catalogs.slice(0, 5));
      } catch (error) {
        console.error('Error loading dashboard:', error);
        setStats({
          totalProducts: 0,
          activeCatalogs: 0,
          pendingApproval: 0,
          pendingPublication: 0,
        });
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  // Sample sparkline data (in production, this would come from analytics)
  const sparklineData = {
    products: [12, 19, 23, 25, 32, 38, 42, 45, 52, 58],
    catalogs: [2, 3, 3, 4, 5, 5, 6, 6, 7, 7],
    views: [45, 52, 48, 61, 55, 67, 72, 68, 75, 82],
    messages: [3, 5, 4, 6, 8, 7, 9, 8, 10, 12],
  };

  const statusColors = {
    publicado: 'success',
    aprovado: 'info',
    pendente_aprovacao: 'warning',
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-[var(--color-gray-900)]">
            {t('DashboardTitle')}
          </h1>
          <p className="text-[var(--color-gray-500)] mt-1">
            Bem-vindo de volta! Aqui está um resumo da sua conta.
          </p>
        </div>
        <Link href="/dashboard/parceiro/catalogos/novo">
          <Button icon={Plus}>
            Novo Catálogo
          </Button>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title={t('RegisteredProducts')}
          value={stats?.totalProducts ?? 0}
          icon={Package}
          trend={12}
          trendLabel="vs. mês anterior"
          sparklineData={sparklineData.products}
          color="blue"
          loading={loading}
        />
        <MetricCard
          title={t('ActiveCatalogs')}
          value={stats?.activeCatalogs ?? 0}
          icon={FolderCheck}
          trend={8}
          trendLabel="vs. mês anterior"
          sparklineData={sparklineData.catalogs}
          color="emerald"
          loading={loading}
        />
        <MetricCard
          title={t('PendingApproval')}
          value={stats?.pendingApproval ?? 0}
          icon={FolderClock}
          sparklineData={null}
          color="amber"
          loading={loading}
        />
        <MetricCard
          title={t('PendingPublication')}
          value={stats?.pendingPublication ?? 0}
          icon={FolderOpen}
          sparklineData={null}
          color="rose"
          loading={loading}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MetricCard
          title="Visualizações este mês"
          value={1247}
          icon={Eye}
          trend={23}
          trendLabel="vs. mês anterior"
          sparklineData={sparklineData.views}
          color="primary"
          loading={loading}
        />
        <MetricCard
          title="Mensagens recebidas"
          value={12}
          icon={MessageSquare}
          trend={5}
          trendLabel="vs. mês anterior"
          sparklineData={sparklineData.messages}
          color="blue"
          loading={loading}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Catalogs */}
        <div className="lg:col-span-2">
          <Card variant="default" padding={false} className="overflow-hidden">
            <div className="p-5 border-b border-[var(--color-gray-100)]">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-[var(--color-gray-900)]">
                  Catálogos Recentes
                </h2>
                <Link
                  href="/dashboard/parceiro/catalogos"
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
                    <Skeleton.TableRow columns={4} />
                  </div>
                ))
              ) : recentCatalogs.length > 0 ? (
                recentCatalogs.map((catalog) => (
                  <Link
                    key={catalog.id}
                    href={`/dashboard/parceiro/catalogos/${catalog.id}`}
                    className="flex items-center gap-4 p-4 hover:bg-[var(--color-gray-50)] transition-colors"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-[var(--color-gray-100)] flex-shrink-0">
                      {catalog.imagem_url ? (
                        <img
                          src={catalog.imagem_url}
                          alt={catalog.nome}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--color-gray-400)]">
                          <FolderOpen size={20} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[var(--color-gray-900)] truncate">
                        {catalog.nome}
                      </p>
                      <p className="text-sm text-[var(--color-gray-500)]">
                        {new Date(catalog.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <Badge variant={statusColors[catalog.status]} size="sm" dot>
                      {catalog.status === 'publicado' ? 'Publicado' : 
                       catalog.status === 'aprovado' ? 'Aprovado' : 'Pendente'}
                    </Badge>
                  </Link>
                ))
              ) : (
                <div className="p-8 text-center text-[var(--color-gray-500)]">
                  Nenhum catálogo encontrado
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card>
            <h2 className="font-semibold text-[var(--color-gray-900)] mb-4">
              {t('Shortcuts')}
            </h2>
            <div className="space-y-3">
              <Link href="/dashboard/parceiro/catalogos" className="block">
                <div className="
                  flex items-center gap-3 p-3
                  rounded-lg
                  bg-[var(--color-gray-50)]
                  hover:bg-[var(--color-primary-50)]
                  border border-transparent
                  hover:border-[var(--color-primary-200)]
                  transition-all
                  group
                ">
                  <div className="
                    w-10 h-10
                    flex items-center justify-center
                    rounded-lg
                    bg-[var(--color-primary-100)]
                    text-[var(--color-primary-600)]
                    group-hover:bg-[var(--color-primary-200)]
                    transition-colors
                  ">
                    <FolderOpen size={18} />
                  </div>
                  <div>
                    <p className="font-medium text-[var(--color-gray-900)]">
                      {t('ManageCatalogs')}
                    </p>
                    <p className="text-xs text-[var(--color-gray-500)]">
                      {t('ManageCatalogsDesc')}
                    </p>
                  </div>
                </div>
              </Link>

              <Link href="/dashboard/parceiro/produtos" className="block">
                <div className="
                  flex items-center gap-3 p-3
                  rounded-lg
                  bg-[var(--color-gray-50)]
                  hover:bg-[var(--color-primary-50)]
                  border border-transparent
                  hover:border-[var(--color-primary-200)]
                  transition-all
                  group
                ">
                  <div className="
                    w-10 h-10
                    flex items-center justify-center
                    rounded-lg
                    bg-blue-100
                    text-blue-600
                    group-hover:bg-blue-200
                    transition-colors
                  ">
                    <Package size={18} />
                  </div>
                  <div>
                    <p className="font-medium text-[var(--color-gray-900)]">
                      {t('ManageProducts')}
                    </p>
                    <p className="text-xs text-[var(--color-gray-500)]">
                      {t('ManageProductsDesc')}
                    </p>
                  </div>
                </div>
              </Link>

              <Link href="/dashboard/parceiro/mensagens" className="block">
                <div className="
                  flex items-center gap-3 p-3
                  rounded-lg
                  bg-[var(--color-gray-50)]
                  hover:bg-[var(--color-primary-50)]
                  border border-transparent
                  hover:border-[var(--color-primary-200)]
                  transition-all
                  group
                ">
                  <div className="
                    w-10 h-10
                    flex items-center justify-center
                    rounded-lg
                    bg-emerald-100
                    text-emerald-600
                    group-hover:bg-emerald-200
                    transition-colors
                  ">
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <p className="font-medium text-[var(--color-gray-900)]">
                      Mensagens
                    </p>
                    <p className="text-xs text-[var(--color-gray-500)]">
                      Ver mensagens de lojistas
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </Card>

          {/* Performance Card */}
          <Card className="bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-700)] text-white border-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <TrendingUp size={20} />
              </div>
              <div>
                <p className="text-white/80 text-sm">Performance</p>
                <p className="font-bold text-lg">Excelente!</p>
              </div>
            </div>
            <p className="text-white/90 text-sm">
              Seus catálogos receberam 23% mais visualizações este mês. Continue assim!
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
