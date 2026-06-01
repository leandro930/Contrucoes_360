import React from 'react';
import { Obra as RealObra } from '../../types/obra';
import { resumirAlertas } from '../../data/alertas';
import { Target, AlertTriangle, AlertCircle, Info, DollarSign, Clock, ListChecks, ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

interface RadarDesviosViewProps {
  realObra?: RealObra;
}

export function RadarDesviosView({ realObra }: RadarDesviosViewProps) {
  if (!realObra) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-12 text-center">
        <Target className="mx-auto h-12 w-12 text-slate-600 mb-4" />
        <h3 className="text-sm font-bold font-display text-slate-200">Radar Indisponível</h3>
        <p className="text-xs text-slate-400 mt-2">Dados detalhados não encontrados para esta obra.</p>
      </div>
    );
  }

  const resumo = resumirAlertas(realObra);
  
  if (resumo.total === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-12 text-center">
        <Target className="mx-auto h-12 w-12 text-emerald-500 mb-4" />
        <h3 className="text-sm font-bold font-display text-slate-200">Nenhum desvio detectado</h3>
        <p className="text-xs text-slate-400 mt-2">A obra está operando dentro dos parâmetros de normalidade.</p>
      </div>
    );
  }

  const getIcon = (categoria: string) => {
    switch (categoria) {
      case 'custo': return <DollarSign size={16} />;
      case 'prazo': return <Clock size={16} />;
      case 'financeiro': return <DollarSign size={16} />;
      case 'qualidade': return <ListChecks size={16} />;
      case 'medicao': return <ListChecks size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold font-display text-slate-100 flex items-center gap-2">
            <Target className="text-indigo-400" size={18} /> Resumo do Radar de Desvios
          </h3>
          <p className="text-xs text-slate-500 mt-1">Status automático baseado em regras cruzadas</p>
        </div>
        <div className="flex gap-4 text-center">
          <div className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2">
            <span className="block text-xl font-bold font-mono text-rose-500">{resumo.criticos}</span>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Críticos</span>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2">
            <span className="block text-xl font-bold font-mono text-amber-500">{resumo.atencao}</span>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Atenção</span>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2">
            <span className="block text-xl font-bold font-mono text-sky-500">{resumo.informativos}</span>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Informativos</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {resumo.alertas.map(alerta => (
          <div 
            key={alerta.id} 
            className={`bg-slate-900 border border-slate-800 rounded-lg p-4 flex gap-4 ${
              alerta.severidade === 'critico' ? 'border-l-4 border-l-rose-500' :
              alerta.severidade === 'atencao' ? 'border-l-4 border-l-amber-500' :
              'border-l-4 border-l-sky-500'
            }`}
          >
            <div className={`mt-1 ${
              alerta.severidade === 'critico' ? 'text-rose-500' :
              alerta.severidade === 'atencao' ? 'text-amber-500' :
              'text-sky-500'
            }`}>
              {alerta.severidade === 'critico' ? <AlertTriangle size={20} /> :
               alerta.severidade === 'atencao' ? <AlertCircle size={20} /> :
               <Info size={20} />}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1">
                      {getIcon(alerta.categoria)} {alerta.categoria}
                    </span>
                    <span className="text-[9px] font-mono text-slate-600 bg-slate-950 px-1.5 py-0.5 rounded">
                      {alerta.origemRef}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-200">{alerta.titulo}</h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{alerta.detalhe}</p>
                </div>
                {alerta.valorReferencia !== undefined && (
                  <div className="text-right">
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">Ref</span>
                    <span className="text-xs font-mono font-bold text-slate-300">
                      {alerta.categoria === 'prazo' ? `${alerta.valorReferencia} d` : formatCurrency(alerta.valorReferencia)}
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-3 flex justify-between items-center text-[10px]">
                <span className="font-mono text-slate-500">{alerta.id}</span>
                <button className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 transition-colors">
                  Ver origem <ArrowUpRight size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
