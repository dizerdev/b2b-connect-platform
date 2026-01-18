'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Footprints, Hammer, Sparkles, Scissors } from 'lucide-react';
import SellerGuard from 'components/SellerGuard';
import MapaMundi from 'components/MapaMundi';
import Section from 'components/shared/Section';
import Skeleton from 'components/ui/Skeleton';

export default function DashboardLojista() {
  const t = useTranslations('DashboardLojista');
  const [topCalcados, setTopCalcados] = useState([]);
  const [topAcessorios, setTopAcessorios] = useState([]);
  const [topMaquinas, setTopMaquinas] = useState([]);
  const [topCouros, setTopCouros] = useState([]);
  const [loading, setLoading] = useState(true);

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
      nome: 'New Delhi',
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
      href: '/dashboard/lojista/vitrines/principal?pais=Austrália',
    },
  ];

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      await Promise.all([
        fetchCatalogos('?categoria=Calçados', setTopCalcados),
        fetchCatalogos('?categoria=Acessórios', setTopAcessorios),
        fetchCatalogos('?categoria=Máquinas', setTopMaquinas),
        fetchCatalogos('?categoria=Couros', setTopCouros),
      ]);
      setLoading(false);
    }
    loadData();
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
      setter([]);
    }
  }

  return (
    <SellerGuard>
      <div className='min-h-screen'>
        {/* Hero Section with Map */}
        <section className='relative py-6'>
          {/* Background gradient */}
          <div
            className='
            absolute inset-0
            bg-gradient-to-b from-[var(--color-primary-50)] via-transparent to-transparent
            pointer-events-none
            -z-10
          '
          />

          {/* Header text */}
          <div className='text-center mb-8'>
            <h1
              className='
              text-3xl md:text-4xl font-heading font-bold
              text-[var(--color-gray-900)]
              mb-2
            '
            >
              Explore o Mercado Global
            </h1>
          </div>

          {/* Map */}
          <MapaMundi parceiros={parceiros} />
        </section>

        {/* Category Sections */}
        <div className='max-w-7xl mx-auto px-4 pb-12'>
          <Section
            title={t('TopFootwear')}
            icon={<Footprints size={20} />}
            data={topCalcados}
            filter='categoria=Calçados'
            loading={loading}
          />

          <Section
            title={t('TopAccessories')}
            icon={<Sparkles size={20} />}
            data={topAcessorios}
            filter='categoria=Acessórios'
            loading={loading}
          />

          <Section
            title={t('TopMachines')}
            icon={<Hammer size={20} />}
            data={topMaquinas}
            filter='categoria=Máquinas'
            loading={loading}
          />

          <Section
            title={t('TopLeathers')}
            icon={<Scissors size={20} />}
            data={topCouros}
            filter='categoria=Couros'
            loading={loading}
          />
        </div>
      </div>
    </SellerGuard>
  );
}
