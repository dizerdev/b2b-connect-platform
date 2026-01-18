'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  FolderOpen,
  Package,
  Users,
  MessageSquare,
  Settings,
  HelpCircle,
} from 'lucide-react';

/**
 * Sidebar Component - Premium Design
 * 
 * Features:
 * - Collapsible with smooth animation
 * - Active state indication
 * - Hover effects
 * - Mobile responsive
 * - Icon-only mode
 */

const iconMap = {
  dashboard: LayoutDashboard,
  catalogs: FolderOpen,
  products: Package,
  users: Users,
  messages: MessageSquare,
  settings: Settings,
  help: HelpCircle,
};

export default function Sidebar({
  title,
  items = [],
  collapsed,
  onToggle,
  className = '',
}) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isCollapsed = collapsed ?? false;

  const isActive = (href) => {
    if (href === pathname) return true;
    // Check if current path starts with href (for nested routes)
    if (href !== '/' && pathname.startsWith(href)) return true;
    return false;
  };

  const sidebarContent = (
    <>
      {/* Sidebar Header */}
      <div className={`
        flex items-center justify-between
        p-4 border-b border-white/10
        ${isCollapsed ? 'justify-center' : ''}
      `}>
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-primary-400)] to-[var(--color-primary-600)] flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-semibold text-white">{title}</span>
          </div>
        )}
        
        {!isMobile && (
          <button
            onClick={onToggle}
            className={`
              p-2 rounded-lg
              text-white/60 hover:text-white hover:bg-white/10
              transition-colors
              ${isCollapsed ? '' : 'ml-auto'}
            `}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {items.map((item, index) => {
            const Icon = iconMap[item.icon] || LayoutDashboard;
            const active = isActive(item.href);

            return (
              <li key={index}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3
                    px-3 py-2.5
                    rounded-lg
                    font-medium text-sm
                    transition-all duration-200
                    group
                    ${active 
                      ? 'bg-white/15 text-white' 
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }
                    ${isCollapsed ? 'justify-center' : ''}
                  `}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon 
                    size={20} 
                    className={`
                      flex-shrink-0
                      transition-transform
                      ${active ? 'text-[var(--color-primary-300)]' : ''}
                      ${!isCollapsed ? 'group-hover:scale-110' : ''}
                    `}
                  />
                  {!isCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                  {active && !isCollapsed && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-primary-400)]" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer - collapsed info */}
      {isCollapsed && (
        <div className="p-4 border-t border-white/10">
          <button
            onClick={onToggle}
            className="w-full p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ChevronRight size={18} className="mx-auto" />
          </button>
        </div>
      )}
    </>
  );

  // Mobile: Drawer
  if (isMobile) {
    return (
      <>
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed left-4 top-4 z-40 p-2 rounded-lg bg-[var(--color-gray-800)] text-white shadow-lg md:hidden"
        >
          <Menu size={20} />
        </button>

        {/* Backdrop */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <aside
          className={`
            fixed top-0 left-0 z-50
            w-64 h-full
            bg-gradient-to-b from-[var(--color-gray-800)] to-[var(--color-gray-900)]
            transform transition-transform duration-300
            md:hidden
            ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-lg text-white/60 hover:text-white"
          >
            <X size={20} />
          </button>
          {sidebarContent}
        </aside>
      </>
    );
  }

  // Desktop: Fixed sidebar
  return (
    <aside
      className={`
        flex-shrink-0
        h-screen sticky top-0
        bg-gradient-to-b from-[var(--color-gray-800)] to-[var(--color-gray-900)]
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-16' : 'w-64'}
        ${className}
      `}
    >
      <div className="h-full flex flex-col">
        {sidebarContent}
      </div>
    </aside>
  );
}
