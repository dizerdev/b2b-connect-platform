import MapaMundi from 'components/MapaMundi';

export default function HomePage() {
  const parceiros = [
    { nome: 'Canadá', x: '20%', y: '24%' },
    { nome: 'Nova York', x: '27.5%', y: '33%' },
    { nome: 'Miami', x: '26.5%', y: '43.5%' },
    { nome: 'México', x: '22%', y: '48%' },
    { nome: 'Buenos Aires', x: '31.5%', y: '80%' },
    { nome: 'São Paulo', x: '34%', y: '74%' },
    { nome: 'Casablanca', x: '43.8%', y: '39%' },
    { nome: 'Milão', x: '48%', y: '30%' },
    { nome: 'Cairo', x: '52.8%', y: '41%' },
    { nome: 'Johannesburg', x: '52%', y: '72.9%' },
    { nome: 'New Delphi', x: '63.5%', y: '43%' },
    { nome: 'Bangladesh', x: '66.7%', y: '45%' },
    { nome: 'Wenzhou', x: '73.5%', y: '42%' },
    { nome: 'Guangzhou', x: '72%', y: '45%' },
    { nome: 'Austrália', x: '78%', y: '82%' },
  ];

  return (
    <main className='min-h-[50vh] sm:min-h-[70vh] flex items-center justify-center bg-gray-100'>
      <MapaMundi parceiros={parceiros} />
    </main>
  );
}
