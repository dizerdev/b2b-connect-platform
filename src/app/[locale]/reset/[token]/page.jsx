'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Lock } from 'lucide-react';

export default function ResetPasswordPage() {
  const t = useTranslations('Auth');
  const { token } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const checkToken = async () => {
      try {
        const res = await fetch(`/api/v1/auth/reset/${token}`);
        if (!res.ok) throw new Error(t('InvalidOrExpiredToken'));
        setValid(true);
      } catch {
        setValid(false);
      } finally {
        setLoading(false);
      }
    };
    checkToken();
  }, [token, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError(t('PasswordsDoNotMatch'));
      return;
    }

    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/v1/auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, novaSenha: password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t('ErrorChangingPassword'));

      setMessage(t('PasswordChanged'));
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div
        className='relative min-h-screen flex items-center justify-center bg-cover bg-center'
        style={{ backgroundImage: "url('/assets/fundo_login.jpg')" }}
      >
        <div className='absolute inset-0 bg-black/70'></div>
        <p className='relative z-10 text-white text-lg'>{t('ValidatingLink')}</p>
      </div>
    );
  }

  if (!valid) {
    return (
      <div
        className='relative min-h-screen flex items-center justify-center bg-cover bg-center'
        style={{ backgroundImage: "url('/assets/fundo_login.jpg')" }}
      >
        <div className='absolute inset-0 bg-black/70'></div>
        <div className='relative z-10 max-w-md w-full bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl p-8 text-center'>
          <h1 className='text-2xl font-bold text-white mb-4'>{t('InvalidLink')}</h1>
          <p className='text-white/80 mb-4'>
            {t('InvalidLinkDescription')}
          </p>
          <button
            onClick={() => router.push('/forgot')}
            className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg'
          >
            {t('RequestNewLink')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className='relative min-h-screen flex items-center justify-center bg-cover bg-center'
      style={{ backgroundImage: "url('/assets/fundo_login.jpg')" }}
    >
      <div className='absolute inset-0 bg-black/70'></div>

      <div className='relative z-10 max-w-md w-full bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl p-8'>
        <h1 className='text-3xl font-bold text-center text-white mb-6'>
          {t('ResetPassword')}
        </h1>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-white'>
              {t('NewPassword')}
            </label>
            <div className='flex items-center border border-white/40 rounded-lg px-3 mt-1 bg-white/20'>
              <Lock className='text-white/70 mr-2' size={18} />
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='flex-1 py-2 bg-transparent text-white placeholder-white/70 outline-none'
                placeholder={t('TypeNewPassword')}
                required
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-white'>
              {t('ConfirmPassword')}
            </label>
            <div className='flex items-center border border-white/40 rounded-lg px-3 mt-1 bg-white/20'>
              <Lock className='text-white/70 mr-2' size={18} />
              <input
                type='password'
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className='flex-1 py-2 bg-transparent text-white placeholder-white/70 outline-none'
                placeholder={t('ConfirmNewPassword')}
                required
              />
            </div>
          </div>

          <button
            type='submit'
            disabled={submitting}
            className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50'
          >
            {submitting ? t('Changing') : t('ChangePassword')}
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
