import LogoutButton from 'components/ui/auth/LogoutButton';

export default function DashboardLayout({ children }) {
  return (
    <div className='min-h-screen flex flex-col'>
      <header className='bg-white shadow p-4 flex justify-between items-center'>
        <h1 className='text-lg font-bold'>Minha Dashboard</h1>
        <LogoutButton />
      </header>
      <main className='flex-1 p-6'>{children}</main>
    </div>
  );
}
