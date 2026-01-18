'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import SellerGuard from 'components/SellerGuard';
import Banner from 'components/shared/Banner';
import Section from 'components/shared/Section';
import Link from 'next/link';
import Dropdown from 'components/shared/Dropdown';
import { useRouter } from 'next/navigation';
import { Card, Badge, EmptyState } from 'components/ui';
import { FavoriteButton } from 'components/ui';
import { Star, MapPin, Building2, Eye } from 'lucide-react';

export default function VitrinePrincipalPage() {
  const t = useTranslations('LojistaVitrines');
  const tLojista = useTranslations('DashboardLojista');
  const searchParams = useSearchParams();
  const paisParam = searchParams.get('pais') || '';
  const categoriaParam = searchParams.get('categoria') || '';
  const [catalogos, setCatalogos] = useState([]);
  const router = useRouter();

  const [topCalcados, setTopCalcados] = useState([]);
  const [topAcessorios, setTopAcessorios] = useState([]);
  const [topMaquinas, setTopMaquinas] = useState([]);
  const [topCouros, setTopCouros] = useState([]);

  const [filtros, setFiltros] = useState({
    continente: '',
    pais: paisParam,
    categoria: categoriaParam,
    subcategoria: '',
    especificacao: '',
  });

  useEffect(() => {
    aplicarFiltros();
    aplicarFiltros();
    fetchCatalogos('?categoria=Calçados', setTopCalcados);
    fetchCatalogos('?categoria=Acessórios', setTopAcessorios);
    fetchCatalogos('?categoria=Máquinas', setTopMaquinas);
    fetchCatalogos('?categoria=Couros', setTopCouros);
  }, []);

  async function fetchCatalogos(query = '', setter = setCatalogos) {
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

  function aplicarFiltros(f = filtros) {
    const filtrosAtivos = Object.fromEntries(
      Object.entries(f).filter(([_, v]) => v),
    );
    const query = new URLSearchParams(filtrosAtivos).toString();
    fetchCatalogos(query ? `?${query}` : '');
  }

  function handleFiltroClick(name, value) {
    const novos = { ...filtros, [name]: value };
    setFiltros(novos);
    aplicarFiltros(novos);
  }

  function limparFiltros() {
    const vazios = {
      continente: '',
      pais: '',
      categoria: '',
      subcategoria: '',
      especificacao: '',
    };
    setFiltros(vazios);
    fetchCatalogos();
  }

  const filtrosAplicados = Object.values(filtros)
    .filter((v) => v)
    .join('; ');

  return (
    <SellerGuard>
      <div className='px-4 py-3 md:px-10 md:py-3 w-full'>
        {/* Banner */}
        <Banner
          src='https://nu6xzmkg6n.ufs.sh/f/1BGrcyVEf97rq1ovH5rSxuPhWF6Mc7oXBIw2RyKJN8ZdUbGq'
          alt='Catálogo X'
        />
        <br />
        <div className='flex justify-between items-center mb-4'>
          <h1 className='text-2xl font-bold'>{t('ProductsAndServices')}</h1>
          <Link
            href='/dashboard/lojista'
            className='text-blue-500 hover:underline'
          >
            {t('Back')}
          </Link>
        </div>
        <div className='mt-6 flex flex-col sm:flex-row flex-wrap justify-center gap-4'>
          <Dropdown
            label={t('Continent')}
            options={[
              'América do Norte',
              'América Central',
              'América do Sul',
              'Ásia',
              'África',
              'Oceânia',
            ]}
            onSelect={(c) => handleFiltroClick('continente', c)}
          />

          <Dropdown
            label={t('Country')}
            options={[
              'China',
              'EUA',
              'México',
              'Argentina',
              'Marrocos',
              'África do Sul',
              'Austrália',
              'Vietnã',
              'Indonésia',
              'Alemanha',
              'Itália',
              'Bélgica',
              'França',
              'Países Baixos',
              'Espanha',
              'Polônia',
              'Índia',
              'Turquia',
              'Portugal',
              'Bangladesh',
              'México',
              'Brasil',
              'Paquistão',
              'Canadá',
              'Egito',
            ]}
            onSelect={(p) => handleFiltroClick('pais', p)}
          />

          <Dropdown
            label={t('Category')}
            options={[
              'Calçados',
              'Acessórios',
              'Componentes',
              'Couros',
              'Máquinas',
              'Serviços',
              'Químicos',
            ]}
            onSelect={(cat) => handleFiltroClick('categoria', cat)}
          />

          <Dropdown
            label={t('Subcategory')}
            options={[
              'Masculino',
              'Feminino',
              'Infantil',
              'Meias',
              'Cintos',
              'Bolsas',
              'Malas',
              'Palmilha',
              'Sola',
              'Salto',
              'Cabedal',
              'Injetoras',
              'Costura',
              'Presponto',
              'Manutenção',
              'Sapataria',
              'Vendedores',
              'Curtume',
            ]}
            onSelect={(s) => handleFiltroClick('subcategoria', s)}
          />
        </div>

        {/* Filtros aplicados */}
        {filtrosAplicados && (
          <div className='flex justify-center mt-4'>
            <div className='bg-gray-100 px-4 py-2 rounded flex items-center gap-2'>
              <span className='text-sm text-gray-700'>{filtrosAplicados}</span>
              <button
                onClick={limparFiltros}
                className='ml-2 text-red-500 hover:text-red-700 font-bold'
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Limpar geral */}
        <div className='flex justify-center mt-4'>
          <button
            onClick={limparFiltros}
            className='bg-gray-200 px-4 py-2 rounded hover:bg-gray-300'
          >
            {t('ClearFilters')}
          </button>
        </div>

        {/* Lista de Catálogos - Cards Premium */}
        <div className='mt-8'>
          {catalogos.length === 0 ? (
            <EmptyState.NoResults
              searchTerm={filtros.categoria || filtros.pais}
              onClear={limparFiltros}
            />
          ) : (
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              {catalogos.map((catalogo) => (
                <div
                  key={catalogo.id}
                  className='
                    group relative
                    bg-white
                    rounded-[var(--radius-2xl)]
                    border border-[var(--color-gray-100)]
                    overflow-hidden
                    transition-all duration-300
                    hover:shadow-[var(--shadow-xl)]
                    hover:border-[var(--color-primary-200)]
                    hover:-translate-y-1
                  '
                >
                  {/* Image Container */}
                  <div className='relative aspect-[4/3] overflow-hidden'>
                    <img
                      src={catalogo.imagem_url || '/assets/placeholder.png'}
                      alt={catalogo.nome}
                      className='object-cover transition-transform duration-500 group-hover:scale-105'
                    />

                    {/* Gradient overlay */}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent' />

                    {/* Badges top */}
                    <div className='absolute top-3 left-3 flex gap-2'>
                      {catalogo.categoria && (
                        <Badge variant='secondary' size='sm'>
                          {catalogo.categoria}
                        </Badge>
                      )}
                      {catalogo.rating >= 4 && (
                        <Badge variant='warning' size='sm'>
                          🔥 Top
                        </Badge>
                      )}
                    </div>

                    {/* Favorite button */}
                    <div className='absolute top-3 right-3'>
                      <FavoriteButton
                        type='catalogo'
                        itemId={catalogo.id}
                        size='sm'
                      />
                    </div>

                    {/* Title on image */}
                    <div className='absolute bottom-0 left-0 right-0 p-4'>
                      <h3 className='text-lg font-bold text-white mb-1 line-clamp-2'>
                        {catalogo.nome}
                      </h3>
                      <div className='flex items-center gap-2 text-white/80 text-sm'>
                        <Building2 size={14} />
                        <span className='line-clamp-1'>
                          {catalogo.fornecedor_nome ||
                            catalogo.fornecedor_nome_fantasia}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className='p-4'>
                    {/* Location & Category */}
                    <div className='flex flex-wrap items-center gap-2 mb-3'>
                      {catalogo.pais && (
                        <div className='flex items-center gap-1 text-xs text-[var(--color-gray-500)]'>
                          <MapPin size={12} />
                          <span>{catalogo.pais}</span>
                        </div>
                      )}
                      {catalogo.continente && (
                        <span className='text-xs text-[var(--color-gray-400)]'>
                          • {catalogo.continente}
                        </span>
                      )}
                    </div>

                    {/* Rating & Status Row */}
                    <div className='flex items-center justify-between mb-4'>
                      {/* Rating */}
                      <div className='flex items-center gap-1'>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            className={
                              star <= (catalogo.rating || 0)
                                ? 'text-[var(--color-accent-amber)] fill-current'
                                : 'text-[var(--color-gray-300)]'
                            }
                          />
                        ))}
                        <span className='ml-1 text-sm text-[var(--color-gray-600)]'>
                          ({catalogo.rating || 0})
                        </span>
                      </div>

                      {/* Status Badge */}
                      <Badge
                        variant={
                          catalogo.status === 'publicado'
                            ? 'success'
                            : 'warning'
                        }
                        size='sm'
                      >
                        {catalogo.status === 'publicado'
                          ? 'Publicado'
                          : catalogo.status}
                      </Badge>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() =>
                        router.push(
                          `/dashboard/lojista/vitrines/catalogos/${catalogo.id}`,
                        )
                      }
                      className='
                        w-full flex items-center justify-center gap-2
                        px-4 py-2.5
                        bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)]
                        text-white font-medium
                        rounded-[var(--radius-lg)]
                        transition-all duration-300
                        hover:from-[var(--color-primary-600)] hover:to-[var(--color-primary-700)]
                        hover:shadow-md
                        active:scale-[0.98]
                      '
                    >
                      <Eye size={16} />
                      Ver Catálogo
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTIONS FIXAS */}
        <Section
          title={tLojista('TopFootwear')}
          data={topCalcados}
          filter={'categoria=Calçados'}
        />
        <Section
          title={tLojista('TopAccessories')}
          data={topAcessorios}
          filter={'categoria=Acessórios'}
        />
        <Section
          title={tLojista('TopMachines')}
          data={topMaquinas}
          filter={'categoria=Máquinas'}
        />
        <Section
          title={tLojista('TopLeathers')}
          data={topCouros}
          filter={'categoria=Couros'}
        />
      </div>
    </SellerGuard>
  );
}
