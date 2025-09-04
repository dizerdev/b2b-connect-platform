'use client';

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    if (!window.confirm('Deseja realmente sair?')) return;

    try {
      const token = Cookies.get('token');
      await fetch('/api/v1/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      router.replace('/public/mapa');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className='px-3 py-2 bg-red-600 text-white rounded'
    >
      Sair
    </button>
  );
}
