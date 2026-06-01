import React from 'react';
import { Obra, UserRole } from '../types';
import { MapPin, Eye } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { ProgressBar } from './ProgressBar';
import { Skeleton } from './Skeleton';
import { formatCurrency } from '../utils/format';

interface RadarSummary {
  total: number;
  criticos: number;
  atencao: number;
  informativos: number;
}

export interface ObraCardProps {
  obra: Obra;
  currentRole: UserRole;
  isLoading?: boolean;
  onClick: () => void;
  radarSummary?: RadarSummary;
}

/**
 * Componente que renderiza um card sumarizado representando uma obra no portfólio.
 * Exibe dados principais, barra de progresso (físico/financeiro), alertas do radar
 * de qualidade e informações orçamentárias baseadas nas permissões do usuário logado.
 *
 * @param props - Propriedades do card de obra.
 * @param props.obra - Objeto principal contendo as informações e KPIs da obra.
 * @param props.currentRole - Perfil atual do usuário, utilizado para esconder dados sigilosos.
 * @param props.isLoading - Quando true, exibe placeholders animados (Skeleton) em vez de dados reais.
 * @param props.onClick - Função executada quando o usuário clica sobre o card para abrir o painel detalhado.
 * @param props.radarSummary - Resumo de alertas/riscos associados a esta obra (quantidades críticas e de advertência).
 * @returns Retorna o container de card da obra.
 */
export const ObraCard: React.FC<ObraCardProps> = ({ obra, currentRole, isLoading, onClick, radarSummary }) => {
  return (
    <div 
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
      className="group bg-slate-900 border border-slate-800 shadow-card-shadow p-5 rounded-xl cursor-pointer transition-all duration-300 ease-out motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-lg hover:border-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          {isLoading ? (
            <Skeleton className="h-4 w-16" />
          ) : (
            <span className="text-[10px] font-mono font-bold bg-slate-850 text-slate-300 px-2 py-0.5 rounded border border-slate-800">
              {obra.code}
            </span>
          )}
          {isLoading ? (
            <Skeleton className="h-5 w-40 mt-2" />
          ) : (
            <h4 className="text-base font-bold font-display text-slate-100 group-hover:text-indigo-600 mt-2 transition-colors">
              {obra.name}
            </h4>
          )}
          {isLoading ? (
            <Skeleton className="h-3 w-32 mt-1" />
          ) : (
            <p className="text-xs flex items-center gap-1 text-slate-500">
              <MapPin size={12} className="text-slate-400" /> {obra.address || '—'}
            </p>
          )}
        </div>
        <div>
          {isLoading ? <Skeleton className="h-5 w-20" /> : <StatusBadge status={obra.status} />}
        </div>
      </div>

      {/* Radar de Desvios Badge */}
      <div className="mt-2 h-5">
        {!isLoading && radarSummary && radarSummary.total > 0 && (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-850 border border-slate-700">
            Radar: 
            {radarSummary.criticos > 0 ? (
              <span className="text-rose-500">{radarSummary.criticos} críticos</span>
            ) : null}
            {radarSummary.criticos > 0 && radarSummary.atencao > 0 ? <span className="text-slate-600">·</span> : null}
            {radarSummary.atencao > 0 ? (
              <span className="text-amber-500">{radarSummary.atencao} atenção</span>
            ) : null}
            {radarSummary.criticos === 0 && radarSummary.atencao === 0 && radarSummary.informativos > 0 ? (
              <span className="text-sky-500">{radarSummary.informativos} informativos</span>
            ) : null}
          </span>
        )}
        {isLoading && <Skeleton className="h-5 w-32" />}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-800">
        <div className="min-w-0">
          <span className="text-[10px] text-slate-500 block uppercase font-bold">Cliente</span>
          {isLoading ? <Skeleton className="h-4 w-24 mt-1" /> : <span className="text-xs font-semibold text-slate-200 block truncate" title={obra.client || ''}>{obra.client || '—'}</span>}
        </div>
        <div className="min-w-0">
          <span className="text-[10px] text-slate-500 block uppercase font-bold">Arquiteto Focal</span>
          {isLoading ? <Skeleton className="h-4 w-24 mt-1" /> : <span className="text-xs font-semibold text-slate-200 block truncate" title={obra.architect || ''}>{obra.architect || '—'}</span>}
        </div>
      </div>

      {/* Progress trackers */}
      <div className="space-y-3 mt-4">
        <div>
          {isLoading ? <Skeleton className="h-8 w-full" /> : (
            <ProgressBar 
              label="Físico Planejado / Realizado"
              value={obra.percentageFisico}
              colorClass="bg-indigo-600"
              ariaLabel="Avanço físico da obra"
            />
          )}
        </div>

        {['admin', 'controladoria', 'gestor_obra', 'engenharia'].includes(currentRole) && (
          <div>
            {isLoading ? <Skeleton className="h-8 w-full" /> : (
              <ProgressBar 
                label="Desembolso Financeiro"
                value={obra.percentageFinanceiro}
                colorClass="bg-sky-500"
                ariaLabel="Desembolso financeiro da obra"
              />
            )}
          </div>
        )}
      </div>

      {/* Bottom Stats Quick summary */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-2 mt-5 pt-4 border-t border-slate-800 text-[11px]">
        <div className="flex gap-4">
          {['admin', 'controladoria', 'gestor_obra'].includes(currentRole) ? (
            <>
              <div>
                <span className="text-slate-500 block uppercase font-bold text-[9px]">Valor Original</span>
                {isLoading ? <Skeleton className="h-4 w-20" /> : <span className="font-mono font-semibold text-slate-200">{formatCurrency(obra.value)}</span>}
              </div>
              <div>
                <span className="text-slate-500 block uppercase font-bold text-[9px]">Desvio Financeiro</span>
                {isLoading ? <Skeleton className="h-4 w-12" /> : (
                  <span className={`font-mono font-semibold block ${obra.desvioOrcamento < 0 ? 'text-emerald-600' : obra.desvioOrcamento > 0 ? 'text-rose-600' : 'text-slate-300'}`}>
                    {obra.desvioOrcamento > 0 ? `+${obra.desvioOrcamento}%` : `${obra.desvioOrcamento}%`}
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="text-[9px] text-slate-500 flex items-center gap-1"><span className="text-slate-400">Dados orçamentários sob sigilo</span></div>
          )}
        </div>
        {isLoading ? <Skeleton className="h-6 w-24 rounded" /> : (
          <div className="flex items-center justify-center gap-1.5 font-mono text-[10px] text-indigo-600 bg-indigo-50 px-2.5 py-1.5 sm:py-1 rounded border border-indigo-100 opacity-90 group-hover:opacity-100 hover:bg-indigo-100 transition-all font-bold w-full sm:w-auto">
            Abrir Painel 360° <Eye size={12} />
          </div>
        )}
      </div>
    </div>
  );
}
