'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

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

export default function SellerGuard({ children }) {
  const t = useTranslations('Common');
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSeller, setIsSeller] = useState(false);

  useEffect(() => {
    let ignore = false;

    fetchUser().then((user) => {
      if (ignore) return;
      if (!user || user.usuario.papel?.toLowerCase() !== 'lojista') {
        router.replace('/mapa');
      } else {
        setIsSeller(true);
      }
      setLoading(false);
    });

    return () => {
      ignore = true;
    };
  }, [router]);

  if (loading) {
    return <div>{t('Loading')}</div>;
  }

  if (!isSeller) {
    return null;
  }

  return <>{children}</>;
}
