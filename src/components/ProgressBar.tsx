import React from 'react';
import { formatPercent } from '../utils/format';

export interface ProgressBarProps {
  label: React.ReactNode;
  value: number;
  colorClass: string;
  ariaLabel: string;
}

/**
 * Componente de barra de progresso horizontal estilo métrica.
 * Utilizado para demonstrar percentuais (ex: avanço físico, desembolso financeiro)
 * de forma visual, acessível e com animação de preenchimento.
 * 
 * @param props - Propriedades do componente.
 * @param props.label - Texto descritivo exibido acima da barra, no canto esquerdo.
 * @param props.value - Valor numérico percentual (de 0 a 100) refletindo o andamento da barra.
 * @param props.colorClass - Classe do Tailwind responsável por pintar o fundo (ex: 'bg-indigo-600').
 * @param props.ariaLabel - Descrição acessível da métrica (role="progressbar" e aria attributes).
 * @returns Retorna a barra de progresso construída com os dados providos.
 */
export function ProgressBar({ label, value, colorClass, ariaLabel }: ProgressBarProps) {
  return (
    <div>
      <div className="flex justify-between text-[11px] mb-1">
        <span className="text-slate-500 font-medium flex items-center">
          {label}
        </span>
        <span className="font-mono text-slate-200 font-bold">{formatPercent(value, false, 0)}</span>
      </div>
      <div 
        className="w-full bg-slate-850 h-1.5 rounded-full overflow-hidden" 
        role="progressbar" 
        aria-label={ariaLabel} 
        aria-valuenow={value} 
        aria-valuemin={0} 
        aria-valuemax={100}
      >
        <div 
          className={`${colorClass} h-1.5 rounded-full transition-all duration-500 ease-out motion-reduce:transition-none`} 
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
