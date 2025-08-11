// stores/useAuthStore.js
'use client';

import { create } from 'zustand';
import Cookies from 'js-cookie';

export const useAuthStore = create((set, get) => ({
  usuario: null,
  loading: true,

  fetchUser: async () => {
    const token = Cookies.get('token');
    if (!token) {
      set({ usuario: null, loading: false });
      return;
    }

    try {
      const res = await fetch('/api/v1/auth/me', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        // Token inválido ou expirado
        Cookies.remove('token');
        set({ usuario: null, loading: false });
        return;
      }

      const data = await res.json();
      set({ usuario: data.usuario, loading: false });
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      set({ usuario: null, loading: false });
    }
  },

  logout: () => {
    Cookies.remove('token');
    set({ usuario: null });
  },
}));
