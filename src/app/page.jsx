'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Cookies from 'js-cookie';

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const token = Cookies.get('token');

      if (!token) {
        router.replace('/mapa');
        return;
      }

      try {
        const res = await fetch('/api/v1/auth/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Cookie: `token=${token}`,
          },
        });

        if (!res.ok) {
          router.replace('/mapa');
          return;
        }

        const data = await res.json();
        switch (data.usuario.papel) {
          case 'administrador':
            router.replace('/dashboard/admin');
            break;
          case 'representante':
            router.replace('/dashboard/parceiro');
            break;
          case 'fornecedor':
            router.replace('/dashboard/parceiro');
            break;
          case 'lojista':
            router.replace('/dashboard/lojista');
            break;
          default:
            router.replace('/mapa');
        }
      } catch {
        router.replace('/mapa');
      }
    };

    checkSession();
  }, [router]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='flex flex-col items-center'>
        <div className='animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600'></div>
        <p className='mt-4 text-gray-600'>Verificando sessão...</p>
      </div>
    </div>
  );
}
