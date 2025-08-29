'use client';
import { useTranslations } from 'next-intl';

export default function Loader() {
  const t = useTranslations('LoaderComponent');
  return (
    <div className='rounded-2xl px-8 pt-3 hidden md:block'>
      <div className='flex items-center text-neutral-200 font-medium text-xl rounded-lg h-10'>
        <p className='mb-3'>{t('HereYouCanFind')}</p>
        <div className='loader-words ml-2 h-10'>
          <span className='word'>{t('Footwear')}</span>
          <span className='word'>{t('Components')}</span>
          <span className='word'>{t('Leathers')}</span>
          <span className='word'>{t('Accessories')}</span>
          <span className='word'>{t('Machines')}</span>
          <span className='word'>{t('Chemicals')}</span>
        </div>
      </div>
    </div>
  );
}
