'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/v1/auth/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
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
