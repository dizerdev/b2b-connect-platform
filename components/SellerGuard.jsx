'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

async function fetchUser() {
  try {
    const res = await fetch('/api/v1/auth/me', { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch {
    return null;
  }
}

export default function AdminGuard({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let ignore = false;

    fetchUser().then((user) => {
      if (ignore) return;
      if (!user || user.usuario.papel?.toLowerCase() !== 'lojista') {
        router.replace('/mapa');
      } else {
        setIsAdmin(true);
      }
      setLoading(false);
    });

    return () => {
      ignore = true;
    };
  }, [router]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
}
