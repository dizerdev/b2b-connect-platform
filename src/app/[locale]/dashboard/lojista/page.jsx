'use client';

import { useEffect, useState } from 'react';
import SellerGuard from 'components/SellerGuard';
import MapaMundi from 'components/MapaMundi';
import Section from 'components/shared/Section';

export default function DashboardLojista() {
  const [topCalcados, setTopCalcados] = useState([]);
  const [topAcessorios, setTopAcessorios] = useState([]);
  const [topMaquinas, setTopMaquinas] = useState([]);
  const [topCouros, setTopCouros] = useState([]);

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

  useEffect(() => {
    fetchCatalogos('?categoria=Calçados', setTopCalcados);
    fetchCatalogos('?categoria=Acessórios', setTopAcessorios);
    fetchCatalogos('?categoria=Máquinas', setTopMaquinas);
    fetchCatalogos('?categoria=Couros', setTopCouros);
  }, []);

  async function fetchCatalogos(query = '', setter) {
    try {
      const res = await fetch(`/api/v1/vitrines/search${query}`, {
        cache: 'no-store',
      });
      if (!res.ok) throw new Error('Erro ao carregar catálogos');
      const data = await res.json();
      setter(data.catalogos);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <SellerGuard>
      <div className='min-h-[30vh] flex flex-col'>
        <MapaMundi parceiros={parceiros} />
      </div>
      {/* SECTIONS FIXAS */}
      <Section
        title='Top Calçados'
        data={topCalcados}
        filter={'categoria=Calçados'}
      />
      <Section
        title='Top Acessórios'
        data={topAcessorios}
        filter={'categoria=Acessórios'}
      />
      <Section
        title='Top Máquinas'
        data={topMaquinas}
        filter={'categoria=Máquinas'}
      />
      <Section
        title='Top Couros'
        data={topCouros}
        filter={'categoria=Couros'}
      />
    </SellerGuard>
  );
}
