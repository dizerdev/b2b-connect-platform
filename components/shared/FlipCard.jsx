'use client';

export default function FlipCard({ front, back }) {
  return (
    <div className='flex justify-center items-center h-64'>
      <div className='card-flip'>
        <div className='card-inner'>
          <div className='card-front'>
            <p className='text-white font-bold text-lg'>{front}</p>
          </div>
          <div className='card-back'>
            <p className='text-white font-bold text-lg'>{back}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
