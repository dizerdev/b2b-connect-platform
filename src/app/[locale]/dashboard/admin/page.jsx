'use client';

import AdminGuard from 'components/AdminGuard';
import {
  Users,
  Package,
  FolderCheck,
  FolderClock,
  FolderOpen,
} from 'lucide-react';

export default function DashboardAdmin() {
  return (
    <AdminGuard>
      <main className='flex-1 p-6 space-y-6'>
        <h1 className='text-2xl font-bold'>Dashboard Admin</h1>

        {/* Relatórios */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          <div className='bg-white rounded-xl shadow p-4'>
            <div className='flex items-center justify-between'>
              <span className='text-gray-600'>Produtos</span>
              <Package className='text-blue-600' />
            </div>
            <p className='text-2xl font-bold mt-2'>120</p>
          </div>

          <div className='bg-white rounded-xl shadow p-4'>
            <div className='flex items-center justify-between'>
              <span className='text-gray-600'>Usuários ativos</span>
              <Users className='text-green-600' />
            </div>
            <p className='text-2xl font-bold mt-2'>45</p>
          </div>

          <div className='bg-white rounded-xl shadow p-4'>
            <div className='flex items-center justify-between'>
              <span className='text-gray-600'>Catálogos ativos</span>
              <FolderCheck className='text-purple-600' />
            </div>
            <p className='text-2xl font-bold mt-2'>12</p>
          </div>

          <div className='bg-white rounded-xl shadow p-4'>
            <div className='flex items-center justify-between'>
              <span className='text-gray-600'>Pendentes aprovação</span>
              <FolderClock className='text-yellow-600' />
            </div>
            <p className='text-2xl font-bold mt-2'>3</p>
          </div>

          <div className='bg-white rounded-xl shadow p-4'>
            <div className='flex items-center justify-between'>
              <span className='text-gray-600'>Pendentes publicação</span>
              <FolderOpen className='text-red-600' />
            </div>
            <p className='text-2xl font-bold mt-2'>5</p>
          </div>
        </div>

        {/* Atalhos */}
        <div>
          <h2 className='text-xl font-semibold mb-4'>Atalhos</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            <div className='bg-white rounded-xl shadow p-6 hover:shadow-lg cursor-pointer transition'>
              <h3 className='text-lg font-bold mb-2'>Gerenciar Usuários</h3>
              <p className='text-sm text-gray-600'>
                Adicionar, editar e remover usuários do sistema.
              </p>
            </div>
            <div className='bg-white rounded-xl shadow p-6 hover:shadow-lg cursor-pointer transition'>
              <h3 className='text-lg font-bold mb-2'>Gerenciar Catálogos</h3>
              <p className='text-sm text-gray-600'>
                Aprovar, publicar ou arquivar catálogos.
              </p>
            </div>
            <div className='bg-white rounded-xl shadow p-6 hover:shadow-lg cursor-pointer transition'>
              <h3 className='text-lg font-bold mb-2'>Mensagens</h3>
              <p className='text-sm text-gray-600'>
                Visualizar e responder mensagens dos usuários.
              </p>
            </div>
          </div>
        </div>
      </main>
    </AdminGuard>
  );
}
