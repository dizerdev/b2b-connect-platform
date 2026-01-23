// app/admin/usuarios/[id]/editar/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import AdminGuard from 'components/AdminGuard';
import {
  ArrowLeft,
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Hash,
  Shield,
  Briefcase,
  Store,
  UserCheck,
  CheckCircle,
  AlertCircle,
  Save,
  FileText,
} from 'lucide-react';
import { Card, Badge, Button, Skeleton } from 'components/ui';

export default function EditarUsuarioPage() {
  const t = useTranslations('DashboardAdmin');
  const router = useRouter();
  const params = useParams();
  const usuarioId = params?.id;

  const [form, setForm] = useState({
    nome: '',
    nome_fantasia: '',
    email: '',
    telefone: '',
    celular: '',
    cnpj: '',
    logradouro: '',
    numero: '',
    complemento: '',
    cidade: '',
    pais: '',
    papel: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const papeis = [
    {
      value: 'administrador',
      label: t('Administrator'),
      icon: Shield,
      color: 'rose',
    },
    {
      value: 'fornecedor',
      label: t('Supplier'),
      icon: Briefcase,
      color: 'blue',
    },
    {
      value: 'representante',
      label: t('Representative'),
      icon: UserCheck,
      color: 'amber',
    },
    {
      value: 'lojista',
      label: t('Shopkeeper2'),
      icon: Store,
      color: 'emerald',
    },
  ];

  // Carrega dados do usuário
  useEffect(() => {
    async function fetchData() {
      try {
        const userRes = await fetch(`/api/v1/usuarios/${usuarioId}`);
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
        setMessage({ type: 'error', text: t('ErrorLoadingData') });
      } finally {
        setLoading(false);
      }
    }

    if (usuarioId) fetchData();
  }, [usuarioId, t]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setMessage({ type: '', text: '' });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Validação simples
    if (!form.nome || !form.nome_fantasia || !form.email || !form.papel) {
      setMessage({ type: 'error', text: t('FillRequiredFields') });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setMessage({ type: 'error', text: t('InvalidEmail') });
      return;
    }
    if (!papeis.find((p) => p.value === form.papel)) {
      setMessage({ type: 'error', text: t('InvalidRole') });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/v1/usuarios/${usuarioId}/editar`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error(t('ErrorUpdatingUser'));

      setMessage({ type: 'success', text: t('UserUpdated') });
      setTimeout(() => {
        router.push('/dashboard/admin/usuarios');
      }, 1500);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: t('ErrorUpdatingUser') });
    } finally {
      setSaving(false);
    }
  }

  // Skeleton Loading State
  if (loading) {
    return (
      <AdminGuard>
        <div className='max-w-3xl mx-auto space-y-6'>
          <div className='flex items-center gap-3'>
            <Skeleton variant='circular' width='40px' height='40px' />
            <div className='space-y-2'>
              <Skeleton variant='text' width='200px' height='28px' />
              <Skeleton variant='text' width='150px' />
            </div>
          </div>
          <Card padding={false}>
            <div className='p-5 space-y-5'>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i}>
                  <Skeleton variant='text' width='100px' className='mb-2' />
                  <Skeleton
                    variant='rectangular'
                    width='100%'
                    height='40px'
                    className='rounded-lg'
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </AdminGuard>
    );
  }

  const inputClasses = `
    w-full px-4 py-2.5 rounded-lg text-sm
    border border-[var(--color-gray-200)]
    bg-white text-[var(--color-gray-700)]
    placeholder:text-[var(--color-gray-400)]
    focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/20
    focus:border-[var(--color-primary-500)]
    transition-all
  `;

  return (
    <AdminGuard>
      <div className='max-w-3xl mx-auto space-y-6'>
        {/* Page Header */}
        <div className='flex items-center gap-3'>
          <Link
            href='/dashboard/admin/usuarios'
            className='p-2 -ml-2 rounded-lg text-[var(--color-gray-500)] hover:text-[var(--color-gray-700)] hover:bg-[var(--color-gray-100)] transition-colors'
            aria-label='Voltar'
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className='text-2xl font-heading font-bold text-[var(--color-gray-900)]'>
              {t('EditUser')}
            </h1>
            <p className='text-[var(--color-gray-500)]'>
              Atualize os dados do usuário
            </p>
          </div>
        </div>

        {/* Success/Error Messages */}
        {message.text && (
          <div
            className={`
            p-4 rounded-lg border animate-fade-in-down flex items-center gap-3
            ${
              message.type === 'success'
                ? 'bg-[var(--color-success-bg)] border-[var(--color-accent-emerald)]/20 text-[var(--color-accent-emerald)]'
                : 'bg-[var(--color-error-bg)] border-[var(--color-accent-rose)]/20 text-[var(--color-accent-rose)]'
            }
          `}
          >
            {message.type === 'success' ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Basic Info Card */}
          <Card variant='default' padding={false}>
            <div className='p-5 border-b border-[var(--color-gray-100)]'>
              <div className='flex items-center gap-2'>
                <User size={18} className='text-[var(--color-primary-600)]' />
                <h2 className='font-semibold text-[var(--color-gray-900)]'>
                  Informações Básicas
                </h2>
              </div>
            </div>
            <div className='p-5 grid grid-cols-1 md:grid-cols-2 gap-5'>
              {/* Nome */}
              <div className='md:col-span-2'>
                <label className='flex items-center gap-2 text-sm font-medium text-[var(--color-gray-700)] mb-2'>
                  <User size={14} className='text-[var(--color-gray-400)]' />
                  {t('NameRequired')}
                </label>
                <input
                  type='text'
                  name='nome'
                  value={form.nome}
                  onChange={handleChange}
                  placeholder='Nome completo'
                  className={inputClasses}
                />
              </div>

              {/* Nome Fantasia */}
              <div className='md:col-span-2'>
                <label className='flex items-center gap-2 text-sm font-medium text-[var(--color-gray-700)] mb-2'>
                  <Building2
                    size={14}
                    className='text-[var(--color-gray-400)]'
                  />
                  {t('TradeName')}
                </label>
                <input
                  type='text'
                  name='nome_fantasia'
                  value={form.nome_fantasia}
                  onChange={handleChange}
                  placeholder='Nome fantasia ou empresa'
                  className={inputClasses}
                />
              </div>

              {/* Email */}
              <div>
                <label className='flex items-center gap-2 text-sm font-medium text-[var(--color-gray-700)] mb-2'>
                  <Mail size={14} className='text-[var(--color-gray-400)]' />
                  {t('Email')} *
                </label>
                <input
                  type='email'
                  name='email'
                  value={form.email}
                  onChange={handleChange}
                  placeholder='usuario@email.com'
                  className={inputClasses}
                />
              </div>

              {/* Telefone */}
              <div>
                <label className='flex items-center gap-2 text-sm font-medium text-[var(--color-gray-700)] mb-2'>
                  <Phone size={14} className='text-[var(--color-gray-400)]' />
                  {t('Phone')}
                </label>
                <input
                  type='tel'
                  name='telefone'
                  value={form.telefone}
                  onChange={handleChange}
                  placeholder='(00) 00000-0000'
                  className={inputClasses}
                />
              </div>

              {/* CNPJ */}
              <div>
                <label className='flex items-center gap-2 text-sm font-medium text-[var(--color-gray-700)] mb-2'>
                  <FileText
                    size={14}
                    className='text-[var(--color-gray-400)]'
                  />
                  {t('CNPJ')}
                </label>
                <input
                  type='text'
                  name='cnpj'
                  value={form.cnpj}
                  onChange={handleChange}
                  placeholder='00.000.000/0000-00'
                  className={inputClasses}
                />
              </div>
            </div>
          </Card>

          {/* Address Card */}
          <Card variant='default' padding={false}>
            <div className='p-5 border-b border-[var(--color-gray-100)]'>
              <div className='flex items-center gap-2'>
                <MapPin size={18} className='text-[var(--color-accent-blue)]' />
                <h2 className='font-semibold text-[var(--color-gray-900)]'>
                  Endereço
                </h2>
              </div>
            </div>
            <div className='p-5 grid grid-cols-1 md:grid-cols-2 gap-5'>
              {/* Logradouro */}
              <div className='md:col-span-2'>
                <label className='flex items-center gap-2 text-sm font-medium text-[var(--color-gray-700)] mb-2'>
                  <MapPin size={14} className='text-[var(--color-gray-400)]' />
                  {t('Street')}
                </label>
                <input
                  type='text'
                  name='logradouro'
                  value={form.logradouro}
                  onChange={handleChange}
                  placeholder='Rua, Avenida...'
                  className={inputClasses}
                />
              </div>

              {/* Número */}
              <div>
                <label className='flex items-center gap-2 text-sm font-medium text-[var(--color-gray-700)] mb-2'>
                  <Hash size={14} className='text-[var(--color-gray-400)]' />
                  {t('Number')}
                </label>
                <input
                  type='text'
                  name='numero'
                  value={form.numero}
                  onChange={handleChange}
                  placeholder='Nº'
                  className={inputClasses}
                />
              </div>

              {/* Complemento */}
              <div>
                <label className='flex items-center gap-2 text-sm font-medium text-[var(--color-gray-700)] mb-2'>
                  {t('Complement')}
                </label>
                <input
                  type='text'
                  name='complemento'
                  value={form.complemento}
                  onChange={handleChange}
                  placeholder='Apto, Sala...'
                  className={inputClasses}
                />
              </div>

              {/* Cidade */}
              <div>
                <label className='flex items-center gap-2 text-sm font-medium text-[var(--color-gray-700)] mb-2'>
                  {t('City')}
                </label>
                <input
                  type='text'
                  name='cidade'
                  value={form.cidade}
                  onChange={handleChange}
                  placeholder='Cidade'
                  className={inputClasses}
                />
              </div>

              {/* País */}
              <div>
                <label className='flex items-center gap-2 text-sm font-medium text-[var(--color-gray-700)] mb-2'>
                  <Globe size={14} className='text-[var(--color-gray-400)]' />
                  {t('Country2')}
                </label>
                <input
                  type='text'
                  name='pais'
                  value={form.pais}
                  onChange={handleChange}
                  placeholder='País'
                  className={inputClasses}
                />
              </div>
            </div>
          </Card>

          {/* Role Selection Card */}
          <Card variant='default' padding={false}>
            <div className='p-5 border-b border-[var(--color-gray-100)]'>
              <div className='flex items-center gap-2'>
                <Shield
                  size={18}
                  className='text-[var(--color-accent-amber)]'
                />
                <h2 className='font-semibold text-[var(--color-gray-900)]'>
                  {t('Role')} *
                </h2>
              </div>
            </div>
            <div className='p-5'>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                {papeis.map((p) => {
                  const Icon = p.icon;
                  const isSelected = form.papel === p.value;
                  return (
                    <button
                      key={p.value}
                      type='button'
                      onClick={() => setForm({ ...form, papel: p.value })}
                      className={`
                        p-4 rounded-xl border-2 text-center transition-all
                        ${
                          isSelected
                            ? ''
                            : 'border-[var(--color-gray-200)] hover:border-[var(--color-gray-300)] bg-white'
                        }
                      `}
                      style={
                        isSelected
                          ? {
                              borderColor:
                                p.color === 'rose'
                                  ? 'rgb(244 63 94)'
                                  : p.color === 'blue'
                                    ? 'rgb(59 130 246)'
                                    : p.color === 'amber'
                                      ? 'rgb(245 158 11)'
                                      : 'rgb(16 185 129)',
                              backgroundColor:
                                p.color === 'rose'
                                  ? 'rgb(255 241 242)'
                                  : p.color === 'blue'
                                    ? 'rgb(239 246 255)'
                                    : p.color === 'amber'
                                      ? 'rgb(255 251 235)'
                                      : 'rgb(236 253 245)',
                            }
                          : {}
                      }
                    >
                      <div className='flex flex-col items-center gap-2'>
                        <div
                          className={`
                          w-10 h-10 rounded-lg flex items-center justify-center mx-auto
                          ${isSelected ? '' : 'bg-[var(--color-gray-100)]'}
                        `}
                          style={
                            isSelected
                              ? {
                                  backgroundColor:
                                    p.color === 'rose'
                                      ? 'rgb(254 205 211)'
                                      : p.color === 'blue'
                                        ? 'rgb(191 219 254)'
                                        : p.color === 'amber'
                                          ? 'rgb(253 230 138)'
                                          : 'rgb(167 243 208)',
                                }
                              : {}
                          }
                        >
                          <Icon
                            size={20}
                            className={
                              isSelected ? '' : 'text-[var(--color-gray-500)]'
                            }
                            style={
                              isSelected
                                ? {
                                    color:
                                      p.color === 'rose'
                                        ? 'rgb(190 18 60)'
                                        : p.color === 'blue'
                                          ? 'rgb(29 78 216)'
                                          : p.color === 'amber'
                                            ? 'rgb(180 83 9)'
                                            : 'rgb(4 120 87)',
                                  }
                                : {}
                            }
                          />
                        </div>
                        <p
                          className={`text-sm font-medium ${isSelected ? 'text-[var(--color-gray-900)]' : 'text-[var(--color-gray-600)]'}`}
                        >
                          {p.label}
                        </p>
                        {isSelected && (
                          <CheckCircle
                            size={14}
                            style={{
                              color:
                                p.color === 'rose'
                                  ? 'rgb(190 18 60)'
                                  : p.color === 'blue'
                                    ? 'rgb(29 78 216)'
                                    : p.color === 'amber'
                                      ? 'rgb(180 83 9)'
                                      : 'rgb(4 120 87)',
                            }}
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Form Actions */}
          <div className='flex gap-3 justify-end'>
            <Button
              type='button'
              variant='outline'
              onClick={() => router.push('/dashboard/admin/usuarios')}
            >
              Cancelar
            </Button>
            <Button type='submit' loading={saving} icon={Save}>
              {saving ? t('Saving') : t('SaveChanges')}
            </Button>
          </div>
        </form>
      </div>
    </AdminGuard>
  );
}
