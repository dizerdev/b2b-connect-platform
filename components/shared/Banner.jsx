'use client';

import React from 'react';

export default function Banner({ src, alt = 'Banner' }) {
  if (!src) return null;

  return (
    <div className='w-full h-64 md:h-80 lg:h-96 relative overflow-hidden rounded-2xl shadow-md'>
      <img src={src} alt={alt} className='w-full h-full object-cover' />
      <div className='absolute inset-0 bg-black/20' />
    </div>
  );
}
