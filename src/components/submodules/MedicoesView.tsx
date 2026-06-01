import React, { useState } from 'react';
import { Medicao, UserRole } from '../../types';
import { Obra as RealObra, ContratoMedicao } from '../../types/obra';
import { 
  BarChart, 
  Clock, 
  Check, 
  X, 
  Plus, 
  Trash2, 
  ChevronRight, 
  Layers, 
  Lock,
  Percent,
  TrendingDown
} from 'lucide-react';
import { formatCurrency, formatCurrencyDecimals } from '../../utils/format';

interface MedicoesViewProps {
  medicoes: Medicao[];
  currentRole: UserRole;
  obraCode: string;
  onUpdateMedicoes: (updated: Medicao[]) => void;
  realObra?: RealObra;
}

export function MedicoesView({ medicoes, currentRole, obraCode, onUpdateMedicoes, realObra }: MedicoesViewProps) {
  const [showAddMedicao, setShowAddMedicao] = useState(false);
  const [editingMedicaoId, setEditingMedicaoId] = useState<string | null>(null);

  // Form states
  const [fornecedor, setFornecedor] = useState('');
  const [servico, setServico] = useState('');
  const [valorM, setValorM] = useState('');
  const [valorA, setValorA] = useState('');
  const [retencao, setRetencao] = useState('5'); // Default retention is 5%

  const isReadOnly = currentRole === 'campo' || currentRole === 'engenharia' || currentRole === 'cliente';

  const getStatusColor = (status: Medicao['status']) => {
    switch (status) {
      case 'PAGO':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'APROVADO':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'APROVADO_PARCIAL':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'EM_ANALISE':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'FALHADO':
        return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
    }
  };

  const handleUpdateStatus = (id: string, s: Medicao['status']) => {
    if (isReadOnly) return;
    const updated = medicoes.map(m => {
      if (m.id === id) {
        return { 
          ...m, 
          status: s,
          // If approved, approved value resolves to medido if it was empty, or visa-versa
          valorAprovado: s === 'APROVADO' ? m.valorMedido : m.valorAprovado
        };
      }
      return m;
    });
    onUpdateMedicoes(updated);
  };

  const handleAdjustValue = (id: string, aprovadoVal: number) => {
    const updated = medicoes.map(m => {
      if (m.id === id) {
        return { 
          ...m, 
          valorAprovado: aprovadoVal,
          status: aprovadoVal < m.valorMedido ? 'APROVADO_PARCIAL' as const : 'APROVADO' as const
        };
      }
      return m;
    });
    onUpdateMedicoes(updated);
    setEditingMedicaoId(null);
  };

  const handleCreateMedicaoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fornecedor || !servico || !valorM) return;

    const valMedido = parseFloat(valorM);
    const pct = parseFloat(retencao) || 0;
    if (isNaN(valMedido)) return;

    const valAprovado = valorA ? parseFloat(valorA) : valMedido;
    const valorRetencaoGarantia = Math.round(valMedido * (pct / 100));

    const totalNumberedToday = medicoes.length + 1;
    const dateFormatted = new Date().toISOString().split('T')[0];

    const nova: Medicao = {
      id: `med-${Date.now()}`,
      obraId: medicoes[0]?.obraId || 'sitta',
      numero: totalNumberedToday,
      periodoInicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      periodoFim: dateFormatted,
      dataEmissao: dateFormatted,
      codigoMedicao: `Medição ${totalNumberedToday} — ${dateFormatted} — ${obraCode}`,
      fornecedorNome: fornecedor,
      servicoMedido: servico,
      valorMedido: valMedido,
      valorAprovado: valAprovado,
      status: 'EM_ANALISE',
      retencaoGarantia: valorRetencaoGarantia
    };

    onUpdateMedicoes([nova, ...medicoes]);
    setFornecedor('');
    setServico('');
    setValorM('');
    setValorA('');
    setShowAddMedicao(false);
  };

  const hasRealMedicoes = realObra?.medicoes && realObra.medicoes.length > 0;

  if (hasRealMedicoes) {
    return (
      <div className="space-y-6">
        {realObra.medicoes.map((contrato, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
            <div className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center">
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5 font-display">
                  <BarChart size={14} className="text-indigo-400" /> Contrato: {contrato.servico}
                </h4>
                <p className="text-[10px] text-slate-500 mt-1">Fornecedor: <span className="text-slate-300">{contrato.fornecedor}</span></p>
              </div>
              <div className="flex gap-4 text-[10px] font-mono text-right">
                <div>
                  <span className="text-slate-500 block">Total do Contrato</span>
                  <span className="text-slate-200 font-bold">{formatCurrencyDecimals(contrato.valorTotalContrato)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Total Pago</span>
                  <span className="text-emerald-400 font-bold">{formatCurrencyDecimals(contrato.valorTotalPago)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Em Aberto</span>
                  <span className="text-amber-400 font-bold">{formatCurrencyDecimals(contrato.valorTotalEmAberto)}</span>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto max-h-[500px]">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="sticky top-0 bg-slate-950 shadow">
                  <tr className="border-b border-slate-800 text-slate-400 text-[10px] font-mono whitespace-nowrap">
                    <th className="py-2 px-3">Item</th>
                    <th className="py-2 px-3">Descrição</th>
                    <th className="py-2 px-3">Unid.</th>
                    <th className="py-2 px-3 text-right">Quant.</th>
                    <th className="py-2 px-3 text-right">Preço Unit.</th>
                    <th className="py-2 px-3 text-right">Preço Total</th>
                    <th className="py-2 px-3 text-right">Medido</th>
                    <th className="py-2 px-3 text-right">Saldo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {contrato.itens.map(item => (
                    <tr key={item.item} className="hover:bg-slate-800/10 text-slate-300">
                      <td className="py-2 px-3 font-mono text-slate-500">{item.item}</td>
                      <td className="py-2 px-3 text-slate-200 font-medium">
                        {item.descricao}
                        <span className="block text-[9px] text-slate-500 uppercase">{item.etapa}</span>
                      </td>
                      <td className="py-2 px-3 font-mono text-[10px]">{item.unidade}</td>
                      <td className="py-2 px-3 text-right font-mono">{item.quantidade.toLocaleString('pt-BR')}</td>
                      <td className="py-2 px-3 text-right font-mono">{formatCurrencyDecimals(item.precoUnitario)}</td>
                      <td className="py-2 px-3 text-right font-mono text-slate-300 font-bold">{formatCurrencyDecimals(item.precoTotal)}</td>
                      <td className="py-2 px-3 text-right font-mono text-indigo-400 font-bold">{formatCurrencyDecimals(item.medido)}</td>
                      <td className="py-2 px-3 text-right font-mono text-amber-500 font-bold">{formatCurrencyDecimals(item.saldo)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upper info regarding Garantias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total volume mapped */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-mono font-bold">Fundo de Garantia Retido</span>
            <span className="text-base font-bold font-mono text-indigo-400 mt-1 block">
              {formatCurrency(medicoes.reduce((acc, m) => acc + m.retencaoGarantia, 0))}
            </span>
            <span className="text-[9px] text-slate-500 mt-1 block">Garantia acumulada de subempreiteiras (5%)</span>
          </div>
          <span className="p-2.5 bg-indigo-500/5 border border-indigo-500/10 text-indigo-400 rounded">
            <Lock size={15} />
          </span>
        </div>

        {/* Paid volume */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-mono font-bold">Boletins Homologados & Pagos</span>
            <span className="text-base font-bold font-mono text-emerald-400 mt-1 block">
              {formatCurrency(medicoes.filter(m => m.status === 'PAGO').reduce((acc, m) => acc + m.valorAprovado, 0))}
            </span>
            <span className="text-[9px] text-slate-500 mt-1 block">Valores liquidados pela controladoria de obra</span>
          </div>
          <span className="p-2.5 bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 rounded">
            <Check size={15} />
          </span>
        </div>

        {/* Pending approvals */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-mono font-bold">Boletins Pendentes / Análise</span>
            <span className="text-base font-bold font-mono text-blue-400 mt-1 block">
              {formatCurrency(medicoes.filter(m => m.status === 'EM_ANALISE').reduce((acc, m) => acc + m.valorMedido, 0))}
            </span>
            <span className="text-[9px] text-slate-500 mt-1 block">Valores sob fiscalização técnica de campo</span>
          </div>
          <span className="p-2.5 bg-blue-500/5 border border-blue-500/10 text-blue-400 rounded">
            <Clock size={15} />
          </span>
        </div>
      </div>

      {/* Measurement List Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5 font-display">
            <BarChart size={14} className="text-indigo-400" /> Registro de Boletins de Medição de Empreiteiros
          </h4>
          {!isReadOnly && (
            <button
              onClick={() => setShowAddMedicao(!showAddMedicao)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-indigo-600 hover:bg-indigo-700 text-[10px] font-bold text-slate-100 transition cursor-pointer"
            >
              <Plus size={11} /> Lançar Medição de Fornecedor
            </button>
          )}
        </div>

        {showAddMedicao && (
          <form onSubmit={handleCreateMedicaoSubmit} className="bg-slate-950 p-4 border-b border-slate-850 space-y-3">
            <h5 className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">Registrar Nova Medição</h5>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Empreiteiro / Fornecedor</label>
                <input
                  type="text"
                  placeholder="e.g. Gesso Baroneza"
                  value={fornecedor}
                  required
                  onChange={(e) => setFornecedor(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-100"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Escopo medido</label>
                <input
                  type="text"
                  placeholder="e.g. Pintura de muro oeste"
                  value={servico}
                  required
                  onChange={(e) => setServico(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-100"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Valor Reivindicado (R$)</label>
                <input
                  type="number"
                  placeholder="40000"
                  value={valorM}
                  required
                  onChange={(e) => setValorM(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-100 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Valor Homologado (Opcional - R$)</label>
                <input
                  type="number"
                  placeholder="Deixe vazio para herdar medido"
                  value={valorA}
                  onChange={(e) => setValorA(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-100 font-mono"
                />
              </div>
            </div>
            <div className="flex justify-end gap-1.5 text-[10px] pt-2">
              <button type="button" onClick={() => setShowAddMedicao(false)} className="px-3 py-1.5 bg-slate-800 text-slate-400 rounded">Cancelar</button>
              <button type="submit" className="px-3 py-1.5 bg-indigo-600 font-bold text-slate-100 rounded">Gravar Boletim</button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/20 border-b border-slate-800 text-slate-400 text-[10px] font-mono whitespace-nowrap">
                <th className="py-2.5 px-4">Boletim / Referência</th>
                <th className="py-2.5 px-3">Subempreitada</th>
                <th className="py-2.5 px-3">Escopo Contemplado</th>
                <th className="py-2.5 px-3 text-right">Valor Medido</th>
                <th className="py-2.5 px-3 text-right">Valor Homologado</th>
                <th className="py-2.5 px-3 text-center">Retenção (5%)</th>
                <th className="py-2.5 px-3 text-center">Situação</th>
                <th className="py-2.5 px-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {medicoes.map((med) => {
                const isEditing = editingMedicaoId === med.id;
                const valueDiff = med.valorMedido - med.valorAprovado;

                return (
                  <tr key={med.id} className="hover:bg-slate-800/10 text-slate-300">
                    <td className="py-3 px-4 font-mono">
                      <span className="font-bold text-indigo-400 block">{`BM #${med.numero.toString().padStart(2, '0')}`}</span>
                      <span className="text-[9px] text-slate-500">{med.codigoMedicao}</span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-200">{med.fornecedorNome}</td>
                    <td className="py-3 px-3 text-slate-400">{med.servicoMedido}</td>
                    <td className="py-3 px-3 text-right font-mono text-slate-400">{formatCurrency(med.valorMedido)}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-100">
                      {isEditing ? (
                        <div className="flex gap-1.5 justify-end">
                          <input
                            type="number"
                            placeholder={med.valorAprovado.toString()}
                            id={`inp-aprov-${med.id}`}
                            className="w-24 text-right px-1 py-0.5 bg-slate-950 border border-indigo-500 text-slate-100 font-mono text-xs rounded"
                          />
                          <button
                            onClick={() => {
                              const inputNode = document.getElementById(`inp-aprov-${med.id}`) as HTMLInputElement;
                              const val = parseFloat(inputNode?.value);
                              if (!isNaN(val)) handleAdjustValue(med.id, val);
                            }}
                            className="bg-indigo-600 px-1 py-0.5 rounded text-[10px]"
                          >
                            OK
                          </button>
                        </div>
                      ) : (
                        <div>
                          {formatCurrency(med.valorAprovado)}
                          {valueDiff > 0 && (
                            <span className="block text-[9px] font-bold text-amber-500 font-mono">
                              {`Desconto: -${formatCurrency(valueDiff)}`}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-slate-500">{formatCurrency(med.retencaoGarantia)}</td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold border ${getStatusColor(med.status)}`}>
                        {med.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {isReadOnly ? (
                        <span className="text-slate-500 italic">-</span>
                      ) : (
                        <div className="flex items-center justify-center gap-1.5">
                          {med.status === 'EM_ANALISE' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(med.id, 'APROVADO')}
                                title="Aprovar Integral"
                                className="px-1.5 py-0.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/20 font-bold"
                              >
                                Aprovar
                              </button>
                              <button
                                onClick={() => setEditingMedicaoId(med.id)}
                                title="Aprovar com Desconto/Glosa"
                                className="px-1.5 py-0.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 rounded border border-amber-500/20 font-bold"
                              >
                                Glosar
                              </button>
                            </>
                          )}
                          {med.status === 'APROVADO' && (
                            <button
                              onClick={() => handleUpdateStatus(med.id, 'PAGO')}
                              className="px-1.5 py-0.5 bg-sky-500/15 hover:bg-sky-500/20 text-sky-400 rounded border border-sky-500/10 font-bold font-mono text-[10px]"
                            >
                              Registrar Pago
                            </button>
                          )}
                          {(med.status === 'APROVADO_PARCIAL' || med.status === 'PAGO' || med.status === 'FALHADO') && (
                            <button
                              onClick={() => handleUpdateStatus(med.id, 'EM_ANALISE')}
                              className="text-slate-500 hover:text-slate-300 text-[10px] underline font-mono"
                            >
                              Reabrir
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
