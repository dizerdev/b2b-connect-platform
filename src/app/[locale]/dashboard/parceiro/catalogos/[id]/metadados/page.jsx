'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import PartnerGuard from 'components/PartnerGuard';
import { X } from 'lucide-react';

const CONTINENTES = [
  'América do Norte',
  'América Central',
  'América do Sul',
  'Ásia',
  'África',
  'Oceânia',
];
const PAISES = [
  'China',
  'EUA',
  'México',
  'Argentina',
  'Marrocos',
  'África do Sul',
  'Austrália',
  'Vietnã',
  'Indonésia',
  'Alemanha',
  'Itália',
  'Bélgica',
  'França',
  'Países Baixos',
  'Espanha',
  'Índia',
  'Turquia',
  'Portugal',
  'Bangladesh',
  'México',
  'Polônia',
  'Brasil',
  'Paquistão',
  'Canadá',
  'Egito',
];
const CATEGORIAS = [
  'Calçados',
  'Acessórios',
  'Componentes',
  'Couros',
  'Máquinas',
  'Serviços',
  'Químicos',
];
const SUBCATEGORIAS = [
  'Masculino',
  'Feminino',
  'Infantil',
  'Meias',
  'Cintos',
  'Bolsas',
  'Malas',
  'Palmilha',
  'Sola',
  'Salto',
  'Cabedal',
  'Injetoras',
  'Costura',
  'Presponto',
  'Manutenção',
  'Sapataria',
  'Vendedores',
  'Curtume',
];
const ESPECIFICACOES_VALIDAS = [
  'Couro',
  'Tecido Premium',
  'Estampado',
  'Vulcanizado',
  'Costura',
  'Verniz',
];

export default function DefinicaoMetadadosPage() {
  const { id } = useParams();
  const router = useRouter();

  const [continente, setContinente] = useState('');
  const [pais, setPais] = useState('');
  const [categoria, setCategoria] = useState('');
  const [subcategoria, setSubcategoria] = useState('');
  const [especificacao, setEspecificacao] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/v1/catalogos/${id}/metadados`);
        if (!res.ok) throw new Error('Erro ao carregar metadados');
        const data = await res.json();

        setContinente(data.continente || '');
        setPais(data.pais || '');
        setCategoria(data.categoria || '');
        setSubcategoria(data.sub_categoria || '');
        setEspecificacao(data.especificacao || []);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  function toggleEspecificacao(item) {
    setEspecificacao((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  }

  async function handleSalvar(e) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/v1/catalogos/${id}/metadados`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          continente,
          pais,
          categoria,
          sub_categoria: subcategoria,
          especificacao,
        }),
      });

      if (!res.ok) throw new Error('Erro ao salvar metadados');
      toast.success('Metadados salvos com sucesso!');
      router.push(`/dashboard/parceiro/catalogos/${id}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className='p-4'>Carregando...</p>;

  return (
    <PartnerGuard>
      <div className='p-6 max-w-2xl mx-auto'>
        <h1 className='text-2xl font-bold mb-4'>Definir Metadados</h1>

        <form onSubmit={handleSalvar} className='space-y-4'>
          <div>
            <label className='block font-medium mb-1'>Continente</label>
            <select
              value={continente}
              onChange={(e) => setContinente(e.target.value)}
              className='w-full border px-3 py-2 rounded'
              required
            >
              <option value=''>Selecione</option>
              {CONTINENTES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='block font-medium mb-1'>País</label>
            <select
              value={pais}
              onChange={(e) => setPais(e.target.value)}
              className='w-full border px-3 py-2 rounded'
              required
            >
              <option value=''>Selecione</option>
              {PAISES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='block font-medium mb-1'>Categoria</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className='w-full border px-3 py-2 rounded'
              required
            >
              <option value=''>Selecione</option>
              {CATEGORIAS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='block font-medium mb-1'>Sub Categoria</label>
            <select
              value={subcategoria}
              onChange={(e) => setSubcategoria(e.target.value)}
              className='w-full border px-3 py-2 rounded'
              required
            >
              <option value=''>Selecione</option>
              {SUBCATEGORIAS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='block font-medium mb-1'>Especificações</label>
            <div className='flex flex-wrap gap-2 mb-2'>
              {ESPECIFICACOES_VALIDAS.map((esp) => {
                const selected = especificacao.includes(esp);
                return (
                  <button
                    key={esp}
                    type='button'
                    onClick={() => toggleEspecificacao(esp)}
                    className={`px-3 py-1 rounded-full border ${
                      selected
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {esp}
                    {selected && <X size={14} className='inline ml-1' />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className='flex gap-3'>
            <button
              type='submit'
              disabled={saving}
              className='bg-green-600 text-white px-4 py-2 rounded'
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
            <button
              type='button'
              onClick={() => router.push(`/dashboard/parceiro/catalogos/${id}`)}
              className='bg-gray-300 px-4 py-2 rounded'
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </PartnerGuard>
  );
}
