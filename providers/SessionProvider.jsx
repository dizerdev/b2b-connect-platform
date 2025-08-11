// providers/SessionProvider.jsx
'use client';

import { useEffect } from 'react';
import { useAuthStore } from 'stores/useAuthStore';

export default function SessionProvider({ children }) {
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return children;
}
