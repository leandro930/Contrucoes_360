import React, { useState } from 'react';
import { QuadroConcorrencia, UserRole } from '../../types';
import { 
  Users, 
  Map, 
  Check, 
  Slash, 
  Plus, 
  ArrowRight, 
  Search, 
  FileCheck, 
  MessageSquare,
  Building,
  Star,
  FileSpreadsheet
} from 'lucide-react';
import { mapaConcorrenciaReal } from '../../data/mapaConcorrenciaReal';
import { formatCurrency } from '../../utils/format';

interface QCProps {
  qcs: QuadroConcorrencia[];
  currentRole: UserRole;
  onUpdateQcs: (updated: QuadroConcorrencia[]) => void;
  catalogoFornecedores: { id: string; nome: string; contato: string; servico: string }[];
}

export function QCView({ qcs, currentRole, onUpdateQcs, catalogoFornecedores }: QCProps) {
  const [innerTab, setInnerTab] = useState<'QCS' | 'MAPA_EXEMPLO' | 'FORNECEDORES'>('MAPA_EXEMPLO');
  const [selectedQcId, setSelectedQcId] = useState<string | null>(qcs[0]?.id || null);
  const [showAddQc, setShowAddQc] = useState(false);

  // Form states
  const [pacoteTitle, setPacoteTitle] = useState('');
  const [reqItemDesc, setReqItemDesc] = useState('');
  const [reqItemQtd, setReqItemQtd] = useState('');
  const [reqItemUn, setReqItemUn] = useState('vb');
  const [addedItems, setAddedItems] = useState<{descricao: string; quantidade: number; unidade: string}[]>([]);

  const isReadOnly = currentRole === 'campo' || currentRole === 'controladoria' || currentRole === 'cliente';

  const activeQc = qcs.find(q => q.id === selectedQcId) || qcs[0];

  const handleSetWinner = (qcId: string, supplierId: string) => {
    if (isReadOnly) return;
    const updated = qcs.map(q => {
      if (q.id === qcId) {
        const nextConcorrentes = q.concorrentes.map(c => ({
          ...c,
          vencedor: c.fornecedorId === supplierId
        }));
        return {
          ...q,
          status: 'FECHADO' as const,
          dataFechamento: new Date().toISOString().split('T')[0],
          concorrentes: nextConcorrentes
        };
      }
      return q;
    });
    onUpdateQcs(updated);
  };

  const handleAddItemToForm = () => {
    if (!reqItemDesc || !reqItemQtd) return;
    const qtd = parseFloat(reqItemQtd);
    if (isNaN(qtd)) return;
    setAddedItems([...addedItems, { descricao: reqItemDesc, quantidade: qtd, unidade: reqItemUn }]);
    setReqItemDesc('');
    setReqItemQtd('');
  };

  const handleCreateQcSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pacoteTitle) return;

    // Build unique ID with sequence format AAAAMM-QC-NNN
    const date = new Date();
    const prefix = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    const trackingCode = `${prefix}-QC-0${qcs.length + 2}`;

    // Assemble default contestants for testing (e.g. Nova Engemetal and Flora depending on scope)
    const mockConcorrentes = [
      {
        fornecedorId: 'fc-1',
        fornecedorNome: 'Gesso Baroneza LTDA',
        cotacaoTotal: 48000,
        condicaoPagamento: 'Fatura 30 dias',
        vencedor: false,
        observacoes: 'Material de primeira linha. Envia engenharia para medições prévias via laser.',
        itensCotados: addedItems.map((_, idx) => ({ itemId: `it-${idx}`, precoUnitario: 1200, prazoEntregaDias: 15 }))
      },
      {
        fornecedorId: 'fc-3',
        fornecedorNome: 'Nova Engemetal',
        cotacaoTotal: 52000,
        condicaoPagamento: 'Fatura 30/60 ddl',
        vencedor: false,
        observacoes: 'Garante compatibilização BIM mecânica. Equipe de montagem inclusa.',
        itensCotados: addedItems.map((_, idx) => ({ itemId: `it-${idx}`, precoUnitario: 1350, prazoEntregaDias: 20 }))
      }
    ];

    const nova: QuadroConcorrencia = {
      id: trackingCode,
      obraId: qcs[0]?.obraId || 'sitta',
      pacoteNome: pacoteTitle,
      status: 'EM_COTACAO',
      dataCriacao: new Date().toISOString().split('T')[0],
      revisao: 0,
      itensRequisitados: addedItems.map((it, idx) => ({ id: `it-${idx}`, ...it })),
      concorrentes: mockConcorrentes
    };

    onUpdateQcs([nova, ...qcs]);
    setSelectedQcId(nova.id);
    setPacoteTitle('');
    setAddedItems([]);
    setShowAddQc(false);
  };

  return (
    <div className="space-y-6">
      {/* Upper Navigation Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setInnerTab('MAPA_EXEMPLO')}
          className={`px-4 py-2 border-b-2 text-xs font-bold uppercase tracking-wider cursor-pointer transition flex items-center gap-1.5 ${
            innerTab === 'MAPA_EXEMPLO' 
              ? 'border-indigo-500 text-slate-100' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileSpreadsheet size={14} /> Mapa Concorrência Real
        </button>
        <button
          onClick={() => setInnerTab('QCS')}
          className={`px-4 py-2 border-b-2 text-xs font-bold uppercase tracking-wider cursor-pointer transition flex items-center gap-1.5 ${
            innerTab === 'QCS' 
              ? 'border-indigo-500 text-slate-100' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Map size={14} /> Acervos QC
        </button>
        <button
          onClick={() => setInnerTab('FORNECEDORES')}
          className={`px-4 py-2 border-b-2 text-xs font-bold uppercase tracking-wider cursor-pointer transition flex items-center gap-1.5 ${
            innerTab === 'FORNECEDORES' 
              ? 'border-indigo-500 text-slate-100' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building size={14} /> Fornecedores Vinculados
        </button>
      </div>

      {innerTab === 'MAPA_EXEMPLO' && (
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg space-y-6">
          <div className="flex justify-between items-center border-b border-slate-850 pb-4">
             <div>
               <h3 className="text-sm font-bold font-display text-slate-100 flex items-center gap-2">
                 <FileSpreadsheet size={16} className="text-indigo-400"/> Mapa de Concorrência
               </h3>
               <p className="text-[10px] text-slate-500 mt-1 font-mono">{mapaConcorrenciaReal?.id} - {mapaConcorrenciaReal?.pacote}</p>
             </div>
             <div className="bg-slate-950 px-3 py-1.5 rounded border border-slate-800 text-center">
                <span className="block text-[10px] uppercase font-bold text-slate-500">Status</span>
                <span className="text-[10px] font-bold text-emerald-400 font-mono">{mapaConcorrenciaReal?.status}</span>
             </div>
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded-lg bg-slate-950">
             <table className="w-full text-left border-collapse text-xs">
                <thead>
                   <tr className="border-b border-slate-800 bg-slate-950">
                     <th className="py-3 px-4 text-slate-500 font-mono text-[9px] uppercase tracking-wider w-1/3">Item Cotado</th>
                     {mapaConcorrenciaReal?.propostas?.map((proposta, idx) => {
                       const isWinner = mapaConcorrenciaReal.fornecedorVencedor === proposta.fornecedor;
                       return (
                       <th key={idx} className={`py-3 px-3 text-center border-l w-1/3 ${isWinner ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-slate-800'}`}>
                         <h5 className={`font-bold line-clamp-1 ${isWinner ? 'text-emerald-400' : 'text-slate-200'}`}>
                           {proposta.fornecedor}
                         </h5>
                         {isWinner && (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[8px] font-bold font-mono uppercase mt-1">
                              <Star size={10} className="fill-emerald-400" /> Vencedor
                            </span>
                         )}
                       </th>
                     )})}
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                   {(mapaConcorrenciaReal?.propostas?.[0]?.itens || []).map((it, idx) => (
                     <tr key={idx} className="hover:bg-slate-900/10">
                        <td className="py-2.5 px-4 font-semibold text-slate-300">
                          {it.descricao}
                          <span className="block text-[10px] text-slate-500 font-mono mt-0.5">{it.quantidade} {it.unidade}</span>
                        </td>
                        {mapaConcorrenciaReal?.propostas?.map((proposta, fIdx) => {
                          const o = proposta.itens[idx];
                          const isWinner = mapaConcorrenciaReal.fornecedorVencedor === proposta.fornecedor;
                          return (
                            <td key={fIdx} className={`py-2.5 px-3 text-center border-l font-mono text-[11px] ${isWinner ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-slate-800'}`}>
                              <span>{formatCurrency(o?.precoTotal || 0)}</span>
                              <span className="block text-[9px] text-slate-500 mt-1">{formatCurrency(o?.precoUnitario || 0)} / {o?.unidade || 'un'}</span>
                            </td>
                          );
                        })}
                     </tr>
                   ))}

                   <tr className="bg-slate-900/50 border-t border-slate-800">
                      <td className="py-3 px-4 font-display font-bold text-[10px] uppercase text-slate-400 font-mono">Total Inicial</td>
                      {mapaConcorrenciaReal?.propostas?.map((proposta, idx) => {
                         const isWinner = mapaConcorrenciaReal.fornecedorVencedor === proposta.fornecedor;
                         return (
                         <td key={idx} className={`py-3 px-3 text-center border-l text-sm font-bold ${isWinner ? 'border-emerald-500/30 bg-emerald-500/5 text-slate-300' : 'border-slate-800 text-slate-400'}`}>
                            {formatCurrency(proposta.totalPropostaInicial || 0)}
                         </td>
                      )})}
                   </tr>
                   <tr className="bg-slate-900 border-t border-slate-800">
                      <td className="py-3 px-4 font-display font-bold text-[10px] uppercase text-slate-400 font-mono">Total Final (Pós Negoc.)</td>
                      {mapaConcorrenciaReal?.propostas?.map((proposta, idx) => {
                         const isWinner = mapaConcorrenciaReal.fornecedorVencedor === proposta.fornecedor;
                         return (
                         <td key={idx} className={`py-3 px-3 text-center border-l text-sm font-bold ${isWinner ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-slate-800 text-slate-300'}`}>
                            {formatCurrency(proposta.totalPropostaFinal || 0)}
                         </td>
                      )})}
                   </tr>
                   <tr className="bg-slate-900/50 border-t border-slate-800">
                      <td className="py-3 px-4 font-display font-bold text-[10px] uppercase text-slate-400 font-mono">Desconto Negociado</td>
                      {mapaConcorrenciaReal?.propostas?.map((proposta, idx) => {
                         const isWinner = mapaConcorrenciaReal.fornecedorVencedor === proposta.fornecedor;
                         return (
                         <td key={idx} className={`py-3 px-3 text-center border-l text-[11px] font-bold ${isWinner ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-500' : 'border-slate-800 text-slate-400'}`}>
                            {proposta.percentualDesconto ? `${(proposta.percentualDesconto * 100).toFixed(1)}%` : '—'}
                         </td>
                      )})}
                   </tr>
                   <tr className="bg-slate-900/50 border-t border-slate-800">
                      <td className="py-3 px-4 font-display font-bold text-[10px] uppercase text-slate-400 font-mono">Variação vs Orçamento</td>
                      {mapaConcorrenciaReal?.propostas?.map((proposta, idx) => {
                         const isWinner = mapaConcorrenciaReal.fornecedorVencedor === proposta.fornecedor;
                         const varOrc = proposta.variacaoVsOrcamento || 0;
                         return (
                         <td key={idx} className={`py-3 px-3 text-center border-l text-[11px] font-bold ${isWinner ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-slate-800'} ${varOrc > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                            {varOrc > 0 ? '+' : ''}{(varOrc * 100).toFixed(1)}%
                         </td>
                      )})}
                   </tr>
                </tbody>
             </table>
          </div>
        </div>
      )}

      {innerTab === 'FORNECEDORES' && (
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono flex items-center gap-1.5">
              <Building size={14} className="text-indigo-400" /> Fornecedores de Cópia Controlada (Herdados do Catálogo)
            </h4>
            <span className="text-[10px] text-slate-500 font-mono italic">Bloqueado para quick-add conforme Single Source of Truth</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {catalogoFornecedores.map(f => (
              <div key={f.id} className="bg-slate-950 border border-slate-850 p-4 rounded flex items-start gap-3 col-span-1">
                <div className="p-2 bg-indigo-500/5 text-indigo-400 rounded border border-indigo-500/10">
                  <Users size={15} />
                </div>
                <div className="space-y-1">
                  <h5 className="font-bold text-xs text-slate-200">{f.nome}</h5>
                  <p className="text-[10px] text-indigo-400 font-semibold font-mono bg-indigo-500/5 px-2 py-0.5 rounded inline-block">
                    {f.servico}
                  </p>
                  <p className="text-[11px] text-slate-450 pt-1.5">{f.contato}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {innerTab === 'QCS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left QC list switcher */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-slate-450 uppercase tracking-wider font-mono">Quadro de Cotações</span>
                {!isReadOnly && (
                  <button
                    onClick={() => setShowAddQc(!showAddQc)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-slate-100 text-[10px] font-bold px-2 py-0.5 rounded transition"
                  >
                    Novo QC
                  </button>
                )}
              </div>

              <div className="space-y-1.5 max-h-120 overflow-y-auto">
                {qcs.map((q) => {
                  const hasWinner = q.concorrentes.some(c => c.vencedor);
                  const winnerName = q.concorrentes.find(c => c.vencedor)?.fornecedorNome;

                  return (
                    <div
                      key={q.id}
                      onClick={() => {
                        setSelectedQcId(q.id);
                        setShowAddQc(false);
                      }}
                      className={`p-3 rounded border text-left cursor-pointer transition ${
                        activeQc?.id === q.id
                          ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400'
                          : 'bg-slate-950 border-slate-900 text-slate-300 hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-[10px] font-mono font-bold bg-slate-900 border border-slate-850 text-indigo-400 px-1.5 py-0.2 rounded">
                          {q.id}
                        </span>
                        <span className={`px-1.5 py-0.2 text-[8px] font-bold rounded ${
                          q.status === 'FECHADO' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-400'
                        }`}>
                          {q.status}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-slate-100 mt-2 line-clamp-1">{q.pacoteNome}</h5>
                      
                      {hasWinner ? (
                        <p className="text-[10px] text-emerald-400 font-mono mt-2 flex items-center gap-1">
                          ✔ Ganhador: <span className="font-semibold">{winnerName}</span>
                        </p>
                      ) : (
                        <p className="text-[10px] text-slate-500 font-mono mt-2 italic">Aguardando definição ganhador</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right QC Comparative Grid */}
          <div className="lg:col-span-8">
            {showAddQc ? (
              <form onSubmit={handleCreateQcSubmit} className="bg-slate-900 border border-slate-800 p-5 rounded-lg space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold font-display text-slate-200">Criar Novo Mapas de Concorrência (QC)</h3>
                  <button type="button" onClick={() => setShowAddQc(false)} className="text-xs text-slate-400">Voltar</button>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Descrição do Pacote de Licitação</label>
                  <input
                    type="text"
                    placeholder="e.g. Fornecimento de Esquadrias Alumínio Linha Única"
                    value={pacoteTitle}
                    required
                    onChange={(e) => setPacoteTitle(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-slate-100"
                  />
                </div>

                {/* Items specification assembly */}
                <div className="bg-slate-950 p-3.5 border border-slate-850 rounded space-y-3">
                  <span className="text-[10px] font-bold text-indigo-400 block font-mono uppercase tracking-widest">Registrar Itens Requisitados</span>
                  <div className="grid grid-cols-6 gap-2">
                    <div className="col-span-3">
                      <input
                        type="text"
                        placeholder="Insumo det."
                        value={reqItemDesc}
                        onChange={(e) => setReqItemDesc(e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-100"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Qtd"
                        value={reqItemQtd}
                        onChange={(e) => setReqItemQtd(e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-100 font-mono"
                      />
                    </div>
                    <div>
                      <select
                        value={reqItemUn}
                        onChange={(e) => setReqItemUn(e.target.value)}
                        className="w-full text-xs px-2 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-100 font-mono"
                      >
                        <option value="vb">vb</option>
                        <option value="m²">m²</option>
                        <option value="m³">m³</option>
                        <option value="un">un</option>
                        <option value="ton">ton</option>
                      </select>
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={handleAddItemToForm}
                        className="w-full py-1.5 bg-indigo-600 rounded text-xs font-bold text-slate-100 hover:bg-indigo-700"
                      >
                        Acre.
                      </button>
                    </div>
                  </div>

                  {addedItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs bg-slate-900 px-2.5 py-1 rounded text-slate-300">
                      <span>{item.descricao}</span>
                      <span className="font-mono text-slate-400">{item.quantidade} {item.unidade}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-1.5 text-xs pt-3">
                  <button type="button" onClick={() => setShowAddQc(false)} className="px-3 py-1.5 bg-slate-850 text-slate-400 rounded">Cancelar</button>
                  <button type="submit" className="px-3 py-1.5 bg-indigo-600 font-bold text-slate-100 rounded">Autogerar Concorrência</button>
                </div>
              </form>
            ) : activeQc ? (
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-850 pb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest">{activeQc.id} · REV {activeQc.revisao}</span>
                    <h3 className="text-base font-bold font-display text-slate-100">{activeQc.pacoteNome}</h3>
                    <p className="text-[11px] text-slate-500 font-mono">Criado em: {activeQc.dataCriacao} {activeQc.dataFechamento ? `| Fechado em: ${activeQc.dataFechamento}` : ''}</p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    activeQc.status === 'FECHADO' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  }`}>
                    {activeQc.status}
                  </span>
                </div>

                {/* Side-by-Side Comparison Matrix */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                    <Map size={14} className="text-indigo-400" /> Comparativo de Cotações Lado a Lado
                  </h4>

                  <div className="overflow-x-auto border border-slate-800 rounded-lg bg-slate-950">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 bg-slate-950">
                          <th className="py-3 px-4 text-slate-500 font-mono text-[9px] uppercase tracking-wider w-1/3">Item Solicitado</th>
                          {activeQc.concorrentes.map((con, idx) => (
                            <th key={con.fornecedorId} className="py-3 px-3 text-center border-l border-slate-800 w-1/3">
                              <h5 className="font-bold text-slate-200 line-clamp-1">{con.fornecedorNome}</h5>
                              {con.vencedor && (
                                <span className="inline-flex items-center gap-0.5 px-2 py-0.2 rounded bg-emerald-500/10 text-emerald-400 text-[8px] font-bold font-mono uppercase mt-1">
                                  ✔ Homologado
                                </span>
                              )}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {activeQc.itensRequisitados.map((it, itIdx) => (
                          <tr key={it.id} className="hover:bg-slate-900/10">
                            <td className="py-2.5 px-4 font-semibold text-slate-300">
                              {it.descricao}
                              <span className="block text-[10px] text-slate-500 font-mono font-normal mt-0.5">Demanda: {it.quantidade} {it.unidade}</span>
                            </td>

                            {/* Contestants values columns */}
                            {activeQc.concorrentes.map((con) => {
                              const cotado = con.itensCotados[itIdx] || con.itensCotados[0];
                              const precoUn = cotado ? cotado.precoUnitario : 0;
                              const unitTotal = precoUn * it.quantidade;

                              return (
                                <td key={con.fornecedorId} className="py-2.5 px-3 text-center border-l border-slate-800 text-slate-300 font-mono font-medium">
                                  <span>{formatCurrency(unitTotal)}</span>
                                  <span className="block text-[9px] text-slate-500">{`${formatCurrency(precoUn)} / ${it.unidade}`}</span>
                                </td>
                              );
                            })}
                          </tr>
                        ))}

                        {/* Totals and specs row */}
                        <tr className="bg-slate-950 border-t border-slate-800 font-mono text-slate-100 font-bold">
                          <td className="py-3 px-4 font-display font-bold text-xs uppercase text-slate-400">Preço Global Ofertado</td>
                          {activeQc.concorrentes.map((con) => (
                            <td key={con.fornecedorId} className="py-3 px-3 text-center border-l border-slate-800 text-sm font-semibold text-indigo-400">
                              {formatCurrency(con.cotacaoTotal)}
                            </td>
                          ))}
                        </tr>

                        <tr className="bg-slate-950 font-mono text-[11px] text-slate-400">
                          <td className="py-3 px-4">Condição de Faturamento</td>
                          {activeQc.concorrentes.map((con) => (
                            <td key={con.fornecedorId} className="py-3 px-3 text-center border-l border-slate-800 text-[10px] leading-relaxed">
                              {con.condicaoPagamento}
                            </td>
                          ))}
                        </tr>

                        <tr className="bg-slate-950/40 text-slate-400">
                          <td className="py-3 px-4">Observações de Qualificação Técnica</td>
                          {activeQc.concorrentes.map((con) => (
                            <td key={con.fornecedorId} className="py-3 px-3 text-left border-l border-slate-800 text-[10px] italic leading-normal pr-3">
                              {con.observacoes}
                            </td>
                          ))}
                        </tr>

                        {/* Set winner actions row */}
                        {!isReadOnly && (
                          <tr className="bg-slate-955 border-t border-slate-850">
                            <td className="py-3.5 px-4 font-mono text-[10px] text-slate-550 uppercase">Homologar Subcontratação</td>
                            {activeQc.concorrentes.map((con) => (
                              <td key={con.fornecedorId} className="py-3.5 px-3 text-center border-l border-slate-800">
                                {con.vencedor ? (
                                  <span className="text-[10px] font-bold text-emerald-500 font-mono">⭐ VENCEDOR HOMOLOGADO</span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleSetWinner(activeQc.id, con.fornecedorId)}
                                    className="px-3 py-1 bg-indigo-600 hover:bg-slate-800 text-[10px] font-bold text-slate-100 rounded transition whitespace-nowrap"
                                  >
                                    Eleger Ganhador
                                  </button>
                                )}
                              </td>
                            ))}
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-850 p-12 text-center rounded-lg text-slate-500 italic">
                Nenhum mapas de concorrência disponível.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
