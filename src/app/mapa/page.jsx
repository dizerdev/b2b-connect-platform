import MapaMundi from 'components/MapaMundi';

export default function HomePage() {
  const parceiros = [
    { nome: 'Brasil', x: '32%', y: '65%' },
    { nome: 'EUA', x: '22%', y: '35%' },
    { nome: 'Portugal', x: '46%', y: '28%' },
    { nome: 'China', x: '72%', y: '37%' },
  ];

  return (
    <main className='min-h-screen flex items-center justify-center bg-gray-100'>
      <MapaMundi parceiros={parceiros} />
    </main>
  );
}
