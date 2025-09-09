'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import SellerGuard from 'components/SellerGuard';

export default function ListaMensagensLojista() {
  const [mensagens, setMensagens] = useState([]);
  const [statusFiltro, setStatusFiltro] = useState('');
  const [catalogoFiltro, setCatalogoFiltro] = useState('');
  const [catalogos, setCatalogos] = useState([]);

  useEffect(() => {
    const fetchMensagens = async () => {
      try {
        const res = await fetch('/api/v1/mensagens/lojista');
        if (res.ok) {
          const data = await res.json();
          setMensagens(data.mensagens);
        }
      } catch (err) {
        console.error('Erro ao carregar mensagens:', err);
      }
    };

    fetchMensagens();
  }, []);

  useEffect(() => {
    // opcional: carregar catálogos para filtros
    const fetchCatalogos = async () => {
      try {
        const res = await fetch('/api/v1/vitrines/principal');
        if (res.ok) {
          const data = await res.json();
          setCatalogos(data.catalogos);
        }
      } catch (err) {
        console.error('Erro ao carregar catálogos:', err);
      }
    };

    fetchCatalogos();
  }, []);

  const mensagensFiltradas = mensagens.filter((msg) => {
    const statusOk =
      !statusFiltro ||
      (statusFiltro === 'aguardando' && msg.status === 'nova') ||
      (statusFiltro === 'respondida' && msg.status === 'respondida');

    const catalogoOk =
      !catalogoFiltro || msg.catalogo_id === parseInt(catalogoFiltro);

    return statusOk && catalogoOk;
  });

  return (
    <SellerGuard>
      <div className='w-full p-6 mx-auto'>
        <div className='flex justify-between items-center mb-4'>
          <h1 className='text-2xl font-bold'>Minhas Mensagens</h1>
          <div>
            <Link
              href='/dashboard/lojista'
              className='text-blue-500 hover:underline'
            >
              ← Voltar
            </Link>
          </div>
        </div>

        {/* Filtros */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6'>
          <select
            value={statusFiltro}
            onChange={(e) => setStatusFiltro(e.target.value)}
            className='border p-2 rounded'
          >
            <option value=''>Todos os status</option>
            <option value='aguardando'>Aguardando resposta</option>
            <option value='respondida'>Respondida</option>
          </select>

          <select
            value={catalogoFiltro}
            onChange={(e) => setCatalogoFiltro(e.target.value)}
            className='border p-2 rounded'
          >
            <option value=''>Todos os catálogos</option>
            {catalogos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Lista de mensagens */}
        <div className='space-y-4'>
          {mensagensFiltradas.length === 0 ? (
            <p className='text-gray-500'>Nenhuma mensagem encontrada.</p>
          ) : (
            mensagensFiltradas.map((msg) => (
              <div
                key={msg.id}
                className={`border rounded-lg p-4 shadow-sm ${
                  msg.status === 'nova'
                    ? 'border-yellow-400 bg-yellow-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <h2 className='font-semibold'>{msg.catalogo_nome}</h2>
                <p className='text-gray-700 mt-1'>{msg.mensagem}</p>

                <div className='mt-2 text-sm text-gray-500'>
                  <span>
                    {new Date(msg.created_at).toLocaleString('pt-BR')}
                  </span>
                </div>

                <div className='mt-3'>
                  {msg.status === 'respondida' ? (
                    <div className='bg-green-50 border border-green-200 rounded p-2'>
                      <p className='text-green-700 text-sm'>
                        <strong>Resposta:</strong> {msg.resposta}
                      </p>
                      <p className='text-xs text-gray-500'>
                        {new Date(msg.resposta_data_hora).toLocaleString(
                          'pt-BR'
                        )}
                      </p>
                    </div>
                  ) : (
                    <span className='text-yellow-600 text-sm font-medium'>
                      Aguardando resposta do fornecedor
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </SellerGuard>
  );
}
