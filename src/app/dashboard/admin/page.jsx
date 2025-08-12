'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

async function fetchUser() {
  try {
    const res = await fetch('/api/v1/auth/me');
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    return data;
  } catch (error) {
    return null;
  }
}

export default function DashboardAdmin() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchUser().then((user) => {
      if (!user || user.usuario.papel?.toLowerCase() !== 'administrador') {
        router.push('/mapa');
      } else {
        setIsAdmin(true);
      }
      setLoading(false);
    });
  }, [router]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className='min-h-screen flex flex-col'>
      <nav className='bg-gray-800 text-white p-4'>
        <ul className='flex space-x-6'>
          <li>
            <Link href='/dashboard/admin' className='hover:underline'>
              Dashboard
            </Link>
          </li>
          <li>
            <Link href='/dashboard/admin/usuarios' className='hover:underline'>
              Usuários
            </Link>
          </li>
          <li>
            <Link href='/dashboard/admin/catalogos' className='hover:underline'>
              Catalogos
            </Link>
          </li>
          <li>
            <Link href='/dashboard/admin/produtos' className='hover:underline'>
              Produtos
            </Link>
          </li>
          <li>
            <Link href='/dashboard/admin/pedidos' className='hover:underline'>
              Pedidos
            </Link>
          </li>
        </ul>
      </nav>

      <main className='flex-1 p-6'>Dashboard Admin</main>
    </div>
  );
}
