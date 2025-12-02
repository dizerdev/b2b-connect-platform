// app/mapa/layout.tsx
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Loader from 'components/shared/Loader';
import FlipCardGroup from 'components/shared/FlipCardGroup';
import GradientButton from 'components/shared/GradientButton';
import WhatsappButton from 'components/shared/WhatsappButton';
import LanguageSwitcher from 'components/shared/LanguageSwitcher';
import Banner from 'components/shared/Banner';

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
  { src: '/assets/logos/logo_akelian.png', alt: 'AkeliBronzean' },
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
          <a
            href='https://calçadistabrasil.com.br/'
            className='text-white font-medium hover:text-blue-400 transition-colors duration-200'
            target='_blank'
          >
            {t('InternationalGallery')}
          </a>
          <LanguageSwitcher />
          <GradientButton text={t('Login')} href='/login' />
        </div>
      </header>

      {/* Conteúdo da página */}
      <main className='flex-1'>{children}</main>

      <Banner
        src='https://nu6xzmkg6n.ufs.sh/f/1BGrcyVEf97rL7lWbfypeDObSrsz9Gj7H2NZQFkIxgfPCUyT'
        alt='Catálogo X'
      />

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
