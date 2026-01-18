'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Cookies from 'js-cookie';
import { Sidebar, Header } from 'components/layout';
import PartnerGuard from 'components/PartnerGuard';

export default function DashboardParceiroLayout({ children }) {
  const t = useTranslations('DashboardParceiro');
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState(null);

  // Fetch user data
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/v1/auth/me', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setUser(data.usuario);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }
    fetchUser();
  }, []);

  const handleLogout = async () => {
    if (!window.confirm(t('ConfirmLogout') || 'Deseja realmente sair?')) return;
    
    try {
      const token = Cookies.get('token');
      await fetch('/api/v1/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error(error);
    } finally {
      router.replace('/public/mapa');
    }
  };

  const sidebarItems = [
    {
      label: t('Dashboard'),
      href: '/dashboard/parceiro',
      icon: 'dashboard',
    },
    {
      label: t('Catalogs'),
      href: '/dashboard/parceiro/catalogos',
      icon: 'catalogs',
    },
    {
      label: t('Products'),
      href: '/dashboard/parceiro/produtos',
      icon: 'products',
    },
  ];

  return (
    <PartnerGuard>
      <div className="min-h-screen flex bg-[var(--background-secondary)]">
        {/* Sidebar */}
        <Sidebar
          title={t('Partner')}
          items={sidebarItems}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          {/* Header */}
          <Header
            user={user}
            onLogout={handleLogout}
          />

          {/* Page content */}
          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto animate-fade-in">
              {children}
            </div>
          </main>
        </div>
      </div>
    </PartnerGuard>
  );
}
