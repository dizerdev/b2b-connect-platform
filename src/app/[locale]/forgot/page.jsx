'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function ForgotPasswordPage() {
  const t = useTranslations('Auth');
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/v1/auth/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || t('ErrorSendingEmail'));

      setMessage(t('InstructionsSent'));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className='relative min-h-screen flex items-center justify-center bg-cover bg-center'
      style={{ backgroundImage: "url('/assets/fundo_login.jpg')" }}
    >
      <div className='absolute inset-0 bg-black/70'></div>

      <div className='relative z-10 max-w-md w-full bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl p-8'>
        <h1 className='text-3xl font-bold text-center text-white mb-6'>
          {t('RecoverPassword')}
        </h1>
        <p className='text-white/80 text-center mb-6'>
          {t('RecoverPasswordDescription')}
        </p>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-white'>
              {t('Email')}
            </label>
            <div className='flex items-center border border-white/40 rounded-lg px-3 mt-1 bg-white/20'>
              <Mail className='text-white/70 mr-2' size={18} />
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='flex-1 py-2 bg-transparent text-white placeholder-white/70 outline-none'
                placeholder='seuemail@exemplo.com'
                required
              />
            </div>
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50'
          >
            {loading ? t('Sending') : t('SendInstructions')}
          </button>
        </form>

        {message && (
          <p className='mt-4 text-sm text-green-400 text-center'>{message}</p>
        )}
        {error && (
          <p className='mt-4 text-sm text-red-400 text-center'>{error}</p>
        )}
      </div>
    </div>
  );
}
