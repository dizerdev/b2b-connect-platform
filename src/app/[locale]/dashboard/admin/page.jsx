'use client';

import AdminGuard from 'components/AdminGuard';
import {
  Users,
  Package,
  FolderCheck,
  FolderClock,
  FolderOpen,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function DashboardAdmin() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/v1/reports/admin`)
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao carregar catálogo');
        return res.json();
      })
      .then((data) => setData(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className='p-4'>Carregando...</p>;
  if (error) return <div>Erro ao carregar relatórios</div>;

  return (
    <AdminGuard>
      <main className='flex-1 p-6 space-y-6'>
        <h1 className='text-2xl font-bold'>Dashboard Admin</h1>

        {/* Relatórios */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          <div className='bg-white rounded-xl shadow p-4'>
            <div className='flex items-center justify-between'>
              <span className='text-gray-600'>Produtos Cadastrados</span>
              <Package className='text-blue-600' />
            </div>
            <p className='text-2xl font-bold mt-2'>
              {data?.relatorios?.produtos_cadastrados ?? '...'}
            </p>
          </div>

          <div className='bg-white rounded-xl shadow p-4'>
            <div className='flex items-center justify-between'>
              <span className='text-gray-600'>Usuários ativos</span>
              <Users className='text-green-600' />
            </div>
            <p className='text-2xl font-bold mt-2'>
              {data?.relatorios?.usuarios_ativos ?? '...'}
            </p>
          </div>

          <div className='bg-white rounded-xl shadow p-4'>
            <div className='flex items-center justify-between'>
              <span className='text-gray-600'>Catálogos ativos</span>
              <FolderCheck className='text-purple-600' />
            </div>
            <p className='text-2xl font-bold mt-2'>
              {data?.relatorios?.catalogos_publicados ?? '...'}
            </p>
          </div>

          <div className='bg-white rounded-xl shadow p-4'>
            <div className='flex items-center justify-between'>
              <span className='text-gray-600'>Pendentes aprovação</span>
              <FolderClock className='text-yellow-600' />
            </div>
            <p className='text-2xl font-bold mt-2'>
              {data?.relatorios?.catalogos_pendentes_aprovacao ?? '...'}
            </p>
          </div>

          <div className='bg-white rounded-xl shadow p-4'>
            <div className='flex items-center justify-between'>
              <span className='text-gray-600'>Pendentes publicação</span>
              <FolderOpen className='text-red-600' />
            </div>
            <p className='text-2xl font-bold mt-2'>
              {data?.relatorios?.catalogos_pendentes_publicacao ?? '...'}
            </p>
          </div>
        </div>

        {/* Atalhos */}
        <div>
          <h2 className='text-xl font-semibold mb-4'>Atalhos</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            <Link href={'/dashboard/admin/usuarios'}>
              <div className='bg-white rounded-xl shadow p-6 hover:shadow-lg cursor-pointer transition'>
                <h3 className='text-lg font-bold mb-2'>Gerenciar Usuários</h3>
                <p className='text-sm text-gray-600'>
                  Adicionar, editar e remover usuários do sistema.
                </p>
              </div>
            </Link>
            <Link href={'/dashboard/admin/catalogos'}>
              <div className='bg-white rounded-xl shadow p-6 hover:shadow-lg cursor-pointer transition'>
                <h3 className='text-lg font-bold mb-2'>Gerenciar Catálogos</h3>
                <p className='text-sm text-gray-600'>
                  Aprovar, publicar ou arquivar catálogos.
                </p>
              </div>
            </Link>
            <Link href={'/dashboard/admin/mensagens'}>
              <div className='bg-white rounded-xl shadow p-6 hover:shadow-lg cursor-pointer transition'>
                <h3 className='text-lg font-bold mb-2'>Mensagens</h3>
                <p className='text-sm text-gray-600'>
                  Visualizar e responder mensagens dos usuários.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </AdminGuard>
  );
}
