// app/mapa/layout.tsx
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Loader from 'components/shared/Loader';
import FlipCardGroup from 'components/shared/FlipCardGroup';
import GradientButton from 'components/shared/GradientButton';
import WhatsappButton from 'components/shared/WhatsappButton';
import LanguageSwitcher from 'components/shared/LanguageSwitcher';

const marcas = [
  { src: '/assets/logos/logo_palm_springs.jpg', alt: 'Palm Springs' },
  { src: '/assets/logos/logo_akelian.png', alt: 'Akelian' },
  { src: '/assets/logos/shoesnetworld_old.png', alt: 'Shoesnetworld' },
  { src: '/assets/logos/logo_palm_springs.jpg', alt: 'Palm Springs' },
  { src: '/assets/logos/logo_akelian.png', alt: 'Akelian' },
  { src: '/assets/logos/logo_palm_springs.jpg', alt: 'Palm Springs' },
  { src: '/assets/logos/logo_akelian.png', alt: 'Akelian' },
  { src: '/assets/logos/shoesnetworld_old.png', alt: 'Shoesnetworld' },
  { src: '/assets/logos/logo_palm_springs.jpg', alt: 'Palm Springs' },
  { src: '/assets/logos/logo_akelian.png', alt: 'Akelian' },
  { src: '/assets/logos/logo_sneakers_brasil.png', alt: 'Sneakers Brasil' },
];

export default function MapaLayout({ children }) {
  const t = useTranslations('MapPage');
  return (
    <div className='flex min-h-screen flex-col'>
      {/* Header */}
      <header className='flex items-center justify-between bg-gray-900 px-6 py-4 text-white'>
        <div className='flex items-center'>
          <Link href='/public/mapa'>
            <Image
              src='/assets/logos/shoesnetworld.png'
              width={50}
              height={50}
              alt='Shoesnetworld Logo'
            />
          </Link>
          <h1 className='text-lg font-bold pl-5'>Shoesnetworld</h1>
          <Loader />
        </div>
        <div className='mt-2 sm:mt-0 flex items-center gap-4'>
          <LanguageSwitcher />
          <GradientButton text={t('Login')} href='/login' />
        </div>
      </header>

      {/* Conteúdo da página */}
      <main className='flex-1'>{children}</main>

      {/* Marcas em movimento lateral */}
      <div className='relative overflow-hidden bg-gray-100 py-4'>
        <div className='flex animate-marquee space-x-12'>
          {marcas.concat(marcas).map((marca, i) => (
            <Image
              key={i}
              src={marca.src}
              alt={marca.alt}
              width={100}
              height={100}
              className='object-contain'
            />
          ))}
        </div>
      </div>

      {/* Seção dos 3 cards */}
      <FlipCardGroup />

      <WhatsappButton />

      {/* Footer */}
      <footer className='bg-gray-900 px-6 py-4 text-sm text-white'>
        <div className='flex flex-col items-center space-y-2 sm:flex-row sm:justify-between sm:space-y-0'>
          <span>
            &copy; {new Date().getFullYear()} {t('Owner')}
          </span>
          <div className='flex space-x-4'>
            <Link href='/public/contato'>{t('Contact')}</Link>
            <Link href='/public/suporte'>{t('Support')}</Link>
            <Link href='/public/sobre'>{t('About')}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
