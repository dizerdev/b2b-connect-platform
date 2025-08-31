export default function CatalogoCard({ catalogo, compact = false }) {
  return (
    <div className='border rounded-lg shadow hover:shadow-lg transition cursor-pointer overflow-hidden'>
      <div className={compact ? 'w-full h-32' : 'w-full h-48'}>
        <img
          src={catalogo.imagem_url || '/assets/placeholder.png'}
          alt={catalogo.nome}
          className='w-full h-full object-cover'
        />
      </div>
      <div className='p-3 bg-white'>
        <h2 className='text-sm font-semibold truncate'>{catalogo.nome}</h2>
        {!compact && (
          <>
            <p className='text-xs text-gray-600'>
              Fornecedor: {catalogo.fornecedor_nome}
            </p>
            <p className='text-xs mt-1'>
              Status:{' '}
              <span
                className={`font-semibold ${
                  catalogo.status === 'publicado'
                    ? 'text-green-600'
                    : 'text-yellow-600'
                }`}
              >
                {catalogo.status}
              </span>
            </p>
            <p className='text-xs'>Rating: ⭐ {catalogo.rating || 0}</p>
          </>
        )}
      </div>
    </div>
  );
}
