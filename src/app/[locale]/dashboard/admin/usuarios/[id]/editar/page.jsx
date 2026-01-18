// app/admin/usuarios/[id]/editar/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import AdminGuard from 'components/AdminGuard';

export default function EditarUsuarioPage() {
  const t = useTranslations('DashboardAdmin');
  const router = useRouter();
  const params = useParams();
  const usuarioId = params?.id;

  const [form, setForm] = useState({
    nome: '',
    nome_fantasia: '',
    email: '',
    papel: '',
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const papeis = ['administrador', 'fornecedor', 'representante', 'lojista'];
  
  // Carrega dados do usuário e opções de papel
  useEffect(() => {
    async function fetchData() {
      try {
        const [userRes] = await Promise.all([
          fetch(`/api/v1/usuarios/${usuarioId}`),
        ]);

        if (!userRes.ok) throw new Error(t('ErrorLoadingData'));

        const userData = await userRes.json();

        setForm({
          nome: userData.nome || '',
          nome_fantasia: userData.nome_fantasia || '',
          email: userData.email || '',
          telefone: userData.telefone || '',
          celular: userData.celular || '',
          cnpj: userData.cnpj || '',
          logradouro: userData.logradouro || '',
          numero: userData.numero || '',
          complemento: userData.complemento || '',
          cidade: userData.cidade || '',
          pais: userData.pais || '',
          papel: userData.papel || '',
        });
      } catch (err) {
        console.error(err);
        setMessage(t('ErrorLoadingData'));
      } finally {
        setLoading(false);
      }
    }

    if (usuarioId) fetchData();
  }, [usuarioId, t]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');

    // Validação simples
    if (!form.nome || !form.nome_fantasia || !form.email || !form.papel) {
      setMessage(t('FillRequiredFields'));
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setMessage(t('InvalidEmail'));
      return;
    }
    if (!papeis.includes(form.papel)) {
      setMessage(t('InvalidRole'));
      return;
    }

    try {
      const res = await fetch(`/api/v1/usuarios/${usuarioId}/editar`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error(t('ErrorUpdatingUser'));

      setMessage(t('UserUpdated'));
      setTimeout(() => {
        router.push('/dashboard/admin/usuarios');
      }, 1500);
    } catch (err) {
      console.error(err);
      setMessage(t('ErrorUpdatingUser'));
    }
  }

  if (loading) return <p>{t('Loading')}</p>;

  return (
    <AdminGuard>
      <div className='max-w-2xl mx-auto p-6 bg-white shadow rounded-xl'>
        <h1 className='text-2xl font-semibold mb-6 text-gray-800'>
          {t('EditUser')}
        </h1>

        {message && (
          <p className='mb-4 text-sm font-medium text-green-600 bg-green-50 p-2 rounded'>
            {message}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className='grid grid-cols-1 md:grid-cols-2 gap-6'
        >
          {/* Nome */}
          <div className='col-span-2'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              {t('NameRequired')}
            </label>
            <input
              type='text'
              name='nome'
              value={form.nome}
              onChange={handleChange}
              className='w-full shadow focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg px-3 py-2'
            />
          </div>

          {/* Nome Fantasia */}
          <div className='col-span-2'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              {t('TradeName')}
            </label>
            <input
              type='text'
              name='nome_fantasia'
              value={form.nome_fantasia}
              onChange={handleChange}
              className='w-full shadow focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg px-3 py-2'
            />
          </div>

          {/* Email */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              {t('Email')} *
            </label>
            <input
              type='email'
              name='email'
              value={form.email}
              onChange={handleChange}
              className='w-full shadow focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg px-3 py-2'
            />
          </div>

          {/* Telefone */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              {t('Phone')}
            </label>
            <input
              type='tel'
              name='telefone'
              value={form.telefone}
              onChange={handleChange}
              className='w-full shadow focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg px-3 py-2'
            />
          </div>

          {/* CNPJ */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              {t('CNPJ')}
            </label>
            <input
              type='text'
              name='cnpj'
              value={form.cnpj}
              onChange={handleChange}
              className='w-full shadow focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg px-3 py-2'
            />
          </div>

          {/* Logradouro */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              {t('Street')}
            </label>
            <input
              type='text'
              name='logradouro'
              value={form.logradouro}
              onChange={handleChange}
              className='w-full shadow focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg px-3 py-2'
            />
          </div>

          {/* Número */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              {t('Number')}
            </label>
            <input
              type='text'
              name='numero'
              value={form.numero}
              onChange={handleChange}
              className='w-full shadow focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg px-3 py-2'
            />
          </div>

          {/* Complemento */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              {t('Complement')}
            </label>
            <input
              type='text'
              name='complemento'
              value={form.complemento}
              onChange={handleChange}
              className='w-full shadow focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg px-3 py-2'
            />
          </div>

          {/* Cidade */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              {t('City')}
            </label>
            <input
              type='text'
              name='cidade'
              value={form.cidade}
              onChange={handleChange}
              className='w-full shadow focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg px-3 py-2'
            />
          </div>

          {/* País */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              {t('Country2')}
            </label>
            <input
              type='text'
              name='pais'
              value={form.pais}
              onChange={handleChange}
              className='w-full shadow focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg px-3 py-2'
            />
          </div>

          {/* Papel */}
          <div className='col-span-2'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              {t('Role')} *
            </label>
            <select
              name='papel'
              value={form.papel}
              onChange={handleChange}
              className='w-full shadow focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg px-3 py-2'
            >
              <option value=''>{t('Select')}</option>
              {papeis.map((papel) => (
                <option key={papel} value={papel}>
                  {papel}
                </option>
              ))}
            </select>
          </div>

          <div className='col-span-2 flex justify-end'>
            <button
              type='submit'
              className='bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1'
            >
              {t('SaveChanges')}
            </button>
          </div>
        </form>
      </div>
    </AdminGuard>
  );
}
