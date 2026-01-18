'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import PartnerGuard from 'components/PartnerGuard';

export default function DetalhesProdutoPage() {
  const t = useTranslations('DashboardParceiro');
  const { pid } = useParams();

  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProduto = async () => {
    try {
      const res = await fetch(`/api/v1/produtos/${pid}`);
      if (!res.ok) throw new Error(t('ErrorLoadingData'));
      const data = await res.json();
      setProduto(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduto();
  }, [pid]);

  if (loading) return <p className='p-4'>{t('Loading')}</p>;
  if (!produto) return <p className='p-4'>{t('ProductNotFound')}</p>;

  return (
    <PartnerGuard>
      <div className='p-6 space-y-6'>
        <header className='flex justify-between items-center'>
          <h1 className='text-2xl font-bold'>{t('ProductDetails')}</h1>
          <Link
            href={`/dashboard/parceiro/catalogos/${produto.catalogos[0].catalogo_id}`}
            className='text-blue-500 hover:underline'
          >
            {t('Back')}
          </Link>
        </header>

        {/* Informações básicas */}
        <section className='bg-white shadow rounded p-4 space-y-2'>
          <h2 className='text-lg font-semibold'>{t('BasicInformation')}</h2>
          <p>
            <strong>{t('Name')}:</strong> {produto.produto.nome}
          </p>
          <p>
            <strong>{t('Description')}:</strong> {produto.produto.descricao}
          </p>
          <p>
            <strong>{t('Price')}:</strong> R$ {produto.catalogos[0].preco}
          </p>
          <p>
            <strong>{t('Status')}:</strong>{' '}
            <span
              className={`px-2 py-1 text-sm rounded ${
                produto.ativo
                  ? 'bg-green-200 text-green-800'
                  : 'bg-red-200 text-red-800'
              }`}
            >
              {produto.ativo ? t('Active') : t('Inactive')}
            </span>
          </p>
          <p>
            <strong>{t('CreatedAt')}:</strong>{' '}
            {new Date(produto.produto.created_at).toLocaleDateString()}
          </p>
        </section>

        {/* Grades do produto */}
        {produto.grades && produto.grades.length > 0 && (
          <section className='bg-white shadow rounded p-4 space-y-2'>
            <h2 className='text-lg font-semibold'>{t('Grades')}</h2>
            <table className='w-full border border-gray-200'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='border px-2 py-1 text-left'>{t('Color')}</th>
                  <th className='border px-2 py-1 text-left'>{t('Size')}</th>
                  <th className='border px-2 py-1 text-left'>{t('Type')}</th>
                  <th className='border px-2 py-1 text-left'>
                    {t('ReadyDelivery')}
                  </th>
                  <th className='border px-2 py-1 text-left'>{t('Stock')}</th>
                  <th className='border px-2 py-1 text-left'>
                    {t('CreatedAt')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {produto.grades.map((grade, idx) => (
                  <tr key={idx}>
                    <td className='border px-2 py-1'>{grade.cor}</td>
                    <td className='border px-2 py-1'>{grade.tamanho}</td>
                    <td className='border px-2 py-1'>{grade.tipo}</td>
                    <td className='border px-2 py-1'>
                      {grade.pronta_entrega ? t('Yes') : t('No')}
                    </td>
                    <td className='border px-2 py-1'>{grade.estoque}</td>
                    <td className='border px-2 py-1'>
                      {new Date(grade.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* Ações extras */}
        <section className='bg-white shadow rounded p-4 space-y-4'>
          <h2 className='text-lg font-semibold'>{t('ActionsList')}</h2>
          <div className='flex gap-4'>
            <Link
              href={`/dashboard/parceiro/produtos/${pid}/grades`}
              className='px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700'
            >
              {t('ManageGrades')}
            </Link>
            <Link
              href={`/dashboard/parceiro/produtos/${pid}/editar`}
              className='px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700'
            >
              {t('EditProduct')}
            </Link>
          </div>
        </section>

        {/* Imagens do produto */}
        {produto.produto.imagens && produto.produto.imagens.length > 0 && (
          <section className='bg-white shadow rounded p-4'>
            <h2 className='text-lg font-semibold mb-4'>{t('Photos')}</h2>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              {produto.produto.imagens.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Foto ${idx + 1}`}
                  className='w-full h-40 object-cover rounded'
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </PartnerGuard>
  );
}
