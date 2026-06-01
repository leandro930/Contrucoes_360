import React, { useState } from 'react';
import { Contrato, UserRole } from '../../types';
import { 
  FileText, 
  Calendar, 
  Award, 
  Plus, 
  Check, 
  AlertCircle, 
  DollarSign 
} from 'lucide-react';
import { formatCurrency } from '../../utils/format';

interface ContratoViewProps {
  contrato: Contrato;
  currentRole: UserRole;
  onUpdateContrato: (updated: Contrato) => void;
}

export function ContratoView({ contrato, currentRole, onUpdateContrato }: ContratoViewProps) {
  const [showAddAditivo, setShowAddAditivo] = useState(false);
  const [aditivoDesc, setAditivoDesc] = useState('');
  const [aditivoVal, setAditivoVal] = useState('');

  const isReadOnly = currentRole === 'campo' || currentRole === 'engenharia';

  const handleAddAditivo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aditivoDesc || !aditivoVal) return;

    const val = parseFloat(aditivoVal);
    if (isNaN(val)) return;

    const novoAditivo = {
      id: `ad-${Date.now()}`,
      numero: `TA-0${contrato.aditivos.length + 1}`,
      data: new Date().toISOString().split('T')[0],
      descricao: aditivoDesc,
      valor: val
    };

    const updated: Contrato = {
      ...contrato,
      valorAditivos: contrato.valorAditivos + val,
      aditivos: [...contrato.aditivos, novoAditivo]
    };

    onUpdateContrato(updated);
    setAditivoDesc('');
    setAditivoVal('');
    setShowAddAditivo(false);
  };

  const toggleMarcoStatus = (marcoId: string) => {
    if (isReadOnly) return;
    const updatedMarcos = contrato.marcos.map(m => {
      if (m.id === marcoId) {
        const nextStatus = (m.status === 'CONCLUIDO' ? 'PENDENTE' : m.status === 'PENDENTE' ? 'ATRASADO' : 'CONCLUIDO') as 'CONCLUIDO' | 'PENDENTE' | 'ATRASADO';
        return { ...m, status: nextStatus };
      }
      return m;
    });

    onUpdateContrato({
      ...contrato,
      marcos: updatedMarcos
    });
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded">
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400">Modalidade Contratual</span>
          <p className="text-sm font-semibold text-slate-100 mt-1">{contrato.modality}</p>
          <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-slate-400">
            <Award size={14} className="text-yellow-500" /> Referência: {contrato.documentoRef}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded">
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400">Valor Contratado Base</span>
          <p className="text-sm font-bold font-mono text-slate-100 mt-1">{formatCurrency(contrato.valorOriginal)}</p>
          <div className="flex items-center gap-1 mt-2.5 text-[11px] text-slate-400">
            Assinatura: {contrato.dataAssinatura}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded">
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400">Valor Consolidado c/ Aditivos</span>
          <p className="text-sm font-bold font-mono text-indigo-400 mt-1">{formatCurrency(contrato.valorOriginal + contrato.valorAditivos)}</p>
          <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-emerald-400">
            Aditivos aprovados: {formatCurrency(contrato.valorAditivos)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Escopo e Focos */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <FileText size={14} className="text-indigo-400" /> Escopo Contratado Detalhado
            </h3>
            <ul className="space-y-2">
              {contrato.escopoResumido.map((item, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Premissas e Focos de Controle
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {contrato.focosContratuais.map((foco, idx) => (
                <div key={idx} className="bg-slate-950 p-3 rounded border border-slate-800/40">
                  <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                    {foco}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Aditivos */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                📌 Aditivos Contratuais (Termo Aditivo)
              </h3>
              {!isReadOnly && (
                <button
                  onClick={() => setShowAddAditivo(!showAddAditivo)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-[10px] font-semibold text-slate-100 transition"
                >
                  <Plus size={10} /> Novo Termo
                </button>
              )}
            </div>

            {showAddAditivo && (
              <form onSubmit={handleAddAditivo} className="bg-slate-950 border border-slate-800 p-3.5 rounded mb-4 space-y-3">
                <h4 className="text-xs font-semibold text-slate-300">Criar Termo Aditivo</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="text-[10px] text-slate-400 block mb-1">Descrição do escopo extra</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Alteração pia de granito para cuba escupida crema marfil"
                      value={aditivoDesc}
                      required
                      onChange={(e) => setAditivoDesc(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Impacto Financeiro (R$)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 15000"
                      value={aditivoVal}
                      required
                      onChange={(e) => setAditivoVal(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 text-[10px]">
                  <button 
                    type="button" 
                    onClick={() => setShowAddAditivo(false)} 
                    className="px-2.5 py-1.5 rounded bg-slate-800 text-slate-400 hover:bg-slate-700"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="px-2.5 py-1.5 rounded bg-indigo-600 text-slate-100 hover:bg-indigo-700 font-bold"
                  >
                    Adicionar Termo
                  </button>
                </div>
              </form>
            )}

            {contrato.aditivos.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-2 bg-slate-950 rounded text-center">Nenhum termo aditivo registrado para esta obra.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-[10px] font-mono">
                      <th className="py-2">Código</th>
                      <th className="py-2">Data</th>
                      <th className="py-2">Descrição</th>
                      <th className="py-2 text-right">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {contrato.aditivos.map((aditivo) => (
                      <tr key={aditivo.id} className="text-slate-300">
                        <td className="py-2 font-mono font-bold text-indigo-400">{aditivo.numero}</td>
                        <td className="py-2 text-slate-400 font-mono">{aditivo.data}</td>
                        <td className="py-2 pr-4">{aditivo.descricao}</td>
                        <td className="py-2 text-right font-mono font-semibold text-slate-100">{formatCurrency(aditivo.valor)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Marcos Contratuais */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center justify-between">
            <span>🎯 Marcos Contratuais</span>
            {!isReadOnly && <span className="text-[10px] font-mono text-slate-500 lowercase font-normal italic">clique para alterar status</span>}
          </h3>

          <div className="relative border-l border-slate-800 ml-3.5 pl-5 space-y-5">
            {contrato.marcos.map((marco) => (
              <div key={marco.id} className="relative">
                {/* Visual Circle Indicator */}
                <div 
                  onClick={() => toggleMarcoStatus(marco.id)}
                  className={`absolute -left-[29px] top-1.5 h-4.5 w-4.5 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
                    marco.status === 'CONCLUIDO' 
                      ? 'bg-slate-950 border-emerald-500 text-emerald-400' 
                      : marco.status === 'ATRASADO'
                      ? 'bg-slate-950 border-rose-500 text-rose-400'
                      : 'bg-slate-900 border-slate-600 text-slate-400'
                  }`}
                  title={isReadOnly ? marco.status : "Clique para alterar status"}
                >
                  {marco.status === 'CONCLUIDO' && <Check size={8} />}
                  {marco.status === 'ATRASADO' && <AlertCircle size={8} />}
                </div>

                <div className="space-y-1">
                  <h4 className={`text-xs font-semibold ${marco.status === 'CONCLUIDO' ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                    {marco.titulo}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] font-mono">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Calendar size={10} /> Previsto: {marco.dataPrevista}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] ${
                      marco.status === 'CONCLUIDO' 
                        ? 'bg-emerald-500/10 text-emerald-500' 
                        : marco.status === 'ATRASADO'
                        ? 'bg-rose-500/10 text-rose-500 font-bold'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {marco.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
