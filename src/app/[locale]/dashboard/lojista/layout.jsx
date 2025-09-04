'use client';

import Link from 'next/link';
import Image from 'next/image';
import LogoutButton from 'components/ui/auth/LogoutButton';
import WhatsappButton from 'components/shared/WhatsappButton';
import Carousel from 'components/shared/Carousel';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import Loader from 'components/shared/Loader';

const navLinks = [
  { href: '/dashboard/lojista', label: 'Home' },
  { href: '/dashboard/lojista/vitrines/principal', label: 'Pesquisar' },
  { href: '/dashboard/lojista/mensagens', label: 'Mensagens' },
];

const produtos = [
  {
    nome: 'Tênis Air Max',
    status: 'Disponível',
    rating: 4.5,
    criadoEm: '2025-08-30T10:00:00Z',
  },
  {
    nome: 'Botas Classic',
    status: 'Indisponível',
    rating: 3.8,
    criadoEm: '2025-08-28T15:30:00Z',
  },
  {
    nome: 'Sandália Summer',
    status: 'Disponível',
    rating: 4.0,
    criadoEm: '2025-08-29T09:15:00Z',
  },
  {
    nome: 'Tênis Runner',
    status: 'Disponível',
    rating: 5,
    criadoEm: '2025-08-27T12:45:00Z',
  },
];

const marcas = [
  { src: '/assets/logos/logo_palm_springs.jpg', alt: 'Palm Springs' },
  { src: '/assets/logos/logo_akelian.png', alt: 'Akelian' },
  { src: '/assets/logos/shoesnetworld.png', alt: 'Shoesnetworld' },
  { src: '/assets/logos/logo_palm_springs.jpg', alt: 'Palm Springs' },
  { src: '/assets/logos/logo_akelian.png', alt: 'Akelian' },
  { src: '/assets/logos/logo_palm_springs.jpg', alt: 'Palm Springs' },
  { src: '/assets/logos/logo_akelian.png', alt: 'Akelian' },
  { src: '/assets/logos/shoesnetworld.png', alt: 'Shoesnetworld' },
  { src: '/assets/logos/logo_palm_springs.jpg', alt: 'Palm Springs' },
  { src: '/assets/logos/logo_akelian.png', alt: 'Akelian' },
  { src: '/assets/logos/logo_sneakers_brasil.png', alt: 'Sneakers Brasil' },
];

export default function DashboardLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className='flex min-h-screen flex-col'>
      {/* Header */}
      <header className='bg-gray-900 text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-center justify-between w-full sm:w-auto'>
          <div className='flex items-center space-x-4'>
            <Image
              src='/assets/logos/shoesnetworld.png'
              width={50}
              height={50}
              alt='Shoesnetworld Logo'
            />
            <h1 className='text-lg font-bold'>Shoesnetworld</h1>
            <Loader />
          </div>
          <button
            className='sm:hidden p-2'
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div
          className={`flex-col sm:flex-row sm:flex sm:items-center sm:justify-between w-full sm:w-auto mt-3 sm:mt-0 ${
            menuOpen ? 'flex' : 'hidden sm:flex'
          } gap-4`}
        >
          <nav className='flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center flex-1'>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className='text-white font-medium hover:text-blue-400 transition-colors duration-200'
                onClick={() => setMenuOpen(false)} // fecha menu ao clicar
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className='mt-2 sm:mt-0 flex items-center gap-4'>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className='flex-1 p-6 sm:py-1 sm:px-6 my-auto justify-items-center'>
        {children}
      </main>

      {/* Seção de cards */}
      <Carousel items={produtos} />

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

      {/* Whatsapp flutuante */}
      <WhatsappButton />

      {/* Footer */}
      <footer className='bg-gray-900 px-6 py-4 text-sm text-white'>
        <div className='flex flex-col items-center space-y-2 sm:flex-row sm:justify-between sm:space-y-0'>
          <span>&copy; {new Date().getFullYear()} Shoesnetworld</span>
          <div className='flex space-x-4'>
            <Link href='/public/contato'>Contato</Link>
            <Link href='/public/suporte'>Suporte</Link>
            <Link href='/public/sobre'>Sobre</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
