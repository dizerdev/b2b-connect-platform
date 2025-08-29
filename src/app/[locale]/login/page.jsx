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
        case 'administrador':
          router.push('/dashboard/admin');
          break;
        case 'fornecedor':
          router.push('/dashboard/parceiro');
          break;
        case 'representante':
          router.push('/dashboard/parceiro');
          break;
        case 'lojista':
          router.push('/dashboard/lojista');
          break;
        default:
          router.push('/mapa');
      }
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className='relative min-h-screen flex items-center justify-center bg-cover bg-center'
      style={{
        backgroundImage: "url('/assets/fundo_login.jpg')", // substitua pela sua imagem
      }}
    >
      {/* Overlay com opacidade */}
      <div className='absolute inset-0 bg-black/70'></div>

      {/* Card glass */}
      <div className='relative z-10 max-w-md w-full bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl p-8'>
        <h1 className='text-3xl font-bold text-center text-white mb-6'>
          Login
        </h1>

        <form onSubmit={handleLogin} className='space-y-4'>
          {erro && (
            <div className='bg-red-500/20 text-red-300 p-2 rounded text-sm'>
              {erro}
            </div>
          )}

          <div>
            <label className='block text-sm font-medium text-white'>
              E-mail
            </label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='mt-1 w-full border border-gray-300/40 bg-white/30 text-white placeholder-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400'
              placeholder='exemplo@email.com'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-white'>
              Senha
            </label>
            <input
              type='password'
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className='mt-1 w-full border border-gray-300/40 bg-white/30 text-white placeholder-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400'
              placeholder='••••••••'
            />
            <div className='text-right mt-2'>
              <a
                href='/recuperar-senha'
                className='text-sm text-blue-300 hover:underline'
              >
                Esqueceu a senha?
              </a>
            </div>
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50'
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
