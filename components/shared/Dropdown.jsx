'use client';

import { useState } from 'react';

function Dropdown({ label, options, onSelect, maxVisible = 7 }) {
  const [open, setOpen] = useState(false);

  const itemHeight = 40; // altura de cada botão em px
  const maxHeight = maxVisible * itemHeight;

  return (
    <div className='relative'>
      <button
        onClick={() => setOpen(!open)}
        className='px-4 py-2 font-medium hover:text-blue-600'
      >
        {label}
      </button>
      {open && (
        <div
          className='absolute bg-white shadow-md rounded-md mt-2 z-10'
          onMouseLeave={() => setOpen(false)}
          style={{ maxHeight, overflowY: 'auto' }}
        >
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onSelect(opt);
                setOpen(false); // fecha depois de selecionar
              }}
              className='block w-full text-left px-4 py-2 hover:bg-gray-100'
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
