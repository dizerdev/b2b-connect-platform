'use client';

import Link from 'next/link';
import SellerGuard from 'components/SellerGuard';
import MapaMundi from 'components/MapaMundi';

export default function DashboardLojista() {
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
      href: '/dashboard/lojista/vitrines/principal?pais=Portugal',
    },
    {
      nome: 'China',
      x: '72%',
      y: '48%',
      href: '/dashboard/lojista/vitrines/principal?pais=China',
    },
  ];
  return (
    <SellerGuard>
      <div className='min-h-[30vh] flex flex-col'>
        <MapaMundi parceiros={parceiros} />
      </div>
    </SellerGuard>
  );
}
