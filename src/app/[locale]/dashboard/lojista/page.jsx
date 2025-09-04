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
      nome: 'Canadá',
      x: '20%',
      y: '24%',
      href: '/dashboard/lojista/vitrines/principal?pais=Canadá',
    },
    {
      nome: 'Nova York',
      x: '27.5%',
      y: '33%',
      href: '/dashboard/lojista/vitrines/principal?pais=EUA',
    },
    {
      nome: 'Miami',
      x: '26.5%',
      y: '43.5%',
      href: '/dashboard/lojista/vitrines/principal?pais=EUA',
    },
    {
      nome: 'México',
      x: '22%',
      y: '48%',
      href: '/dashboard/lojista/vitrines/principal?pais=México',
    },
    {
      nome: 'Buenos Aires',
      x: '31.5%',
      y: '80%',
      href: '/dashboard/lojista/vitrines/principal?pais=Argentina',
    },
    {
      nome: 'São Paulo',
      x: '34%',
      y: '74%',
      href: '/dashboard/lojista/vitrines/principal?pais=Brasil',
    },
    {
      nome: 'Casablanca',
      x: '43.8%',
      y: '39%',
      href: '/dashboard/lojista/vitrines/principal?pais=Marrocos',
    },
    {
      nome: 'Milão',
      x: '48%',
      y: '30%',
      href: '/dashboard/lojista/vitrines/principal?pais=Itália',
    },
    {
      nome: 'Cairo',
      x: '52.8%',
      y: '41%',
      href: '/dashboard/lojista/vitrines/principal?pais=Egito',
    },
    {
      nome: 'Johannesburg',
      x: '52%',
      y: '72.9%',
      href: '/dashboard/lojista/vitrines/principal?pais=África%20do%20Sul',
    },
    {
      nome: 'New Delphi',
      x: '63.5%',
      y: '43%',
      href: '/dashboard/lojista/vitrines/principal?pais=Índia',
    },
    {
      nome: 'Bangladesh',
      x: '66.7%',
      y: '45%',
      href: '/dashboard/lojista/vitrines/principal?pais=Bangladesh',
    },
    {
      nome: 'Wenzhou',
      x: '73.5%',
      y: '42%',
      href: '/dashboard/lojista/vitrines/principal?pais=China',
    },
    {
      nome: 'Guangzhou',
      x: '72%',
      y: '45%',
      href: '/dashboard/lojista/vitrines/principal?pais=China',
    },
    {
      nome: 'Austrália',
      x: '78%',
      y: '82%',
      href: '/dashboard/lojista/vitrines/principal?pais=Autrália',
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
