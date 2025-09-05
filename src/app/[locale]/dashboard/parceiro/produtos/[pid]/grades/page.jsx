'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';

export default function DefinicaoGradesPage() {
  const router = useRouter();
  const params = useParams();
  const { pid } = params;

  const [grades, setGrades] = useState([]);
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProduto = async () => {
    try {
      const res = await fetch(`/api/v1/produtos/${pid}`);
      if (!res.ok) throw new Error('Erro ao buscar produto');
      const data = await res.json();
      setProduto(data);
      if (data.grades && Array.isArray(data.grades)) {
        setGrades(data.grades);
      } else {
        setGrades([
          { cor: '', tamanho: '', tipo: '', pronta_entrega: false, estoque: 0 },
        ]);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduto();
  }, [pid]);

  const handleChange = (index, field, value) => {
    const novasGrades = [...grades];
    novasGrades[index][field] = field === 'estoque' ? Number(value) : value;
    setGrades(novasGrades);
  };

  const adicionarLinha = () => {
    setGrades([
      ...grades,
      { cor: '', tamanho: '', tipo: '', pronta_entrega: false, estoque: 0 },
    ]);
  };

  const removerLinha = (index) => {
    const novasGrades = grades.filter((_, i) => i !== index);
    setGrades(novasGrades);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const gradesValidas = grades.filter(
      (g) => g.cor.trim() && g.tamanho.trim() && g.estoque !== ''
    );

    if (gradesValidas.length === 0) {
      toast.error('Adicione pelo menos uma grade válida.');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`/api/v1/produtos/${pid}/grades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gradesValidas),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erro ao salvar grades');
      }

      toast.success('Grades salvas com sucesso!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
      router.push(`/dashboard/parceiro/produtos/${pid}`);
    }
  }

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <h1 className='text-2xl font-bold mb-4'>Definir Grades de Estoque</h1>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <table className='w-full border border-gray-300'>
          <thead>
            <tr className='bg-gray-100'>
              <th className='border border-gray-300 p-2'>Cor</th>
              <th className='border border-gray-300 p-2'>Tamanho</th>
              <th className='border border-gray-300 p-2'>Tipo</th>
              <th className='border border-gray-300 p-2'>Pronta Entrega</th>
              <th className='border border-gray-300 p-2'>Estoque</th>
              <th className='border border-gray-300 p-2'></th>
            </tr>
          </thead>
          <tbody>
            {grades.map((grade, idx) => (
              <tr key={idx}>
                <td className='border border-gray-300 p-2'>
                  <input
                    type='text'
                    className='w-full border rounded p-1'
                    value={grade.cor}
                    onChange={(e) => handleChange(idx, 'cor', e.target.value)}
                    required
                  />
                </td>
                <td className='border border-gray-300 p-2'>
                  <input
                    type='text'
                    className='w-full border rounded p-1'
                    value={grade.tamanho}
                    onChange={(e) =>
                      handleChange(idx, 'tamanho', e.target.value)
                    }
                    required
                  />
                </td>
                <td className='border border-gray-300 p-2'>
                  <select
                    className='w-full border rounded p-1'
                    value={grade.tipo}
                    onChange={(e) => handleChange(idx, 'tipo', e.target.value)}
                    required
                  >
                    <option value=''></option>
                    <option value='pr'>Par</option>
                    <option value='cx'>Caixa</option>
                    <option value='un'>Unitário</option>
                  </select>
                </td>
                <td className='border border-gray-300 p-2'>
                  <input
                    type='checkbox'
                    className='w-full border rounded p-1'
                    value={grade.pronta_entrega}
                    checked={grade.pronta_entrega}
                    onChange={(e) =>
                      handleChange(idx, 'pronta_entrega', e.target.checked)
                    }
                  />
                </td>
                <td className='border border-gray-300 p-2'>
                  <input
                    type='number'
                    className='w-full border rounded p-1'
                    value={grade.estoque}
                    onChange={(e) =>
                      handleChange(idx, 'estoque', e.target.value)
                    }
                    required
                  />
                </td>
                <td className='border border-gray-300 p-2 text-center'>
                  <button
                    type='button'
                    onClick={() => removerLinha(idx)}
                    className='bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700'
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          type='button'
          onClick={adicionarLinha}
          className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
        >
          Adicionar Linha
        </button>

        <div className='flex gap-2 mt-4'>
          <button
            type='submit'
            disabled={loading}
            className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50'
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
          <button
            type='button'
            onClick={() => router.push(`/dashboard/parceiro/produtos/${pid}`)}
            className='bg-gray-300 px-4 py-2 rounded hover:bg-gray-400'
          >
            Cancelar
          </button>
        </div>
      </form>
      <Toaster />
    </div>
  );
}
