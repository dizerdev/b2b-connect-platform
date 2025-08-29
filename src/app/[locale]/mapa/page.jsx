import MapaMundi from 'components/MapaMundi';

export default function HomePage() {
  const parceiros = [
    { nome: 'Brasil', x: '36%', y: '73%' },
    { nome: 'EUA', x: '28%', y: '42%' },
    { nome: 'Portugal', x: '50%', y: '40%' },
    { nome: 'China', x: '72%', y: '48%' },
  ];

  return (
    <main className='min-h-screen sm:min-h-[50vh] flex items-center justify-center bg-gray-100'>
      <MapaMundi parceiros={parceiros} />
    </main>
  );
}
