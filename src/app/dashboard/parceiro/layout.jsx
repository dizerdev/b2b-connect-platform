import LogoutButton from 'components/ui/auth/LogoutButton';
import Image from 'next/image';

export default function DashboardLayout({ children }) {
  return (
    <div className='min-h-screen flex flex-col'>
      <header className='bg-white shadow p-4 flex justify-between items-center'>
        <div className='flex items-center'>
          <Image
            src='/assets/logos/shoesnetworld.png'
            width={50}
            height={50}
            alt='Shoesnetworld Logo'
          />
          <h1 className='text-lg font-bold pl-5'>Shoesnetworld</h1>
        </div>
        <LogoutButton />
      </header>
      <main className='flex-1 p-6'>{children}</main>
    </div>
  );
}
