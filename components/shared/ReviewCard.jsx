'use client';

import { useState } from 'react';
import { ThumbsUp, MoreVertical, Flag, Edit, Trash2 } from 'lucide-react';
import Avatar from 'components/ui/Avatar';
import StarRating from 'components/ui/StarRating';
import Badge from 'components/ui/Badge';

/**
 * ReviewCard Component
 * 
 * Display a single review with user info, rating, and actions
 */

export default function ReviewCard({
  review,
  currentUserId,
  onEdit,
  onDelete,
  onReport,
  className = '',
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isOwner = currentUserId === review.usuario_id;

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias atrás`;
    return d.toLocaleDateString('pt-BR');
  };

  return (
    <div className={`
      bg-white
      rounded-[var(--radius-xl)]
      border border-[var(--color-gray-100)]
      p-5
      transition-all duration-300
      hover:border-[var(--color-gray-200)]
      hover:shadow-[var(--shadow-sm)]
      ${className}
    `}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar
            name={review.usuario_nome || 'Usuário'}
            size="md"
          />
          <div>
            <p className="font-medium text-[var(--color-gray-900)]">
              {review.usuario_nome || 'Usuário Anônimo'}
            </p>
            <p className="text-xs text-[var(--color-gray-500)]">
              {formatDate(review.created_at)}
            </p>
          </div>
        </div>

        {/* Actions Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg text-[var(--color-gray-400)] hover:bg-[var(--color-gray-50)] transition-colors"
          >
            <MoreVertical size={16} />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="
                absolute right-0 mt-1 z-20
                w-40
                bg-white
                rounded-[var(--radius-lg)]
                shadow-[var(--shadow-lg)]
                border border-[var(--color-gray-100)]
                py-1
              ">
                {isOwner ? (
                  <>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onEdit?.(review);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-gray-700)] hover:bg-[var(--color-gray-50)]"
                    >
                      <Edit size={14} />
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onDelete?.(review);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-accent-rose)] hover:bg-[var(--color-error-bg)]"
                    >
                      <Trash2 size={14} />
                      Excluir
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onReport?.(review);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-gray-700)] hover:bg-[var(--color-gray-50)]"
                  >
                    <Flag size={14} />
                    Reportar
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-3 mb-3">
        <StarRating value={review.nota} readonly size="sm" />
        {review.recomenda && (
          <Badge variant="success" size="sm">
            <ThumbsUp size={10} className="mr-1" />
            Recomenda
          </Badge>
        )}
      </div>

      {/* Title */}
      {review.titulo && (
        <h4 className="font-semibold text-[var(--color-gray-900)] mb-2">
          {review.titulo}
        </h4>
      )}

      {/* Comment */}
      {review.comentario && (
        <p className="text-[var(--color-gray-600)] text-sm leading-relaxed">
          {review.comentario}
        </p>
      )}
    </div>
  );
}
