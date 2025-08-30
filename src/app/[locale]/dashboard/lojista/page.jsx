'use client';

import SellerGuard from 'components/SellerGuard';
import MapaMundi from 'components/MapaMundi';
import Carousel from 'components/shared/Carrousel';

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

  const items = [
    {
      nome: 'Parceiro A',
      status: 'Ativo',
      rating: 4.5,
      criadoEm: '2025-08-01',
    },
    {
      nome: 'Parceiro B',
      status: 'Inativo',
      rating: 3.8,
      criadoEm: '2025-07-20',
    },
    {
      nome: 'Parceiro C',
      status: 'Ativo',
      rating: 5.0,
      criadoEm: '2025-06-15',
    },
    {
      nome: 'Parceiro C',
      status: 'Ativo',
      rating: 5.0,
      criadoEm: '2025-06-15',
    },
    {
      nome: 'Parceiro C',
      status: 'Ativo',
      rating: 5.0,
      criadoEm: '2025-06-15',
    },
    {
      nome: 'Parceiro C',
      status: 'Ativo',
      rating: 5.0,
      criadoEm: '2025-06-15',
    },
  ];
  return (
    <SellerGuard>
      <div className='min-h-[70vh] flex flex-col bg-gray-50'>
        <main className='flex-1 flex items-center justify-center p-6'>
          <div className='w-full max-w-6xl'>
            <MapaMundi parceiros={parceiros} />
          </div>
        </main>
      </div>
      <Carousel items={items} />
    </SellerGuard>
  );
}
