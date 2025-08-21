'use client';

import Link from 'next/link';
import SellerGuard from 'components/SellerGuard';
import MapaMundi from 'components/MapaMundi';

export default function DashboardParceiro() {
  const parceiros = [
    {
      nome: 'Brasil',
      x: '36%',
      y: '73%',
      href: '/dashboard/lojista/vitrines/principal?pais=Brasil',
    },
    {
      nome: 'EUA',
      x: '28%',
      y: '42%',
      href: '/dashboard/lojista/vitrines/principal?pais=eua',
    },
    {
      nome: 'Portugal',
      x: '50%',
      y: '40%',
      href: '/dashboard/lojista/vitrines/principal?pais=portugal',
    },
    {
      nome: 'China',
      x: '72%',
      y: '48%',
      href: '/dashboard/lojista/vitrines/principal?pais=china',
    },
  ];
  return (
    <SellerGuard>
      <div className='min-h-screen flex flex-col'>
        <nav className='bg-gray-800 text-white p-4'>
          <ul className='flex space-x-6'>
            <li>
              <Link href='/dashboard/lojista' className='hover:underline'>
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href='/dashboard/lojista/vitrines/principal'
                className='hover:underline'
              >
                Catalogos
              </Link>
            </li>
            <li>
              <Link
                href='/dashboard/lojista/produtos'
                className='hover:underline'
              >
                Produtos
              </Link>
            </li>
          </ul>
        </nav>

        <main className='flex-1 p-6'>
          <MapaMundi parceiros={parceiros} />
        </main>
      </div>
    </SellerGuard>
  );
}
