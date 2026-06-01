import React, { useState } from 'react';
import { CronogramaEtapa, UserRole } from '../../types';
import { Obra as RealObra } from '../../types/obra';
import { formatCurrency } from '../../utils/format';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { 
  Calendar, 
  GitCommit, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  ChevronRight,
  Plus
} from 'lucide-react';

interface CronogramaProps {
  cronograma: CronogramaEtapa[];
  currentRole: UserRole;
  onUpdateCronograma: (updated: CronogramaEtapa[]) => void;
  realObra?: RealObra;
}

export function CronogramaView({ cronograma, currentRole, onUpdateCronograma, realObra }: CronogramaProps) {
  const [showAddEtapa, setShowAddEtapa] = useState(false);
  const [newEtapaName, setNewEtapaName] = useState('');
  const [newStart, setNewStart] = useState('');
  const [newEnd, setNewEnd] = useState('');
  const [newDesem, setNewDesem] = useState('');

  const isReadOnly = currentRole === 'campo' || currentRole === 'controladoria';

  const handleProgressChange = (id: string, val: number) => {
    const updated = cronograma.map(e => {
      if (e.id === id) {
        const nextStatus = val >= 100 
          ? 'CONCLUIDO' 
          : val > 0 
          ? 'EM_ANDAMENTO' 
          : 'NAO_INICIADO';
        return {
          ...e,
          progressFisicoReal: Math.min(100, Math.max(0, val)),
          status: nextStatus as any
        };
      }
      return e;
    });
    onUpdateCronograma(updated);
  };

  // Generate curves matching months for the S-Curve
  const generateChartData = () => {
    const dots = [
      { label: 'Jun 24', planejado: 5, realizado: 5, financeiro: 3 },
      { label: 'Set 24', planejado: 15, realizado: 15, financeiro: 10 },
      { label: 'Dez 24', planejado: 28, realizado: 28, financeiro: 22 },
      { label: 'Mar 25', planejado: 42, realizado: 40, financeiro: 35 },
      { label: 'Jun 25', planejado: 54, realizado: 53, financeiro: 44 },
      { label: 'Set 25', planejado: 60, realizado: 59, financeiro: 52 },
      { label: 'Dez 25', planejado: 64, realizado: 62, financeiro: 58 },
      { label: 'Mar 26', planejado: 66, realizado: 65, financeiro: 61 },
      { label: 'Mai 26 (Hoje)', planejado: 68, realizado: 68, financeiro: 64 },
      { label: 'Jul 26', planejado: 78, realizado: null, financeiro: null },
      { label: 'Set 26', planejado: 92, realizado: null, financeiro: null },
      { label: 'Out 26', planejado: 100, realizado: null, financeiro: null }
    ];

    // If active work is different, we can adjust progress
    if (cronograma.length > 0 && cronograma[0].obraId === 'paulo-mesquita') {
      return [
        { label: 'Jan 24', planejado: 8, realizado: 8, financeiro: 6 },
        { label: 'Jun 24', planejado: 28, realizado: 30, financeiro: 25 },
        { label: 'Dez 24', planejado: 55, realizado: 55, financeiro: 50 },
        { label: 'Jun 25', planejado: 70, realizado: 71, financeiro: 68 },
        { label: 'Hoje', planejado: 82, realizado: 82, financeiro: 85 },
        { label: 'Ago 26', planejado: 100, realizado: null, financeiro: null }
      ];
    }
    return dots;
  };

  const chartData = generateChartData();

  const handleAddEtapaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEtapaName || !newStart || !newEnd || !newDesem) return;

    const val = parseFloat(newDesem);

    const nova: CronogramaEtapa = {
      id: `cro-${Date.now()}`,
      obraId: cronograma[0]?.obraId || 'sitta',
      etapaName: newEtapaName,
      startDate: newStart,
      endDate: newEnd,
      progressFisicoPlanejado: 0,
      progressFisicoReal: 0,
      desembolsoPrevisto: isNaN(val) ? 0 : val,
      desembolsoReal: 0,
      status: 'NAO_INICIADO'
    };

    onUpdateCronograma([...cronograma, nova]);
    setNewEtapaName('');
    setNewStart('');
    setNewEnd('');
    setNewDesem('');
    setShowAddEtapa(false);
  };

  const hasRealCronograma = realObra?.cronograma?.tarefas && realObra.cronograma.tarefas.length > 0;

  return (
    <div className="space-y-6">
      {/* Visual Chart Panel: S-Curve */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg">
        <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5 font-display">
              <TrendingUp size={14} className="text-indigo-400" /> Curva S de Evolução Físico-Financeira
            </h3>
            <p className="text-[10px] text-slate-500">Histórico de desenvolvimento e comparação das realizações</p>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-mono">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded bg-indigo-500 inline-block"></span> Planejado</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded bg-sky-500 inline-block"></span> Físico Real</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded bg-amber-500 inline-block"></span> Desb. Financ.</span>
          </div>
        </div>

        <div className="h-64 w-full text-xs font-mono">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPlanejado" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorRealizado" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorFinanceiro" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="label" stroke="#94a3b8" fontSize={9} />
              <YAxis stroke="#94a3b8" fontSize={9} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                itemStyle={{ fontSize: 11 }}
                labelStyle={{ fontSize: 10, fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="planejado" name="Físico Planejado (%)" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPlanejado)" />
              <Area type="monotone" dataKey="realizado" name="Físico Real (%)" stroke="#0ea5e9" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRealizado)" connectNulls />
              <Area type="monotone" dataKey="financeiro" name="Dev. Financ. (%)" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#colorFinanceiro)" connectNulls />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gantt List Header & Stages list */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
            <Calendar size={14} className="text-indigo-400" /> Cronograma de Macro-Etapas
          </h4>
          {!isReadOnly && !hasRealCronograma && (
            <button
              onClick={() => setShowAddEtapa(!showAddEtapa)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-[10px] font-semibold text-slate-100 transition whitespace-nowrap"
            >
              <Plus size={11} /> Adicionar Etapa
            </button>
          )}
        </div>

        {showAddEtapa && (
          <form onSubmit={handleAddEtapaSubmit} className="bg-slate-950 p-4 border-b border-slate-800 space-y-4">
            <h5 className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">Nova Etapa Construtiva</h5>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-2">
                <label className="text-[10px] text-slate-400 block mb-0.5">Nome da Etapa</label>
                <input
                  type="text"
                  placeholder="e.g. Pintura interna e regularização"
                  value={newEtapaName}
                  required
                  onChange={(e) => setNewEtapaName(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded bg-slate-900 border border-slate-850 text-slate-100 placeholder-slate-600"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Início</label>
                <input
                  type="date"
                  value={newStart}
                  required
                  onChange={(e) => setNewStart(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded bg-slate-900 border border-slate-850 text-slate-100"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Fim</label>
                <input
                  type="date"
                  value={newEnd}
                  required
                  onChange={(e) => setNewEnd(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded bg-slate-900 border border-slate-850 text-slate-100"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Valor de Desembolso Previsto</label>
                <input
                  type="number"
                  placeholder="e.g. 50000"
                  value={newDesem}
                  required
                  onChange={(e) => setNewDesem(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded bg-slate-900 border border-slate-850 text-slate-100 placeholder-slate-600"
                />
              </div>
            </div>
            <div className="flex justify-end gap-1.5 text-[10px]">
              <button type="button" onClick={() => setShowAddEtapa(false)} className="px-3 py-1.5 rounded bg-slate-800 text-slate-400">Cancelar</button>
              <button type="submit" className="px-3 py-1.5 rounded bg-indigo-600 text-slate-100 font-bold">Salvar Etapa</button>
            </div>
          </form>
        )}

        <div className="divide-y divide-slate-800/60 p-4 space-y-4">
          {hasRealCronograma ? (
            realObra.cronograma.tarefas.map(etapa => (
              <div key={etapa.eap} className="pt-4 first:pt-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 md:w-1/3">
                  <h5 className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded bg-indigo-500 inline-block"></span>
                    {etapa.titulo}
                  </h5>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono">
                    <span className="flex items-center gap-1"><GitCommit size={11} /> EAP: {etapa.eap}</span>
                  </div>
                </div>

                <div className="flex-1 max-w-xs space-y-1.5">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Progresso de Campo</span>
                    <span className="text-slate-200 font-bold">{Math.round(etapa.percentualConcluido * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full" style={{ width: `${etapa.percentualConcluido * 100}%` }}></div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 text-xs text-right font-mono">
                  <div>
                    <span className="text-slate-500 text-[10px] block">PREVISTO DESEMB.</span>
                    <span className="text-slate-300 font-semibold">{formatCurrency(etapa.financeiroPlanejado)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">REAL CONSOL.</span>
                    <span className="text-indigo-400 font-bold">{etapa.financeiroRealizado > 0 ? formatCurrency(etapa.financeiroRealizado) : '—'}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            cronograma.map((etapa) => {
              const plannedTime = new Date(etapa.endDate).getTime() - new Date(etapa.startDate).getTime();
              const formatedStart = new Date(etapa.startDate).toLocaleDateString('pt-BR');
              const formatedEnd = new Date(etapa.endDate).toLocaleDateString('pt-BR');

              return (
                <div key={etapa.id} className="pt-4 first:pt-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1 md:w-1/3">
                    <h5 className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded bg-indigo-500 inline-block"></span>
                      {etapa.etapaName}
                    </h5>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono">
                      <span className="flex items-center gap-1"><Clock size={11} /> {formatedStart} - {formatedEnd}</span>
                    </div>
                  </div>

                  {/* Progress adjust or display */}
                  <div className="flex-1 max-w-xs space-y-1.5">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-slate-400">Progresso de Campo</span>
                      <span className="text-slate-200 font-bold">{etapa.progressFisicoReal}%</span>
                    </div>

                    {isReadOnly ? (
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full" style={{ width: `${etapa.progressFisicoReal}%` }}></div>
                      </div>
                    ) : (
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={etapa.progressFisicoReal}
                        onChange={(e) => handleProgressChange(etapa.id, parseInt(e.target.value))}
                        className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                    )}
                  </div>

                  {/* Cash flow matching stage */}
                  <div className="flex items-center justify-between md:justify-end gap-6 text-xs text-right font-mono">
                    <div>
                      <span className="text-slate-500 text-[10px] block">PREVISTO DESEMB.</span>
                      <span className="text-slate-300 font-semibold">{formatCurrency(etapa.desembolsoPrevisto)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">REAL CONSOL.</span>
                      <span className="text-indigo-400 font-bold">{etapa.desembolsoReal > 0 ? formatCurrency(etapa.desembolsoReal) : '—'}</span>
                    </div>
                    <div className="w-24 text-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        etapa.status === 'CONCLUIDO'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : etapa.status === 'EM_ANDAMENTO'
                          ? 'bg-amber-500/10 text-amber-400'
                          : etapa.status === 'ATRASADO'
                          ? 'bg-rose-500/10 text-rose-500'
                          : 'bg-slate-800 text-slate-500'
                      }`}>
                        {etapa.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
