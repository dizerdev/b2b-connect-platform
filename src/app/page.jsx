// app/page.jsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import Cookies from 'js-cookie';

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      // const token = Cookies.get('token');

      if (!token) {
        router.replace('/login');
        return;
      }

      try {
        const res = await fetch('/api/v1/auth/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Cookie: `token=${token}`,
          },
        });

        if (!res.ok) {
          router.replace('/login');
          return;
        }

        const data = await res.json();
        switch (data.usuario.papel) {
          case 'admin':
            router.replace('/admin/dashboard');
            break;
          case 'fornecedor':
            router.replace('/fornecedor/dashboard');
            break;
          case 'lojista':
            router.replace('/lojista/dashboard');
            break;
          default:
            router.replace('/login');
        }
      } catch {
        router.replace('/login');
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
