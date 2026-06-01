import React from 'react';
import { Obra } from '../types';
import { STATUS_OBRA_CONFIG } from '../types/statusObra';

interface StatusBadgeProps {
  status: Obra['status'] | string;
  className?: string;
}

/**
 * Componente que exibe o status de uma obra em formato de badge colorido.
 * Mapeia os estados definidos em STATUS_OBRA_CONFIG para cores, ícones e labels específicos.
 * 
 * @param props - Propriedades do componente.
 * @param props.status - O status atual da obra (ex: 'EM_EXECUCAO', 'PRE_OBRA').
 * @param props.className - Classes CSS (Tailwind) adicionais para estender a estilização do componente de forma opcional.
 * @returns Retorna um elemento span estilizado usando Tailwind CSS, otimizado para acessibilidade.
 */
export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const config = STATUS_OBRA_CONFIG[status as keyof typeof STATUS_OBRA_CONFIG];

  if (!config) {
    return (
      <span aria-label={`Status da obra: ${status}`} title={`Status da obra: ${status}`} className="inline-flex">
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-400 ${className}`}>
          {status}
        </span>
      </span>
    );
  }

  const { label, colorClass, icon: Icon } = config;
  const ariaLabel = `Status da obra: ${label}`;

  return (
    <span aria-label={ariaLabel} title={ariaLabel} className="inline-flex">
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${colorClass} ${className}`}>
        <Icon size={12} /> {label}
      </span>
    </span>
  );
}
