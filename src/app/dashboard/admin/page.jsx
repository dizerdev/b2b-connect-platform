'use client';

import AdminGuard from 'components/AdminGuard';
import Link from 'next/link';

export default function DashboardAdmin() {
  return (
    <AdminGuard>
      <div className='min-h-screen flex flex-col'>
        <nav className='bg-gray-800 text-white p-4'>
          <ul className='flex space-x-6'>
            <li>
              <Link href='/dashboard/admin' className='hover:underline'>
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href='/dashboard/admin/usuarios'
                className='hover:underline'
              >
                Usuários
              </Link>
            </li>
            <li>
              <Link
                href='/dashboard/admin/catalogos'
                className='hover:underline'
              >
                Catalogos
              </Link>
            </li>
            <li>
              <Link
                href='/dashboard/admin/mensagens'
                className='hover:underline'
              >
                Mensagens
              </Link>
            </li>
          </ul>
        </nav>

        <main className='flex-1 p-6'>Dashboard Admin</main>
      </div>
    </AdminGuard>
  );
}
