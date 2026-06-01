import React, { useMemo } from 'react';
import { Obra, UserRole } from '../types';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Briefcase, 
  Compass, 
  PlayCircle, 
  StopCircle, 
  CheckCircle,
  Eye,
  MapPin,
  Calendar,
  DollarSign,
  Plus
} from 'lucide-react';

interface DashboardProps {
  obras: Obra[];
  onSelectObra: (id: string) => void;
  currentRole: UserRole;
  isLoading?: boolean;
  onChangeRole: (role: UserRole) => void;
  onAddObra?: () => void;
}

import { usePortfolioMetrics } from '../hooks/usePortfolioMetrics';
import { StatusBadge } from './StatusBadge';
import { ProgressBar } from './ProgressBar';
import { STATUS_OBRA } from '../types/statusObra';
import { ObraCard } from './ObraCard';
import { Skeleton } from './Skeleton';
import { formatCurrency, formatPercent } from '../utils/format';

export function Dashboard({ obras, onSelectObra, currentRole, isLoading, onChangeRole, onAddObra }: DashboardProps) {
  const kpis = usePortfolioMetrics(obras);

  const activeObras = obras.filter(o => o.status === STATUS_OBRA.EM_EXECUCAO || o.status === STATUS_OBRA.EM_FINALIZACAO);

  return (
    <div className="space-y-6">
      {/* Portfólio Header */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-100 tracking-tight">Portfólio de Obras</h2>
          <p className="text-xs text-slate-500 font-medium">Visão consolidada do ciclo de execução das residências de alto padrão</p>
        </div>
        
        {/* Profile Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:flex-wrap gap-2 bg-slate-900 p-2 rounded-lg border border-slate-800 self-start w-full lg:w-auto">
          <span className="text-[10px] text-slate-500 font-mono uppercase font-bold pl-1 sm:pl-1.5 whitespace-nowrap">Perfil de Teste:</span>
          <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide w-full sm:w-auto">
            {([
              { key: 'admin', label: 'Admin (Leandro)' },
              { key: 'engenharia', label: 'Eng (Felipe)' },
              { key: 'controladoria', label: 'Fin (Luis)' },
              { key: 'campo', label: 'Campo' },
              { key: 'cliente', label: 'Cliente (F2)' }
            ] as const).map(role => (
              <button
                key={role.key}
                onClick={() => onChangeRole(role.key)}
                className={`px-3 py-1.5 rounded text-[10px] font-semibold cursor-pointer transition whitespace-nowrap flex-shrink-0 ${
                  currentRole === role.key 
                    ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-850'
                }`}
                title={`Mudar visualização de interface para ${role.label}`}
              >
                {role.label.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Valor do Portfólio - Oculto para campo/cliente */}
        <div className="bg-slate-900 border border-slate-800 shadow-card-shadow p-4 rounded-lg relative overflow-hidden transition-all duration-300 ease-out motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-lg hover:border-slate-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Valor do Portfólio</p>
              {isLoading ? <Skeleton className="h-7 w-32 mt-1" /> : (
                <h3 className="text-xl font-bold font-mono text-slate-100 mt-1">
                  {['admin', 'controladoria', 'gestor_obra'].includes(currentRole) ? formatCurrency(kpis.totalValor) : '••••••••'}
                </h3>
              )}
            </div>
            <span className="p-2 bg-slate-850 text-slate-300 rounded">
              <DollarSign size={16} />
            </span>
          </div>
          {isLoading ? <Skeleton className="h-4 w-40 mt-3" /> : (
            <p className="text-[11px] text-slate-550 mt-3 flex items-center gap-1">
              <span className="text-emerald-600 font-semibold font-mono">{obras.length}</span> obras cadastradas na base
            </p>
          )}
        </div>

        <div className="bg-slate-900 border border-slate-800 shadow-card-shadow p-4 rounded-lg relative overflow-hidden transition-all duration-300 ease-out motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-lg hover:border-slate-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avanço Físico Médio</p>
              {isLoading ? <Skeleton className="h-7 w-24 mt-1" /> : (
                <h3 className="text-xl font-bold font-mono text-slate-100 mt-1">{formatPercent(kpis.avancoFisicoMedio, false, 0)}</h3>
              )}
            </div>
            <span className="p-2 bg-slate-850 text-slate-300 rounded">
              <Compass size={16} />
            </span>
          </div>
          {/* Custom progress bar */}
          <div className="w-full bg-slate-850 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className={`h-1.5 rounded-full transition-all duration-500 ease-out motion-reduce:transition-none ${isLoading ? 'bg-slate-700 animate-pulse' : 'bg-indigo-600'}`} style={{ width: isLoading ? '100%' : `${kpis.avancoFisicoMedio}%` }}></div>
          </div>
        </div>

        {/* Desvio Orçamentário - Oculto para campo/cliente/engenharia dependendo da conf */}
        <div className="bg-slate-900 border border-slate-800 shadow-card-shadow p-4 rounded-lg relative overflow-hidden transition-all duration-300 ease-out motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-lg hover:border-slate-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Desvio Orçamentário</p>
              {isLoading ? <Skeleton className="h-7 w-20 mt-1" /> : (
                <h3 className="text-xl font-bold font-mono text-emerald-600 mt-1">
                  {['admin', 'controladoria', 'gestor_obra', 'engenharia'].includes(currentRole) ? (kpis.desvioOrcamentarioMedio > 0 ? `+${kpis.desvioOrcamentarioMedio}%` : `${kpis.desvioOrcamentarioMedio}%`) : '•••'}
                </h3>
              )}
            </div>
            <span className="p-2 bg-slate-850 text-emerald-600 rounded">
              <TrendingDown size={16} />
            </span>
          </div>
          {isLoading ? <Skeleton className="h-4 w-32 mt-3" /> : (
            <p className="text-[11px] text-slate-550 mt-3 flex items-center gap-1">
              {['admin', 'controladoria', 'gestor_obra', 'engenharia'].includes(currentRole) ? (
                <><span className="text-emerald-600 font-bold font-mono">{Math.abs(kpis.desvioOrcamentarioMedio)}%</span> de economia média</>
              ) : (
                'Acesso restrito'
              )}
            </p>
          )}
        </div>

        <div className="bg-slate-900 border border-slate-800 shadow-card-shadow p-4 rounded-lg relative overflow-hidden transition-all duration-300 ease-out motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-lg hover:border-slate-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Alertas de Qualidade</p>
              {isLoading ? <Skeleton className="h-7 w-24 mt-1" /> : (
                <h3 className={`text-xl font-bold font-mono mt-1 ${kpis.alertasQualidade > 0 ? 'text-amber-600' : 'text-slate-100'}`}>{kpis.alertasQualidade} RNC</h3>
              )}
            </div>
            <span className="p-2 bg-slate-850 text-amber-600 rounded">
              <AlertTriangle size={16} />
            </span>
          </div>
          {isLoading ? <Skeleton className="h-4 w-44 mt-3" /> : (
            <p className="text-[11px] text-slate-550 mt-3 flex items-center gap-1">
              <span className="text-amber-600 font-bold">1</span> pendência em resolução (FVS Sitta)
            </p>
          )}
        </div>
      </div>

      {/* Grid of Projects */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Selecione uma Obra para Acessar o Workspace 360°</h3>
          {onAddObra && (['admin', 'gestor_obra'].includes(currentRole)) && (
            <button
              onClick={onAddObra}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-slate-100 transition shadow"
            >
              <Plus size={14} />
              Nova Obra
            </button>
          )}
        </div>
        {obras.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 py-16 text-center flex flex-col items-center justify-center shadow-card-shadow">
            <Briefcase size={48} className="text-slate-700 mb-4 stroke-1" />
            <h3 className="text-slate-200 font-medium font-display text-lg">Nenhuma obra cadastrada ainda</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-sm">Adicione uma nova obra clicando no botão acima para começar a gerenciar o portfólio de projetos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {obras.map((obra) => {
              const radarSummary = kpis.mapaAlertas.get(obra.code);

              return (
                <ObraCard
                  key={obra.id}
                  obra={obra}
                  currentRole={currentRole}
                  isLoading={isLoading}
                  onClick={() => onSelectObra(obra.id)}
                  radarSummary={radarSummary}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
