'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import SellerGuard from 'components/SellerGuard';
import Banner from 'components/shared/Banner';
import Section from 'components/shared/Section';
import Link from 'next/link';
import Dropdown from 'components/shared/Dropdown';
import { useRouter } from 'next/navigation';

export default function VitrinePrincipalPage() {
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
      Object.entries(f).filter(([_, v]) => v)
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
        <div className='flex justify-between items-center mb-4'>
          <h1 className='text-2xl font-bold'>
            Produtos & Serviços Disponíveis
          </h1>
          <Link
            href='/dashboard/lojista'
            className='text-blue-500 hover:underline'
          >
            ← Voltar
          </Link>
        </div>

        {/* Banner */}
        <Banner
          src='https://nu6xzmkg6n.ufs.sh/f/1BGrcyVEf97rwypuwZJIdC2t7huEH1bym6MNiXDflUgRz8qF'
          alt='Catálogo X'
        />

        <div className='mt-6 flex flex-col sm:flex-row flex-wrap justify-center gap-4'>
          <Dropdown
            label='Continente'
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
            label='País'
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
            label='Categoria'
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
            label='Subcategoria'
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
            Limpar Filtros
          </button>
        </div>

        {/* Lista de Catálogos */}
        <div className='mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
          {catalogos.length === 0 ? (
            <p>Nenhum catálogo encontrado.</p>
          ) : (
            catalogos.map((catalogo) => (
              <div
                key={catalogo.id}
                className='border rounded-lg shadow hover:shadow-lg transition cursor-pointer overflow-hidden'
                onClick={() => {
                  router.push(
                    `/dashboard/lojista/vitrines/catalogos/${catalogo.id}`
                  );
                }}
              >
                {/* 2/3 imagem */}
                <div className='w-full h-48'>
                  <img
                    src={catalogo.imagem_url || '/assets/placeholder.png'}
                    alt={catalogo.nome}
                    className='w-full h-full object-cover'
                  />
                </div>

                {/* 1/3 informações */}
                <div className='p-4 bg-white'>
                  <h2 className='text-lg font-semibold'>{catalogo.nome}</h2>
                  <p className='text-sm text-gray-600'>
                    Fornecedor: {catalogo.fornecedor_nome}
                  </p>
                  <p className='text-sm mt-1'>
                    Status:{' '}
                    <span
                      className={`font-semibold ${
                        catalogo.status === 'publicado'
                          ? 'text-green-600'
                          : 'text-yellow-600'
                      }`}
                    >
                      {catalogo.status}
                    </span>
                  </p>
                  <p className='text-sm'>Rating: ⭐ {catalogo.rating || 0}</p>
                </div>
              </div>
            ))
          )}
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
      </div>
    </SellerGuard>
  );
}
