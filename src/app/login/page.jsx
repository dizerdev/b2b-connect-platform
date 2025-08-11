// app/login/page.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// import Cookies from 'js-cookie';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');

    // Validações simples antes de enviar
    if (!email || !senha) {
      setErro('E-mail e senha são obrigatórios');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErro('Formato de e-mail inválido');
      return;
    }
    if (senha.length < 6) {
      setErro('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Credenciais inválidas');
        }
        if (res.status === 400) {
          throw new Error('Requisição inválida');
        }
        throw new Error('Erro ao autenticar');
      }

      const data = await res.json();

      // Salvar token
      // Cookies.set('token', data.token, { secure: true, sameSite: 'strict' });

      // Redirecionar conforme papel
      switch (data.usuario.papel) {
        case 'admin':
          router.push('/admin/dashboard');
          break;
        case 'fornecedor':
          router.push('/fornecedor/dashboard');
          break;
        case 'lojista':
          router.push('/lojista/dashboard');
          break;
        default:
          router.push('/');
      }
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <div className='max-w-md w-full bg-white rounded-xl shadow-lg p-8'>
        <h1 className='text-2xl font-bold text-center mb-6'>Login</h1>
        <form onSubmit={handleLogin} className='space-y-4'>
          {erro && (
            <div className='bg-red-100 text-red-700 p-2 rounded text-sm'>
              {erro}
            </div>
          )}

          <div>
            <label className='block text-sm font-medium'>E-mail</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300'
              placeholder='exemplo@email.com'
            />
          </div>

          <div>
            <label className='block text-sm font-medium'>Senha</label>
            <input
              type='password'
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className='mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300'
              placeholder='••••••••'
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50'
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
