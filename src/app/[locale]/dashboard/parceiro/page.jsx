'use client';

import { Package, FolderCheck, FolderClock, FolderOpen } from 'lucide-react';
import PartnerGuard from 'components/PartnerGuard';

export default function DashboardParceiro() {
  return (
    <PartnerGuard>
      {/* Conteúdo */}
      <main className='flex-1 p-6 space-y-6'>
        <h1 className='text-2xl font-bold'>Dashboard Parceiro</h1>

        {/* Relatórios */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          <div className='bg-white rounded-xl shadow p-4'>
            <div className='flex items-center justify-between'>
              <span className='text-gray-600'>Produtos cadastrados</span>
              <Package className='text-blue-600' />
            </div>
            <p className='text-2xl font-bold mt-2'>58</p>
          </div>

          <div className='bg-white rounded-xl shadow p-4'>
            <div className='flex items-center justify-between'>
              <span className='text-gray-600'>Catálogos ativos</span>
              <FolderCheck className='text-green-600' />
            </div>
            <p className='text-2xl font-bold mt-2'>7</p>
          </div>

          <div className='bg-white rounded-xl shadow p-4'>
            <div className='flex items-center justify-between'>
              <span className='text-gray-600'>Pendentes aprovação</span>
              <FolderClock className='text-yellow-600' />
            </div>
            <p className='text-2xl font-bold mt-2'>2</p>
          </div>

          <div className='bg-white rounded-xl shadow p-4'>
            <div className='flex items-center justify-between'>
              <span className='text-gray-600'>Pendentes publicação</span>
              <FolderOpen className='text-red-600' />
            </div>
            <p className='text-2xl font-bold mt-2'>4</p>
          </div>
        </div>

        {/* Atalhos */}
        <div>
          <h2 className='text-xl font-semibold mb-4'>Atalhos</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            <div className='bg-white rounded-xl shadow p-6 hover:shadow-lg cursor-pointer transition'>
              <h3 className='text-lg font-bold mb-2'>Gerenciar Catálogos</h3>
              <p className='text-sm text-gray-600'>
                Criar, editar e acompanhar status dos seus catálogos.
              </p>
            </div>
            <div className='bg-white rounded-xl shadow p-6 hover:shadow-lg cursor-pointer transition'>
              <h3 className='text-lg font-bold mb-2'>Gerenciar Produtos</h3>
              <p className='text-sm text-gray-600'>
                Cadastrar e atualizar os produtos vinculados.
              </p>
            </div>
            <div className='bg-white rounded-xl shadow p-6 hover:shadow-lg cursor-pointer transition'>
              <h3 className='text-lg font-bold mb-2'>Suporte</h3>
              <p className='text-sm text-gray-600'>
                Tire dúvidas ou abra chamados com o administrador.
              </p>
            </div>
          </div>
        </div>
      </main>
    </PartnerGuard>
  );
}
