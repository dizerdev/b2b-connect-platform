'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import AdminGuard from 'components/AdminGuard';
import {
  ArrowLeft,
  MessageSquare,
  Mail,
  MailOpen,
  Clock,
  User,
  FolderOpen,
  Send,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Card, Badge, Button, Skeleton, Avatar } from 'components/ui';

export default function DetalhesMensagemAdminPage() {
  const t = useTranslations('DashboardAdmin');
  const { mid } = useParams();
  const [mensagem, setMensagem] = useState(null);
  const [resposta, setResposta] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function fetchMensagem() {
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/mensagens/${mid}`);
        if (!res.ok) throw new Error(t('ErrorLoadingData'));
        const data = await res.json();
        setMensagem(data);
        if (data.resposta) setResposta(data.resposta);
      } catch (err) {
        console.error(err);
        setError(t('ErrorLoadingData'));
      } finally {
        setLoading(false);
      }
    }
    fetchMensagem();
  }, [mid, t]);

  async function handleResponder() {
    if (!resposta.trim()) return;
    setSending(true);
    setError('');
    try {
      const res = await fetch(`/api/v1/mensagens/${mid}/responder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resposta }),
      });
      if (!res.ok) throw new Error(t('ErrorSendingResponse'));
      const data = await res.json();
      setMensagem({
        ...mensagem,
        status: 'respondida',
        resposta: data.resposta,
        resposta_data_hora: data.resposta_data_hora,
      });
      setSuccess(t('ResponseSent') || 'Resposta enviada com sucesso!');
    } catch (err) {
      console.error(err);
      setError(t('ErrorSendingResponse'));
    } finally {
      setSending(false);
    }
  }

  // Loading State
  if (loading) {
    return (
      <AdminGuard>
        <div className='space-y-6'>
          {/* Header Skeleton */}
          <div className='flex items-center gap-3'>
            <Skeleton variant='circular' width='40px' height='40px' />
            <div className='space-y-2'>
              <Skeleton variant='text' width='200px' height='28px' />
              <Skeleton variant='text' width='150px' />
            </div>
          </div>

          {/* Content Skeleton */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <div className='lg:col-span-2 space-y-4'>
              <Card padding={false}>
                <div className='p-5 space-y-4'>
                  <Skeleton variant='text' width='100%' />
                  <Skeleton variant='text' width='80%' />
                  <Skeleton variant='text' width='60%' />
                </div>
              </Card>
              <Card padding={false}>
                <div className='p-5 space-y-4'>
                  <Skeleton
                    variant='rectangular'
                    width='100%'
                    height='120px'
                    className='rounded-lg'
                  />
                </div>
              </Card>
            </div>
            <div>
              <Card padding={false}>
                <div className='p-5 space-y-3'>
                  <Skeleton variant='text' width='60%' />
                  <Skeleton variant='text' width='80%' />
                  <Skeleton variant='text' width='70%' />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </AdminGuard>
    );
  }

  // Error State
  if (error && !mensagem) {
    return (
      <AdminGuard>
        <div className='space-y-6'>
          <div className='flex items-center gap-3'>
            <Link
              href='/dashboard/admin/mensagens'
              className='p-2 -ml-2 rounded-lg text-[var(--color-gray-500)] hover:text-[var(--color-gray-700)] hover:bg-[var(--color-gray-100)] transition-colors'
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className='text-2xl font-heading font-bold text-[var(--color-gray-900)]'>
              {t('MessageDetails')}
            </h1>
          </div>
          <Card className='border-[var(--color-accent-rose)]/20 bg-[var(--color-error-bg)]'>
            <div className='flex items-center gap-3 text-[var(--color-accent-rose)]'>
              <AlertCircle size={24} />
              <div>
                <p className='font-medium'>{t('ErrorLoadingData')}</p>
                <p className='text-sm opacity-80'>{error}</p>
              </div>
            </div>
          </Card>
        </div>
      </AdminGuard>
    );
  }

  if (!mensagem) return null;

  return (
    <AdminGuard>
      <div className='space-y-6'>
        {/* Page Header */}
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div>
            <div className='flex items-center gap-3 mb-1'>
              <Link
                href='/dashboard/admin/mensagens'
                className='p-2 -ml-2 rounded-lg text-[var(--color-gray-500)] hover:text-[var(--color-gray-700)] hover:bg-[var(--color-gray-100)] transition-colors'
                aria-label='Voltar'
              >
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className='text-2xl font-heading font-bold text-[var(--color-gray-900)]'>
                  Conversa com {mensagem.lojista_nome}
                </h1>
                <div className='flex items-center gap-2 mt-1'>
                  {mensagem.status === 'nova' ? (
                    <Badge variant='error' size='sm' dot>
                      <Mail size={12} className='mr-1' />
                      Nova
                    </Badge>
                  ) : (
                    <Badge variant='success' size='sm' dot>
                      <MailOpen size={12} className='mr-1' />
                      Respondida
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className='p-4 rounded-lg border animate-fade-in-down bg-[var(--color-success-bg)] border-[var(--color-accent-emerald)]/20 text-[var(--color-accent-emerald)]'>
            <div className='flex items-center gap-2'>
              <CheckCircle size={18} />
              {success}
            </div>
          </div>
        )}
        {error && mensagem && (
          <div className='p-4 rounded-lg border animate-fade-in-down bg-[var(--color-error-bg)] border-[var(--color-accent-rose)]/20 text-[var(--color-accent-rose)]'>
            <div className='flex items-center gap-2'>
              <AlertCircle size={18} />
              {error}
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Left Column - Conversation */}
          <div className='lg:col-span-2 space-y-4'>
            {/* Original Message - Chat Bubble Style */}
            <Card variant='default' padding={false}>
              <div className='p-5 border-b border-[var(--color-gray-100)]'>
                <div className='flex items-center gap-2'>
                  <MessageSquare
                    size={18}
                    className='text-[var(--color-primary-600)]'
                  />
                  <h2 className='font-semibold text-[var(--color-gray-900)]'>
                    Conversa
                  </h2>
                </div>
              </div>
              <div className='p-5 space-y-4'>
                {/* Lojista Message */}
                <div className='flex gap-3'>
                  <Avatar name={mensagem.lojista_nome} size='sm' />
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-1'>
                      <span className='font-medium text-[var(--color-gray-900)]'>
                        {mensagem.lojista_nome}
                      </span>
                      <span className='text-xs text-[var(--color-gray-400)]'>
                        {new Date(mensagem.created_at).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className='bg-[var(--color-gray-100)] rounded-2xl rounded-tl-sm p-4'>
                      <p className='text-[var(--color-gray-700)] whitespace-pre-wrap'>
                        {mensagem.mensagem}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Admin Response */}
                {mensagem.resposta && (
                  <div className='flex gap-3 justify-end'>
                    <div className='flex-1 max-w-[80%]'>
                      <div className='flex items-center gap-2 mb-1 justify-end'>
                        <span className='text-xs text-[var(--color-gray-400)]'>
                          {mensagem.resposta_data_hora &&
                            new Date(
                              mensagem.resposta_data_hora,
                            ).toLocaleString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                        </span>
                        <span className='font-medium text-[var(--color-gray-900)]'>
                          Você
                        </span>
                      </div>
                      <div className='bg-[var(--color-primary-600)] rounded-2xl rounded-tr-sm p-4'>
                        <p className='text-white whitespace-pre-wrap'>
                          {mensagem.resposta}
                        </p>
                      </div>
                    </div>
                    <Avatar
                      name='Admin'
                      size='sm'
                      className='bg-[var(--color-primary-500)]'
                    />
                  </div>
                )}
              </div>
            </Card>

            {/* Response Form */}
            {!mensagem.resposta && (
              <Card variant='default' padding={false}>
                <div className='p-5 border-b border-[var(--color-gray-100)]'>
                  <div className='flex items-center gap-2'>
                    <Send
                      size={18}
                      className='text-[var(--color-accent-blue)]'
                    />
                    <h2 className='font-semibold text-[var(--color-gray-900)]'>
                      Responder
                    </h2>
                  </div>
                </div>
                <div className='p-5'>
                  <textarea
                    value={resposta}
                    onChange={(e) => setResposta(e.target.value)}
                    rows={4}
                    className='
                      w-full px-4 py-3 rounded-xl
                      border border-[var(--color-gray-200)]
                      bg-white text-[var(--color-gray-700)]
                      placeholder:text-[var(--color-gray-400)]
                      focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/20
                      focus:border-[var(--color-primary-500)]
                      transition-all resize-none
                    '
                    placeholder='Digite sua resposta aqui...'
                  />
                  <div className='flex justify-end mt-4'>
                    <Button
                      icon={Send}
                      onClick={handleResponder}
                      loading={sending}
                      disabled={!resposta.trim()}
                    >
                      Enviar resposta
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Details */}
          <div className='space-y-6'>
            {/* Info Card */}
            <Card variant='default' padding={false}>
              <div className='p-5 border-b border-[var(--color-gray-100)]'>
                <div className='flex items-center gap-2'>
                  <User size={18} className='text-[var(--color-primary-600)]' />
                  <h2 className='font-semibold text-[var(--color-gray-900)]'>
                    Informações
                  </h2>
                </div>
              </div>
              <div className='p-5 space-y-4'>
                {/* Lojista */}
                <div className='flex items-start gap-3'>
                  <div className='w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0'>
                    <User size={16} className='text-blue-600' />
                  </div>
                  <div>
                    <p className='text-xs text-[var(--color-gray-500)] uppercase tracking-wide'>
                      Lojista
                    </p>
                    <p className='font-medium text-[var(--color-gray-800)]'>
                      {mensagem.lojista_nome}
                    </p>
                  </div>
                </div>

                {/* Catálogo */}
                <div className='flex items-start gap-3'>
                  <div className='w-8 h-8 rounded-lg bg-[var(--color-primary-50)] flex items-center justify-center flex-shrink-0'>
                    <FolderOpen
                      size={16}
                      className='text-[var(--color-primary-600)]'
                    />
                  </div>
                  <div>
                    <p className='text-xs text-[var(--color-gray-500)] uppercase tracking-wide'>
                      Catálogo
                    </p>
                    <p className='font-medium text-[var(--color-gray-800)]'>
                      {mensagem.catalogo_nome}
                    </p>
                  </div>
                </div>

                {/* Recebida em */}
                <div className='flex items-start gap-3'>
                  <div className='w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0'>
                    <Clock size={16} className='text-emerald-600' />
                  </div>
                  <div>
                    <p className='text-xs text-[var(--color-gray-500)] uppercase tracking-wide'>
                      Recebida em
                    </p>
                    <p className='font-medium text-[var(--color-gray-800)]'>
                      {new Date(mensagem.created_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>

                {/* Respondida em */}
                {mensagem.resposta_data_hora && (
                  <div className='flex items-start gap-3'>
                    <div className='w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0'>
                      <CheckCircle size={16} className='text-amber-600' />
                    </div>
                    <div>
                      <p className='text-xs text-[var(--color-gray-500)] uppercase tracking-wide'>
                        Respondida em
                      </p>
                      <p className='font-medium text-[var(--color-gray-800)]'>
                        {new Date(mensagem.resposta_data_hora).toLocaleString(
                          'pt-BR',
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Status Card */}
            <Card
              className={`border-0 ${
                mensagem.status === 'nova'
                  ? 'bg-gradient-to-br from-amber-500 to-amber-600'
                  : 'bg-gradient-to-br from-emerald-500 to-emerald-600'
              } text-white`}
            >
              <div className='flex items-center gap-3 mb-2'>
                <div className='w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center'>
                  {mensagem.status === 'nova' ? (
                    <Mail size={20} />
                  ) : (
                    <MailOpen size={20} />
                  )}
                </div>
                <div>
                  <p className='text-white/80 text-sm'>Status</p>
                  <p className='font-bold'>
                    {mensagem.status === 'nova'
                      ? 'Aguardando resposta'
                      : 'Respondida'}
                  </p>
                </div>
              </div>
              {mensagem.status === 'nova' && (
                <p className='text-white/90 text-sm'>
                  Esta mensagem ainda não foi respondida.
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
