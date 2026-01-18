'use client';

import { useEffect } from 'react';
import useOnboardingStore from 'src/store/onboardingStore';

/**
 * Tour definitions for different dashboards
 */

export const TOURS = {
  // Lojista Dashboard Tour
  lojista: {
    id: 'lojista-welcome',
    steps: [
      {
        target: '[data-tour="mapa"]',
        title: 'Mapa Global de Fornecedores',
        description: 'Explore fornecedores de todo o mundo! Clique nos pins para ver catálogos de cada região.',
      },
      {
        target: '[data-tour="categorias"]',
        title: 'Categorias por Setor',
        description: 'Navegue pelas categorias: Calçados, Acessórios, Máquinas e Couros. Use os filtros para encontrar exatamente o que precisa.',
      },
      {
        target: '[data-tour="favoritos"]',
        title: 'Seus Favoritos',
        description: 'Clique no ❤️ para salvar catálogos e produtos. Acesse-os a qualquer momento no menu Favoritos.',
      },
      {
        target: '[data-tour="mensagens"]',
        title: 'Entre em Contato',
        description: 'Encontrou algo interessante? Use o botão "Solicitar Atendimento" para conversar diretamente com o fornecedor.',
      },
    ],
  },

  // Parceiro Dashboard Tour
  parceiro: {
    id: 'parceiro-welcome',
    steps: [
      {
        target: '[data-tour="metricas"]',
        title: 'Suas Métricas',
        description: 'Acompanhe o desempenho dos seus catálogos: produtos cadastrados, visualizações e mensagens recebidas.',
      },
      {
        target: '[data-tour="novo-catalogo"]',
        title: 'Criar Novo Catálogo',
        description: 'Clique aqui para criar um novo catálogo e começar a vender para lojistas do mundo todo.',
      },
      {
        target: '[data-tour="catalogos-recentes"]',
        title: 'Catálogos Recentes',
        description: 'Veja seus catálogos mais recentes e o status de cada um: Publicado, Aprovado ou Pendente.',
      },
      {
        target: '[data-tour="atalhos"]',
        title: 'Atalhos Rápidos',
        description: 'Acesse rapidamente suas principais funções: Gerenciar Catálogos, Produtos e Mensagens.',
      },
    ],
  },

  // Admin Dashboard Tour
  admin: {
    id: 'admin-welcome',
    steps: [
      {
        target: '[data-tour="admin-metricas"]',
        title: 'Visão Geral do Sistema',
        description: 'Monitore todos os indicadores: usuários ativos, produtos, catálogos publicados e pendências.',
      },
      {
        target: '[data-tour="usuarios-recentes"]',
        title: 'Usuários Recentes',
        description: 'Veja os últimos usuários cadastrados e gerencie permissões.',
      },
      {
        target: '[data-tour="pendencias"]',
        title: 'Pendências de Aprovação',
        description: 'Catálogos aguardando sua aprovação aparecem aqui. Revise e aprove rapidamente.',
      },
      {
        target: '[data-tour="atividades"]',
        title: 'Atividade Recente',
        description: 'Acompanhe todas as ações do sistema em tempo real.',
      },
    ],
  },
};

/**
 * Hook to start a tour
 */
export function useStartTour(tourKey) {
  const { startTour, isTourCompleted } = useOnboardingStore();

  useEffect(() => {
    const tour = TOURS[tourKey];
    if (!tour) return;

    // Wait for DOM to be ready
    const timer = setTimeout(() => {
      if (!isTourCompleted(tour.id)) {
        startTour(tour.id, tour.steps);
      }
    }, 1000); // 1 second delay to let the page render

    return () => clearTimeout(timer);
  }, [tourKey, startTour, isTourCompleted]);
}

export default TOURS;
