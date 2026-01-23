'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import AdminGuard from 'components/AdminGuard';
import {
  ArrowLeft,
  UserPlus,
  User,
  Building2,
  Mail,
  Lock,
  Shield,
  Briefcase,
  Store,
  UserCheck,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Card, Badge, Button } from 'components/ui';

export default function NovoUsuarioPage() {
  const t = useTranslations('DashboardAdmin');
  const router = useRouter();

  const [form, setForm] = useState({
    nome: '',
    nome_fantasia: '',
    email: '',
    senha: '',
    papel: '',
  });

  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMensagem(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem(null);

    // Validações simples no client
    if (!form.nome.trim())
      return setMensagem({ tipo: 'erro', texto: t('NameRequired2') });
    if (!form.nome_fantasia.trim())
      return setMensagem({
        tipo: 'erro',
        texto: t('TradeNameRequired'),
      });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return setMensagem({ tipo: 'erro', texto: t('InvalidEmail') });
    if (form.senha.length < 6)
      return setMensagem({
        tipo: 'erro',
        texto: t('PasswordMinLength'),
      });
    if (!papeis.find((p) => p.value === form.papel))
      return setMensagem({ tipo: 'erro', texto: t('InvalidRole') });

    try {
      setLoading(true);

      const res = await fetch('/api/v1/usuarios/novo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const erro = await res.json();
        throw new Error(erro.error || t('ErrorCreatingUser'));
      }

      setMensagem({ tipo: 'sucesso', texto: t('UserCreated') });

      setTimeout(() => {
        router.push('/dashboard/admin/usuarios');
      }, 1500);
    } catch (error) {
      setMensagem({ tipo: 'erro', texto: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminGuard>
      <div className='max-w-2xl mx-auto space-y-6'>
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
              {t('NewUser')}
            </h1>
            <p className='text-[var(--color-gray-500)]'>
              Preencha os dados para criar um novo usuário
            </p>
          </div>
        </div>

        {/* Success/Error Messages */}
        {mensagem && (
          <div
            className={`
            p-4 rounded-lg border animate-fade-in-down flex items-center gap-3
            ${
              mensagem.tipo === 'sucesso'
                ? 'bg-[var(--color-success-bg)] border-[var(--color-accent-emerald)]/20 text-[var(--color-accent-emerald)]'
                : 'bg-[var(--color-error-bg)] border-[var(--color-accent-rose)]/20 text-[var(--color-accent-rose)]'
            }
          `}
          >
            {mensagem.tipo === 'sucesso' ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span>{mensagem.texto}</span>
          </div>
        )}

        {/* Form Card */}
        <Card variant='default' padding={false}>
          <div className='p-5 border-b border-[var(--color-gray-100)]'>
            <div className='flex items-center gap-2'>
              <UserPlus size={18} className='text-[var(--color-primary-600)]' />
              <h2 className='font-semibold text-[var(--color-gray-900)]'>
                Dados do Usuário
              </h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className='p-5 space-y-5'>
            {/* Name Field */}
            <div>
              <label className='flex items-center gap-2 text-sm font-medium text-[var(--color-gray-700)] mb-2'>
                <User size={14} className='text-[var(--color-gray-400)]' />
                {t('Name')}
              </label>
              <input
                type='text'
                name='nome'
                value={form.nome}
                onChange={handleChange}
                placeholder='Nome completo'
                className='
                  w-full px-4 py-2.5 rounded-lg text-sm
                  border border-[var(--color-gray-200)]
                  bg-white text-[var(--color-gray-700)]
                  placeholder:text-[var(--color-gray-400)]
                  focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/20
                  focus:border-[var(--color-primary-500)]
                  transition-all
                '
              />
            </div>

            {/* Trade Name Field */}
            <div>
              <label className='flex items-center gap-2 text-sm font-medium text-[var(--color-gray-700)] mb-2'>
                <Building2 size={14} className='text-[var(--color-gray-400)]' />
                {t('TradeName')}
              </label>
              <input
                type='text'
                name='nome_fantasia'
                value={form.nome_fantasia}
                onChange={handleChange}
                placeholder='Nome fantasia ou empresa'
                className='
                  w-full px-4 py-2.5 rounded-lg text-sm
                  border border-[var(--color-gray-200)]
                  bg-white text-[var(--color-gray-700)]
                  placeholder:text-[var(--color-gray-400)]
                  focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/20
                  focus:border-[var(--color-primary-500)]
                  transition-all
                '
              />
            </div>

            {/* Email Field */}
            <div>
              <label className='flex items-center gap-2 text-sm font-medium text-[var(--color-gray-700)] mb-2'>
                <Mail size={14} className='text-[var(--color-gray-400)]' />
                {t('Email')}
              </label>
              <input
                type='email'
                name='email'
                value={form.email}
                onChange={handleChange}
                placeholder='usuario@email.com'
                className='
                  w-full px-4 py-2.5 rounded-lg text-sm
                  border border-[var(--color-gray-200)]
                  bg-white text-[var(--color-gray-700)]
                  placeholder:text-[var(--color-gray-400)]
                  focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/20
                  focus:border-[var(--color-primary-500)]
                  transition-all
                '
              />
            </div>

            {/* Password Field */}
            <div>
              <label className='flex items-center gap-2 text-sm font-medium text-[var(--color-gray-700)] mb-2'>
                <Lock size={14} className='text-[var(--color-gray-400)]' />
                {t('Password')}
              </label>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name='senha'
                  value={form.senha}
                  onChange={handleChange}
                  placeholder='Mínimo 6 caracteres'
                  className='
                    w-full px-4 py-2.5 pr-11 rounded-lg text-sm
                    border border-[var(--color-gray-200)]
                    bg-white text-[var(--color-gray-700)]
                    placeholder:text-[var(--color-gray-400)]
                    focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/20
                    focus:border-[var(--color-primary-500)]
                    transition-all
                  '
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-gray-400)] hover:text-[var(--color-gray-600)] transition-colors'
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className='flex items-center gap-2 text-sm font-medium text-[var(--color-gray-700)] mb-3'>
                <Shield size={14} className='text-[var(--color-gray-400)]' />
                {t('Role')}
              </label>
              <div className='grid grid-cols-2 gap-3'>
                {papeis.map((p) => {
                  const Icon = p.icon;
                  const isSelected = form.papel === p.value;
                  return (
                    <button
                      key={p.value}
                      type='button'
                      onClick={() => setForm({ ...form, papel: p.value })}
                      className={`
                        p-4 rounded-xl border-2 text-left transition-all
                        ${
                          isSelected
                            ? `border-${p.color}-500 bg-${p.color}-50`
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
                      <div className='flex items-center gap-3'>
                        <div
                          className={`
                          w-10 h-10 rounded-lg flex items-center justify-center
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
                        <div>
                          <p
                            className={`font-medium ${isSelected ? 'text-[var(--color-gray-900)]' : 'text-[var(--color-gray-700)]'}`}
                          >
                            {p.label}
                          </p>
                        </div>
                      </div>
                      {isSelected && (
                        <div className='mt-2'>
                          <CheckCircle
                            size={16}
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
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form Actions */}
            <div className='flex gap-3 pt-4 border-t border-[var(--color-gray-100)]'>
              <Button
                type='submit'
                loading={loading}
                icon={UserPlus}
                className='flex-1'
              >
                {loading ? t('Saving') : t('Save')}
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={() => router.push('/dashboard/admin/usuarios')}
              >
                {t('Cancel')}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AdminGuard>
  );
}
