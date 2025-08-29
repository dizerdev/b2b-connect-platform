'use client';

import Link from 'next/link';
import PartnerGuard from 'components/PartnerGuard';

export default function DashboardParceiro() {
  return (
    <PartnerGuard>
      <div className='min-h-screen flex flex-col'>
        <nav className='bg-gray-800 text-white p-4'>
          <ul className='flex space-x-6'>
            <li>
              <Link href='/dashboard/parceiro' className='hover:underline'>
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href='/dashboard/parceiro/catalogos'
                className='hover:underline'
              >
                Catalogos
              </Link>
            </li>
            <li>
              <Link
                href='/dashboard/parceiro/produtos'
                className='hover:underline'
              >
                Produtos
              </Link>
            </li>
          </ul>
        </nav>

        <main className='flex-1 p-6'>Dashboard Parceiro</main>
      </div>
    </PartnerGuard>
  );
}
