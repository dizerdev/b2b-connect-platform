'use client';

import { useState, useEffect } from 'react';
import { X, ZoomIn } from 'lucide-react';

export default function ProductGallery({ images }) {
  const [selected, setSelected] = useState(images[0]); // foto principal
  const [zoomOpen, setZoomOpen] = useState(false);

  // ESC fecha modal
  useEffect(() => {
    function handleEsc(e) {
      if (e.key === 'Escape') setZoomOpen(false);
    }
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className='flex gap-4'>
      {/* Miniaturas */}
      <div className='flex flex-col gap-2'>
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelected(img)}
            className={`border rounded-md overflow-hidden ${
              selected === img ? 'border-blue-500' : 'border-gray-300'
            }`}
          >
            <img
              src={img}
              alt={`thumb-${idx}`}
              className='w-20 h-20 object-cover'
            />
          </button>
        ))}
      </div>

      {/* Foto principal */}
      <div className='relative flex-1 flex items-center justify-center'>
        <img
          src={selected}
          alt='Foto principal'
          className='w-full h-auto max-h-[500px] object-contain rounded-lg border border-gray-200'
        />
        <button
          onClick={() => setZoomOpen(true)}
          className='absolute top-3 right-3 bg-white/80 rounded-full p-2 shadow hover:bg-white'
        >
          <ZoomIn className='w-6 h-6 text-gray-800' />
        </button>
      </div>

      {/* Modal Zoom */}
      {zoomOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/80'>
          <div className='relative max-w-5xl max-h-[90vh]'>
            <img
              src={selected}
              alt='Zoom'
              className='w-auto max-h-[90vh] object-contain rounded-lg'
            />
            <button
              onClick={() => setZoomOpen(false)}
              className='absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:bg-gray-100'
            >
              <X className='w-6 h-6 text-gray-800' />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
