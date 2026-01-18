'use client';

import Image from 'next/image';
import Button from './Button';

/**
 * EmptyState Component
 *
 * Features: Illustration, title, description, CTA button
 */

// Illustration paths
const ILLUSTRATIONS = {
  cart: '/illustrations/empty-cart.svg',
  results: '/illustrations/no-results.svg',
  favorites: '/illustrations/no-favorites.svg',
  messages: '/illustrations/no-messages.svg',
  welcome: '/illustrations/welcome.svg',
};

export default function EmptyState({
  illustration,
  illustrationType, // 'cart', 'results', 'favorites', 'messages', 'welcome'
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
  onAction,
  actionHref,
  size = 'md', // sm, md, lg
  className = '',
  ...props
}) {
  const sizes = {
    sm: { image: 'w-32 h-32', padding: 'py-8 px-4' },
    md: { image: 'w-48 h-48', padding: 'py-12 px-6' },
    lg: { image: 'w-64 h-64', padding: 'py-16 px-8' },
  };

  const sizeConfig = sizes[size];
  const illustrationSrc =
    illustration || (illustrationType && ILLUSTRATIONS[illustrationType]);

  return (
    <div
      className={`
        flex flex-col items-center justify-center
        ${sizeConfig.padding}
        text-center
        animate-fade-in
        ${className}
      `}
      {...props}
    >
      {/* Illustration or Icon */}
      {illustrationSrc ? (
        <Image
          src={illustrationSrc}
          alt=''
          width={192}
          height={192}
          className={`${sizeConfig.image} mb-6 opacity-90`}
        />
      ) : Icon ? (
        <div
          className='
          w-20 h-20 mb-6
          flex items-center justify-center
          rounded-full
          bg-gradient-to-br from-[var(--color-gray-100)] to-[var(--color-gray-200)]
          text-[var(--color-gray-400)]
        '
        >
          <Icon className='w-10 h-10' />
        </div>
      ) : (
        // Default illustration placeholder
        <div
          className='
          w-48 h-32 mb-6
          flex items-center justify-center
          rounded-[var(--radius-xl)]
          bg-gradient-to-br from-[var(--color-gray-100)] to-[var(--color-gray-200)]
        '
        >
          <svg
            className='w-16 h-16 text-[var(--color-gray-300)]'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={1}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
            />
          </svg>
        </div>
      )}

      {/* Title */}
      {title && (
        <h3
          className='
          text-lg font-semibold
          text-[var(--color-gray-900)]
          mb-2
        '
        >
          {title}
        </h3>
      )}

      {/* Description */}
      {description && (
        <p
          className='
          text-[var(--color-gray-500)]
          max-w-sm
          mb-6
          leading-relaxed
        '
        >
          {description}
        </p>
      )}

      {/* Action Button */}
      {(action || actionLabel) && (onAction || actionHref) && (
        <Button onClick={onAction} href={actionHref} variant='primary'>
          {action || actionLabel}
        </Button>
      )}
    </div>
  );
}

// Preset empty states with illustrations
EmptyState.NoResults = function NoResults({ searchTerm, onClear }) {
  return (
    <EmptyState
      illustrationType='results'
      title='Nenhum resultado encontrado'
      description={
        searchTerm
          ? `Não encontramos resultados para "${searchTerm}". Tente buscar com outros termos.`
          : 'Não encontramos nenhum item correspondente aos filtros aplicados.'
      }
      action={onClear ? 'Limpar filtros' : undefined}
      onAction={onClear}
    />
  );
};

EmptyState.NoData = function NoData({
  itemType = 'itens',
  onCreate,
  createHref,
}) {
  return (
    <EmptyState
      illustrationType='cart'
      title={`Nenhum ${itemType} cadastrado`}
      description={`Você ainda não possui ${itemType}. Comece criando o primeiro agora.`}
      action={onCreate || createHref ? `Criar ${itemType}` : undefined}
      onAction={onCreate}
      actionHref={createHref}
    />
  );
};

EmptyState.NoFavorites = function NoFavorites({ onExplore, exploreHref }) {
  return (
    <EmptyState
      illustrationType='favorites'
      title='Nenhum favorito'
      description='Você ainda não salvou nenhum item como favorito. Explore os catálogos e salve seus produtos preferidos.'
      action={onExplore || exploreHref ? 'Explorar catálogos' : undefined}
      onAction={onExplore}
      actionHref={exploreHref}
    />
  );
};

EmptyState.NoMessages = function NoMessages() {
  return (
    <EmptyState
      illustrationType='messages'
      title='Nenhuma mensagem'
      description='Você não possui mensagens. As mensagens de interesse que você enviar aparecerão aqui.'
    />
  );
};

EmptyState.NoCatalogs = function NoCatalogs({ onCreate, createHref }) {
  return (
    <EmptyState
      illustrationType='cart'
      title='Nenhum catálogo encontrado'
      description='Você ainda não possui catálogos. Crie seu primeiro catálogo para começar a exibir seus produtos.'
      action={onCreate || createHref ? 'Criar catálogo' : undefined}
      onAction={onCreate}
      actionHref={createHref}
    />
  );
};

EmptyState.NoProducts = function NoProducts({ onCreate, createHref }) {
  return (
    <EmptyState
      illustrationType='cart'
      title='Nenhum produto cadastrado'
      description='Você ainda não possui produtos. Adicione produtos para exibi-los em seus catálogos.'
      action={onCreate || createHref ? 'Adicionar produto' : undefined}
      onAction={onCreate}
      actionHref={createHref}
    />
  );
};

EmptyState.Welcome = function Welcome({ userName, onStart, startHref }) {
  return (
    <EmptyState
      illustrationType='welcome'
      title={userName ? `Bem-vindo, ${userName}!` : 'Bem-vindo!'}
      description='Explore fornecedores do mundo todo e encontre os melhores produtos para o seu negócio.'
      action={onStart || startHref ? 'Começar a explorar' : undefined}
      onAction={onStart}
      actionHref={startHref}
    />
  );
};
