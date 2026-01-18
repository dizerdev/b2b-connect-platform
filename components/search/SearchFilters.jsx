'use client';

import { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button, Badge } from 'components/ui';

/**
 * SearchFilters Component - Advanced Filter Panel
 * 
 * Features:
 * - Collapsible sections
 * - Multiple filter types
 * - Active filter badges
 * - Reset filters
 */

const FILTER_OPTIONS = {
  categoria: [
    { value: 'Calçados', label: 'Calçados' },
    { value: 'Acessórios', label: 'Acessórios' },
    { value: 'Máquinas', label: 'Máquinas' },
    { value: 'Couros', label: 'Couros' },
  ],
  continente: [
    { value: 'América do Sul', label: 'América do Sul' },
    { value: 'América do Norte', label: 'América do Norte' },
    { value: 'Europa', label: 'Europa' },
    { value: 'Ásia', label: 'Ásia' },
    { value: 'África', label: 'África' },
  ],
  rating: [
    { value: '5', label: '⭐⭐⭐⭐⭐ (5)' },
    { value: '4', label: '⭐⭐⭐⭐ e acima' },
    { value: '3', label: '⭐⭐⭐ e acima' },
  ],
  ordenar: [
    { value: 'recentes', label: 'Mais recentes' },
    { value: 'rating', label: 'Melhor avaliados' },
    { value: 'nome_asc', label: 'Nome (A-Z)' },
    { value: 'nome_desc', label: 'Nome (Z-A)' },
  ],
};

export default function SearchFilters({
  filters = {},
  onChange,
  onReset,
  className = '',
}) {
  const [expandedSections, setExpandedSections] = useState({
    categoria: true,
    continente: false,
    rating: false,
    ordenar: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleFilterChange = (key, value) => {
    const currentValues = filters[key] || [];
    let newValues;

    if (key === 'ordenar') {
      // Single select for sorting
      newValues = value;
    } else {
      // Multi select for other filters
      if (currentValues.includes(value)) {
        newValues = currentValues.filter((v) => v !== value);
      } else {
        newValues = [...currentValues, value];
      }
    }

    onChange?.({ ...filters, [key]: newValues });
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).reduce((count, value) => {
      if (Array.isArray(value)) return count + value.length;
      if (value) return count + 1;
      return count;
    }, 0);
  };

  const activeCount = getActiveFiltersCount();

  const renderFilterSection = (key, label) => {
    const options = FILTER_OPTIONS[key];
    const isExpanded = expandedSections[key];
    const selectedValues = filters[key] || [];

    return (
      <div key={key} className="border-b border-[var(--color-gray-100)] last:border-0">
        <button
          onClick={() => toggleSection(key)}
          className="
            w-full flex items-center justify-between
            px-4 py-3
            text-left
            hover:bg-[var(--color-gray-50)]
            transition-colors
          "
        >
          <span className="font-medium text-[var(--color-gray-700)]">
            {label}
            {selectedValues.length > 0 && (
              <Badge variant="primary" size="sm" className="ml-2">
                {Array.isArray(selectedValues) ? selectedValues.length : 1}
              </Badge>
            )}
          </span>
          {isExpanded ? (
            <ChevronUp size={18} className="text-[var(--color-gray-400)]" />
          ) : (
            <ChevronDown size={18} className="text-[var(--color-gray-400)]" />
          )}
        </button>

        {isExpanded && (
          <div className="px-4 pb-4 space-y-2">
            {options.map((option) => {
              const isSelected = key === 'ordenar'
                ? selectedValues === option.value
                : selectedValues.includes(option.value);

              return (
                <label
                  key={option.value}
                  className="
                    flex items-center gap-3 px-2 py-1.5
                    rounded-lg
                    cursor-pointer
                    hover:bg-[var(--color-gray-50)]
                    transition-colors
                  "
                >
                  <input
                    type={key === 'ordenar' ? 'radio' : 'checkbox'}
                    name={key}
                    checked={isSelected}
                    onChange={() => handleFilterChange(key, option.value)}
                    className="
                      w-4 h-4
                      text-[var(--color-primary-500)]
                      border-[var(--color-gray-300)]
                      rounded
                      focus:ring-[var(--color-primary-400)]
                      focus:ring-offset-0
                    "
                  />
                  <span className={`text-sm ${isSelected ? 'text-[var(--color-gray-900)] font-medium' : 'text-[var(--color-gray-600)]'}`}>
                    {option.label}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-[var(--radius-xl)] border border-[var(--color-gray-200)] overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-gray-100)] bg-[var(--color-gray-50)]">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-[var(--color-gray-500)]" />
          <span className="font-semibold text-[var(--color-gray-700)]">Filtros</span>
          {activeCount > 0 && (
            <Badge variant="primary">{activeCount}</Badge>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="
              flex items-center gap-1
              text-sm text-[var(--color-gray-500)]
              hover:text-[var(--color-primary-600)]
              transition-colors
            "
          >
            <RotateCcw size={14} />
            Limpar
          </button>
        )}
      </div>

      {/* Filter Sections */}
      <div>
        {renderFilterSection('categoria', 'Categoria')}
        {renderFilterSection('continente', 'Continente')}
        {renderFilterSection('rating', 'Avaliação')}
        {renderFilterSection('ordenar', 'Ordenar por')}
      </div>
    </div>
  );
}
