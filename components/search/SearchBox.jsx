'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, Filter, ChevronDown } from 'lucide-react';

/**
 * SearchBox Component - Premium Search with Suggestions
 * 
 * Features:
 * - Debounced search
 * - Search suggestions
 * - Recent searches
 * - Clear button
 */

export default function SearchBox({
  value = '',
  onChange,
  onSearch,
  placeholder = 'Buscar catálogos, produtos, fornecedores...',
  suggestions = [],
  recentSearches = [],
  loading = false,
  className = '',
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange?.(newValue);
    setShowDropdown(newValue.length > 0 || recentSearches.length > 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch?.(value);
      setShowDropdown(false);
    }
    if (e.key === 'Escape') {
      setShowDropdown(false);
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    onChange?.('');
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion) => {
    onChange?.(suggestion);
    onSearch?.(suggestion);
    setShowDropdown(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div
        className={`
          relative flex items-center
          bg-white
          border-2 rounded-[var(--radius-xl)]
          transition-all duration-300
          ${isFocused
            ? 'border-[var(--color-primary-400)] shadow-[0_0_0_4px_rgba(180,130,100,0.1)]'
            : 'border-[var(--color-gray-200)] hover:border-[var(--color-gray-300)]'
          }
        `}
      >
        <Search
          size={20}
          className={`
            ml-4 flex-shrink-0
            transition-colors
            ${isFocused ? 'text-[var(--color-primary-500)]' : 'text-[var(--color-gray-400)]'}
          `}
        />

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsFocused(true);
            setShowDropdown(true);
          }}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="
            flex-1
            px-3 py-3
            text-[var(--color-gray-900)]
            placeholder:text-[var(--color-gray-400)]
            bg-transparent
            outline-none
          "
        />

        {/* Loading indicator */}
        {loading && (
          <div className="mr-2">
            <div className="w-5 h-5 border-2 border-[var(--color-primary-200)] border-t-[var(--color-primary-500)] rounded-full animate-spin" />
          </div>
        )}

        {/* Clear button */}
        {value && (
          <button
            onClick={handleClear}
            className="
              mr-2 p-1.5
              rounded-full
              text-[var(--color-gray-400)]
              hover:bg-[var(--color-gray-100)]
              hover:text-[var(--color-gray-600)]
              transition-all
            "
          >
            <X size={16} />
          </button>
        )}

        {/* Search button */}
        <button
          onClick={() => {
            onSearch?.(value);
            setShowDropdown(false);
          }}
          className="
            mr-2 px-4 py-2
            bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)]
            text-white
            font-medium
            rounded-[var(--radius-lg)]
            hover:from-[var(--color-primary-600)] hover:to-[var(--color-primary-700)]
            transition-all
            shadow-sm hover:shadow-md
          "
        >
          Buscar
        </button>
      </div>

      {/* Dropdown */}
      {showDropdown && (suggestions.length > 0 || recentSearches.length > 0) && (
        <div
          ref={dropdownRef}
          className="
            absolute top-full left-0 right-0 mt-2
            bg-white
            border border-[var(--color-gray-200)]
            rounded-[var(--radius-xl)]
            shadow-[var(--shadow-lg)]
            overflow-hidden
            z-50
            animate-fade-in-down
          "
        >
          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-2">
              <p className="px-3 py-2 text-xs font-medium text-[var(--color-gray-500)] uppercase">
                Sugestões
              </p>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion.term || suggestion)}
                  className="
                    w-full flex items-center gap-3 px-3 py-2
                    rounded-lg
                    text-left
                    hover:bg-[var(--color-gray-50)]
                    transition-colors
                  "
                >
                  <Search size={14} className="text-[var(--color-gray-400)]" />
                  <span className="text-[var(--color-gray-700)]">
                    {suggestion.term || suggestion}
                  </span>
                  {suggestion.count && (
                    <span className="ml-auto text-xs text-[var(--color-gray-400)]">
                      {suggestion.count} resultados
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Recent searches */}
          {recentSearches.length > 0 && !value && (
            <div className="p-2 border-t border-[var(--color-gray-100)]">
              <p className="px-3 py-2 text-xs font-medium text-[var(--color-gray-500)] uppercase">
                Buscas recentes
              </p>
              {recentSearches.slice(0, 5).map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(search)}
                  className="
                    w-full flex items-center gap-3 px-3 py-2
                    rounded-lg
                    text-left
                    hover:bg-[var(--color-gray-50)]
                    transition-colors
                  "
                >
                  <Search size={14} className="text-[var(--color-gray-300)]" />
                  <span className="text-[var(--color-gray-600)]">{search}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
