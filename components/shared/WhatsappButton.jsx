'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function WhatsappButton() {
  return (
    <Link
      href='https://wa.me/5511998369995' // <- substitua pelo número do WhatsApp
      target='_blank'
      rel='noopener noreferrer'
      className='fixed bottom-20 right-6 z-50'
    >
      <Image
        src='/icons/whatsapp.svg' // <- coloque seu ícone .png em public/assets/icons/
        alt='WhatsApp'
        width={60}
        height={60}
        className='rounded-40 shadow-lg hover:scale-110 active:scale-95 transition-transform cursor-pointer'
      />
    </Link>
  );
}
