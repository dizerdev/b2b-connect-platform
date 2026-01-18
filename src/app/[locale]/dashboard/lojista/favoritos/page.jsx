'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Heart, FolderOpen, Package, Trash2, Star } from 'lucide-react';
import SellerGuard from 'components/SellerGuard';
import { Card, Badge, Button, EmptyState, Skeleton } from 'components/ui';
import useFavoritesStore from 'src/store/favoritesStore';

export default function FavoritosPage() {
  const t = useTranslations('Favoritos');
  const { favorites, syncFromAPI, removeFavorite, loading } = useFavoritesStore();
  const [activeTab, setActiveTab] = useState('catalogos');

  useEffect(() => {
    syncFromAPI();
  }, []);

  const catalogosFavoritos = favorites.filter((f) => f.type === 'catalogo');
  const produtosFavoritos = favorites.filter((f) => f.type === 'produto');

  const handleRemove = async (type, itemId) => {
    if (window.confirm('Remover dos favoritos?')) {
      await removeFavorite(type, itemId);
    }
  };

  const renderCatalogoCard = (fav, catalogo) => (
    <Card key={fav.id} className="overflow-hidden group">
      <Link
        href={`/dashboard/lojista/vitrines/catalogos/${fav.catalogoId}`}
        className="block"
      >
        <div className="flex gap-4">
          {/* Image */}
          <div className="w-24 h-24 rounded-lg overflow-hidden bg-[var(--color-gray-100)] flex-shrink-0">
            {catalogo?.catalogo_imagem ? (
              <img
                src={catalogo.catalogo_imagem}
                alt={catalogo.catalogo_nome}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[var(--color-gray-400)]">
                <FolderOpen size={28} />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 py-1">
            <h3 className="font-semibold text-[var(--color-gray-900)] truncate group-hover:text-[var(--color-primary-600)] transition-colors">
              {catalogo?.catalogo_nome || 'Catálogo'}
            </h3>
            {catalogo?.catalogo_status && (
              <Badge
                variant={catalogo.catalogo_status === 'publicado' ? 'success' : 'warning'}
                size="sm"
                className="mt-2"
              >
                {catalogo.catalogo_status}
              </Badge>
            )}
            <p className="text-xs text-[var(--color-gray-500)] mt-2">
              Adicionado em {new Date(fav.createdAt).toLocaleDateString('pt-BR')}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleRemove('catalogo', fav.catalogoId);
              }}
              className="p-2 rounded-lg text-[var(--color-gray-400)] hover:text-[var(--color-accent-rose)] hover:bg-[var(--color-error-bg)] transition-all"
              title="Remover dos favoritos"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </Link>
    </Card>
  );

  const renderProdutoCard = (fav, produto) => (
    <Card key={fav.id} className="overflow-hidden group">
      <Link
        href={`/dashboard/lojista/produtos/${fav.produtoId}`}
        className="block"
      >
        <div className="flex gap-4">
          {/* Image */}
          <div className="w-24 h-24 rounded-lg overflow-hidden bg-[var(--color-gray-100)] flex-shrink-0">
            {produto?.produto_imagens?.[0] ? (
              <img
                src={produto.produto_imagens[0]}
                alt={produto.produto_nome}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[var(--color-gray-400)]">
                <Package size={28} />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 py-1">
            <h3 className="font-semibold text-[var(--color-gray-900)] truncate group-hover:text-[var(--color-primary-600)] transition-colors">
              {produto?.produto_nome || 'Produto'}
            </h3>
            <p className="text-xs text-[var(--color-gray-500)] mt-2">
              Adicionado em {new Date(fav.createdAt).toLocaleDateString('pt-BR')}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleRemove('produto', fav.produtoId);
              }}
              className="p-2 rounded-lg text-[var(--color-gray-400)] hover:text-[var(--color-accent-rose)] hover:bg-[var(--color-error-bg)] transition-all"
              title="Remover dos favoritos"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </Link>
    </Card>
  );

  return (
    <SellerGuard>
      <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-accent-rose)] to-pink-600 flex items-center justify-center text-white">
              <Heart size={24} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-[var(--color-gray-900)]">
                Meus Favoritos
              </h1>
              <p className="text-[var(--color-gray-500)]">
                {favorites.length} itens salvos
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-[var(--color-gray-200)]">
          <button
            onClick={() => setActiveTab('catalogos')}
            className={`
              flex items-center gap-2 px-4 py-3
              text-sm font-medium
              border-b-2 -mb-px
              transition-colors
              ${activeTab === 'catalogos'
                ? 'border-[var(--color-primary-500)] text-[var(--color-primary-600)]'
                : 'border-transparent text-[var(--color-gray-500)] hover:text-[var(--color-gray-700)]'
              }
            `}
          >
            <FolderOpen size={18} />
            Catálogos ({catalogosFavoritos.length})
          </button>
          <button
            onClick={() => setActiveTab('produtos')}
            className={`
              flex items-center gap-2 px-4 py-3
              text-sm font-medium
              border-b-2 -mb-px
              transition-colors
              ${activeTab === 'produtos'
                ? 'border-[var(--color-primary-500)] text-[var(--color-primary-600)]'
                : 'border-transparent text-[var(--color-gray-500)] hover:text-[var(--color-gray-700)]'
              }
            `}
          >
            <Package size={18} />
            Produtos ({produtosFavoritos.length})
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <div className="flex gap-4">
                  <Skeleton variant="rectangular" width="96px" height="96px" className="rounded-lg" />
                  <div className="flex-1 space-y-3">
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="40%" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : activeTab === 'catalogos' ? (
          catalogosFavoritos.length > 0 ? (
            <div className="space-y-4">
              {catalogosFavoritos.map((fav) => renderCatalogoCard(fav, fav))}
            </div>
          ) : (
            <EmptyState.NoFavorites />
          )
        ) : produtosFavoritos.length > 0 ? (
          <div className="space-y-4">
            {produtosFavoritos.map((fav) => renderProdutoCard(fav, fav))}
          </div>
        ) : (
          <EmptyState.NoFavorites />
        )}
      </div>
    </SellerGuard>
  );
}
