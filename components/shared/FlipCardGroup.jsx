'use client';

import FlipCard from './FlipCard';
import { useTranslations } from 'next-intl';

export default function FlipCardGroup() {
  const t = useTranslations('FlipCardGroup');
  const cards = [
    { front: t('MonthlyPlan'), back: t('MonthlyPrice') },
    {
      front: t('AnnualPlan'),
      back: t('AnnualPrice'),
    },
    {
      front: t('AnnualPlan'),
      back: t('AnnualPrice'),
    },
  ];

  return (
    <div className='py-10 bg-gray-800'>
      <h1 className='flex justify-center text-xl font-bold pl-5 text-white'>
        {t('BeASubscriber')}
      </h1>
      <div className='max-w-6xl mx-auto px-4 grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2'>
        {cards.map((card, index) => (
          <FlipCard key={index} front={card.front} back={card.back} />
        ))}
      </div>
      <h3 className='flex justify-center text-lg font-bold pl-5 text-white'>
        {t('FullAccess')}
      </h3>
    </div>
  );
}
