'use client';

import { usePathname, useRouter } from 'src/i18n/navigation';
import { routing } from 'src/i18n/routing';
import { ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Menu } from 'lucide-react';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleLocaleChange = (locale) => {
    setIsOpen(false);
    router.replace(pathname, { locale });
  };

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className='relative' ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className='flex items-center gap-1 px-4 py-2 rounded-md border border-gray-300 bg-white text-sm text-gray-800 hover:bg-gray-100 transition'
      >
        🌐 <ChevronDown size={16} />
      </button>

      {isOpen && (
        <div className='absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50'>
          {routing.locales.map((locale) => (
            <button
              key={locale}
              onClick={() => handleLocaleChange(locale)}
              className='w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left'
            >
              {locale === 'pt-BR' ? 'Português' : locale === 'en-US' ? 'English' : 'Español'}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
