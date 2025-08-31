import CatalogoCard from 'components/shared/CatalogoCard';
import Link from 'next/link';

export default function Section({ title, data, filter }) {
  if (!data || data.length === 0) return null;
  return (
    <div className='mt-10 min-w-[70vw]'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-semibold'>{title}</h2>
        <Link
          href={`/dashboard/lojista/vitrines/principal?${filter}`}
          className='text-blue-500 hover:underline'
        >
          Ver mais →
        </Link>
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
        {data.slice(0, 4).map((catalogo) => (
          <CatalogoCard key={catalogo.id} catalogo={catalogo} compact />
        ))}
      </div>
    </div>
  );
}
