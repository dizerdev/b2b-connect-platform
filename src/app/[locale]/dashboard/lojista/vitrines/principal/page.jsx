'use client';

import { useEffect, useState } from 'react';
import SellerGuard from 'components/SellerGuard';
import Banner from 'components/shared/Banner';
import Link from 'next/link';

export default function VitrinePrincipalPage() {
  const [catalogos, setCatalogos] = useState([]);
  const [filtros, setFiltros] = useState({
    continente: '',
    pais: '',
    categoria: '',
    especificacao: '',
  });

  useEffect(() => {
    fetchCatalogos();
  }, []);

  async function fetchCatalogos(query = '') {
    try {
      const res = await fetch(`/api/v1/vitrines/search${query}`, {
        cache: 'no-store',
      });
      if (!res.ok) throw new Error('Erro ao carregar catálogos');
      const data = await res.json();
      setCatalogos(data);
    } catch (err) {
      console.error(err);
    }
  }

  function handleFiltroChange(e) {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
  }

  function aplicarFiltros() {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(filtros).filter(([_, v]) => v))
    ).toString();
    fetchCatalogos(query ? `?${query}` : '');
  }

  function limparFiltros() {
    setFiltros({ continente: '', pais: '', categoria: '', especificacao: '' });
    fetchCatalogos();
  }

  return (
    <SellerGuard>
      <div className='p-6'>
        <div className='flex justify-between items-center mb-4'>
          <h1 className='text-2xl font-bold'>Catálogos Disponíveis</h1>
          <div>
            <Link
              href='/dashboard/lojista'
              className='text-blue-500 hover:underline'
            >
              ← Voltar
            </Link>
          </div>
        </div>
        <Banner
          src='https://nu6xzmkg6n.ufs.sh/f/1BGrcyVEf97rGRBBqlTMpjSVUXsT8xvoO2kCJE1P9WMnBA5N'
          alt='Catálogo X'
        />
        <br />
        {/* Filtros */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
          <select
            name='continente'
            value={filtros.continente}
            onChange={handleFiltroChange}
            className='border p-2 rounded'
          >
            <option value=''>Continente</option>
            <option value='america'>América</option>
            <option value='europa'>Europa</option>
            <option value='asia'>Ásia</option>
          </select>

          <select
            name='pais'
            value={filtros.pais}
            onChange={handleFiltroChange}
            className='border p-2 rounded'
          >
            <option value=''>País</option>
            <option value='brasil'>Brasil</option>
            <option value='eua'>EUA</option>
            <option value='portugal'>Portugal</option>
          </select>

          <select
            name='categoria'
            value={filtros.categoria}
            onChange={handleFiltroChange}
            className='border p-2 rounded'
          >
            <option value=''>Categoria</option>
            <option value='moda'>Moda</option>
            <option value='calcados'>Calçados</option>
            <option value='acessorios'>Acessórios</option>
          </select>

          <select
            name='especificacao'
            value={filtros.especificacao}
            onChange={handleFiltroChange}
            className='border p-2 rounded'
          >
            <option value=''>Especificações</option>
            <option value='eco'>Ecológico</option>
            <option value='luxo'>Luxo</option>
            <option value='popular'>Popular</option>
          </select>
        </div>

        <div className='flex gap-4 mb-6'>
          <button
            onClick={aplicarFiltros}
            className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
          >
            Aplicar Filtros
          </button>
          <button
            onClick={limparFiltros}
            className='bg-gray-300 px-4 py-2 rounded hover:bg-gray-400'
          >
            Limpar
          </button>
        </div>

        {/* Lista de Catálogos */}
        {catalogos.length === 0 ? (
          <p>Nenhum catálogo encontrado.</p>
        ) : (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {catalogos.catalogos.map((catalogo) => (
              <div
                key={catalogo.id}
                className='border rounded-lg p-4 shadow hover:shadow-lg transition cursor-pointer'
                onClick={() =>
                  (window.location.href = `/dashboard/lojista/vitrines/catalogos/${catalogo.id}`)
                }
              >
                <h2 className='text-lg font-semibold'>{catalogo.nome}</h2>
                <p className='text-sm text-gray-600 mb-2'>
                  Fornecedor: {catalogo.fornecedor_nome}
                </p>
                <p className='text-sm mb-1'>
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
            ))}
          </div>
        )}
      </div>
    </SellerGuard>
  );
}
