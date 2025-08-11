// app/mapa/layout.tsx
import Link from 'next/link';
import Image from 'next/image';

const marcas = [
  { src: '/logos/marca1.png', alt: 'Marca 1' },
  { src: '/logos/marca2.png', alt: 'Marca 2' },
  { src: '/logos/marca3.png', alt: 'Marca 3' },
  { src: '/logos/marca4.png', alt: 'Marca 4' },
  // adicione mais...
];

export default function MapaLayout({ children }) {
  return (
    <div className='flex min-h-screen flex-col'>
      {/* Header */}
      <header className='flex items-center justify-between bg-gray-900 px-6 py-4 text-white'>
        <h1 className='text-lg font-bold'>Plataforma</h1>
        <Link
          href='/login'
          className='rounded bg-white px-4 py-2 text-gray-900 hover:bg-gray-200'
        >
          Login
        </Link>
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
              height={50}
              className='object-contain'
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className='bg-gray-900 px-6 py-4 text-sm text-white'>
        <div className='flex flex-col items-center space-y-2 sm:flex-row sm:justify-between sm:space-y-0'>
          <span>&copy; {new Date().getFullYear()} Plataforma</span>
          <div className='flex space-x-4'>
            <Link href='/contato'>Contato</Link>
            <Link href='/suporte'>Suporte</Link>
            <Link href='/sobre'>Sobre</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
