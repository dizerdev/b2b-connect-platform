'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Users, Package, FolderClock, FolderOpen } from 'lucide-react';
import LogoutButton from 'components/ui/auth/LogoutButton';
import Image from 'next/image';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className='min-h-screen flex flex-col'>
      <header className='bg-white shadow p-4 flex justify-between items-center'>
        <div className='flex items-center'>
          <Image
            src='/assets/logos/shoesnetworld.png'
            width={50}
            height={50}
            alt='Shoesnetworld Logo'
          />
          <h1 className='text-lg font-bold pl-5'>Shoesnetworld</h1>
        </div>
        <LogoutButton />
      </header>
      <div className='min-h-screen flex bg-gray-100'>
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? 'w-64' : 'w-16'
          } bg-gray-800 text-white transition-all duration-300 flex flex-col`}
        >
          {/* Header sidebar */}
          <div className='flex items-center justify-between p-4'>
            {sidebarOpen && <span className='text-lg font-bold'>Admin</span>}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className='p-2 rounded hover:bg-gray-700'
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Menu */}
          <nav className='flex-1'>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/dashboard/admin'
                  className='flex items-center gap-3 px-4 py-2 hover:bg-gray-700'
                >
                  <Package size={20} />
                  {sidebarOpen && 'Dashboard'}
                </Link>
              </li>
              <li>
                <Link
                  href='/dashboard/admin/usuarios'
                  className='flex items-center gap-3 px-4 py-2 hover:bg-gray-700'
                >
                  <Users size={20} />
                  {sidebarOpen && 'Usuários'}
                </Link>
              </li>
              <li>
                <Link
                  href='/dashboard/admin/catalogos'
                  className='flex items-center gap-3 px-4 py-2 hover:bg-gray-700'
                >
                  <FolderOpen size={20} />
                  {sidebarOpen && 'Catálogos'}
                </Link>
              </li>
              <li>
                <Link
                  href='/dashboard/admin/mensagens'
                  className='flex items-center gap-3 px-4 py-2 hover:bg-gray-700'
                >
                  <FolderClock size={20} />
                  {sidebarOpen && 'Mensagens'}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <main className='flex-1 p-6'>{children}</main>
      </div>
    </div>
  );
}
