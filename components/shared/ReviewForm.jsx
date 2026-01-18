'use client';

import { useState } from 'react';
import { X, ThumbsUp, ThumbsDown } from 'lucide-react';
import StarRating from 'components/ui/StarRating';
import { Button, Input } from 'components/ui';

/**
 * ReviewForm Component
 * 
 * Modal form for creating/editing reviews
 */

export default function ReviewForm({
  catalogoId,
  existingReview = null,
  onSubmit,
  onClose,
}) {
  const [nota, setNota] = useState(existingReview?.nota || 0);
  const [titulo, setTitulo] = useState(existingReview?.titulo || '');
  const [comentario, setComentario] = useState(existingReview?.comentario || '');
  const [recomenda, setRecomenda] = useState(existingReview?.recomenda ?? true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!existingReview;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (nota === 0) {
      setError('Selecione uma nota');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const url = isEditing 
        ? `/api/v1/avaliacoes/${existingReview.id}`
        : '/api/v1/avaliacoes';
      
      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          catalogoId,
          nota,
          titulo: titulo.trim() || null,
          comentario: comentario.trim() || null,
          recomenda,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao salvar avaliação');
      }

      onSubmit?.(data.avaliacao);
      onClose?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="
        relative
        w-full max-w-lg
        bg-white
        rounded-[var(--radius-2xl)]
        shadow-[var(--shadow-2xl)]
        animate-fade-in-up
      ">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-gray-100)]">
          <h2 className="text-lg font-semibold text-[var(--color-gray-900)]">
            {isEditing ? 'Editar Avaliação' : 'Avaliar Catálogo'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[var(--color-gray-400)] hover:bg-[var(--color-gray-50)] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-gray-700)] mb-3">
              Sua nota *
            </label>
            <div className="flex items-center gap-4">
              <StarRating
                value={nota}
                onChange={setNota}
                size="lg"
              />
              {nota > 0 && (
                <span className="text-lg font-semibold text-[var(--color-gray-700)]">
                  {nota}/5
                </span>
              )}
            </div>
          </div>

          {/* Recommendation */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-gray-700)] mb-3">
              Você recomenda este catálogo?
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setRecomenda(true)}
                className={`
                  flex items-center gap-2 px-4 py-2
                  rounded-lg border-2
                  font-medium text-sm
                  transition-all
                  ${recomenda
                    ? 'border-[var(--color-accent-emerald)] bg-[var(--color-success-bg)] text-[var(--color-accent-emerald)]'
                    : 'border-[var(--color-gray-200)] text-[var(--color-gray-500)] hover:border-[var(--color-gray-300)]'
                  }
                `}
              >
                <ThumbsUp size={16} />
                Sim
              </button>
              <button
                type="button"
                onClick={() => setRecomenda(false)}
                className={`
                  flex items-center gap-2 px-4 py-2
                  rounded-lg border-2
                  font-medium text-sm
                  transition-all
                  ${!recomenda
                    ? 'border-[var(--color-accent-rose)] bg-[var(--color-error-bg)] text-[var(--color-accent-rose)]'
                    : 'border-[var(--color-gray-200)] text-[var(--color-gray-500)] hover:border-[var(--color-gray-300)]'
                  }
                `}
              >
                <ThumbsDown size={16} />
                Não
              </button>
            </div>
          </div>

          {/* Title */}
          <Input
            label="Título (opcional)"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Resumo da sua experiência"
            maxLength={100}
          />

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-gray-700)] mb-2">
              Comentário (opcional)
            </label>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Conte mais sobre sua experiência com este catálogo..."
              rows={4}
              className="
                w-full px-4 py-3
                text-sm
                border border-[var(--color-gray-200)]
                rounded-[var(--radius-lg)]
                placeholder:text-[var(--color-gray-400)]
                focus:outline-none focus:border-[var(--color-primary-400)]
                focus:ring-2 focus:ring-[var(--color-primary-100)]
                transition-all resize-none
              "
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-[var(--color-accent-rose)]">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={nota === 0}
              className="flex-1"
            >
              {isEditing ? 'Salvar Alterações' : 'Enviar Avaliação'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
