import React, { useState } from 'react';
import { FichaVerificacaoServico, UserRole } from '../../types';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Clock, 
  Search, 
  ShieldCheck, 
  ChevronRight,
  ClipboardList,
  BookOpen,
  FlaskConical,
  Beaker,
  FileCheck
} from 'lucide-react';
import { catalogoFVS, catalogoPE } from '../../data/bibliotecaQualidade';
import { controleCPExemplo } from '../../data/governancaExemplos';

interface QualidadeProps {
  qualidades: FichaVerificacaoServico[];
  currentRole: UserRole;
  onUpdateQualidades: (updated: FichaVerificacaoServico[]) => void;
}

export function QualidadeView({ qualidades, currentRole, onUpdateQualidades }: QualidadeProps) {
  const [innerTab, setInnerTab] = useState<'FVS_ATIVAS' | 'BIBLIOTECA' | 'CONTROLE_TECNOL'>('BIBlIOTECA' as any);
  
  // FVS Ativas states
  const [selectedFvsId, setSelectedFvsId] = useState<string | null>(qualidades[0]?.id || null);
  const [showAddFvs, setShowAddFvs] = useState(false);

  // Form states
  const [servicoName, setServicoName] = useState('');
  const [setorObra, setSetorObra] = useState('');
  const [responsavelName, setResponsavelName] = useState('Felipe Rosa (Eng. Residente)');
  const [checklistInput, setChecklistInput] = useState('');
  const [addedChecklistItems, setAddedChecklistItems] = useState<string[]>([]);

  // RNC edit states
  const [editingRncId, setEditingRncId] = useState<string | null>(null);
  const [rncTratativaText, setRncTratativaText] = useState('');

  const isReadOnly = currentRole === 'controladoria' || currentRole === 'cliente';

  const activeFvs = qualidades.find(q => q.id === selectedFvsId) || qualidades[0];

  const getStatusBadge = (status: FichaVerificacaoServico['status']) => {
    switch (status) {
      case 'CONFORME':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><CheckCircle size={12} /> Conforme</span>;
      case 'NAO_CONFORME':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20"><XCircle size={12} /> Não Conforme</span>;
      case 'RETRABALHO':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20"><AlertTriangle size={12} /> Retrabalho</span>;
    }
  };

  const handleToggleItemVal = (fvsId: string, itemIdx: number) => {
    if (isReadOnly) return;
    const updated = qualidades.map(fvs => {
      if (fvs.id === fvsId) {
        const nextItens = fvs.itensVerificados.map((item, idx) => {
          if (idx === itemIdx) {
            return { ...item, conforme: !item.conforme };
          }
          return item;
        });

        // Compute overall status based on checklist conformal levels
        const allOk = nextItens.every(i => i.conforme);
        const nextStatus = allOk ? 'CONFORME' as const : 'NAO_CONFORME' as const;

        // Auto transition RNC states
        let nextRnc = fvs.rncVinculada;
        if (nextStatus === 'CONFORME' && nextRnc) {
          nextRnc = { ...nextRnc, status: 'RESOLVIDA' };
        } else if (nextStatus === 'NAO_CONFORME' && !nextRnc) {
          nextRnc = {
            id: `rnc-${Date.now()}`,
            origem: fvs.servicoName.split(' ')[0],
            tratativa: 'Aguardando diagnóstico técnico e especificação de reparo.',
            status: 'ABERTA'
          };
        }

        return {
          ...fvs,
          status: nextStatus,
          itensVerificados: nextItens,
          rncVinculada: nextRnc
        };
      }
      return fvs;
    });

    onUpdateQualidades(updated);
  };

  const handleUpdateRncTratativa = (fvsId: string) => {
    if (!rncTratativaText) return;
    const updated = qualidades.map(fvs => {
      if (fvs.id === fvsId && fvs.rncVinculada) {
        return {
          ...fvs,
          rncVinculada: {
            ...fvs.rncVinculada,
            tratativa: rncTratativaText,
            status: 'EM_TRATATIVA' as const
          }
        };
      }
      return fvs;
    });
    onUpdateQualidades(updated);
    setEditingRncId(null);
    setRncTratativaText('');
  };

  const handleSetRncResolved = (fvsId: string) => {
    const updated = qualidades.map(fvs => {
      if (fvs.id === fvsId && fvs.rncVinculada) {
        // Resolve FVS and make all items true
        const nextItens = fvs.itensVerificados.map(i => ({ ...i, conforme: true }));
        return {
          ...fvs,
          status: 'CONFORME' as const,
          itensVerificados: nextItens,
          rncVinculada: {
            ...fvs.rncVinculada,
            status: 'RESOLVIDA' as const
          }
        };
      }
      return fvs;
    });
    onUpdateQualidades(updated);
  };

  const handleAddFvsItemInput = () => {
    if (!checklistInput) return;
    setAddedChecklistItems([...addedChecklistItems, checklistInput]);
    setChecklistInput('');
  };

  const handleCreateFvsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!servicoName || !setorObra) return;

    const checklistReal = addedChecklistItems.length > 0 
      ? addedChecklistItems.map(desc => ({ descricao: desc, conforme: true }))
      : [
          { descricao: 'Conformidade de nível tridimensional', conforme: true },
          { descricao: 'Padrão estético visual homogêneo', conforme: true }
        ];

    const nova: FichaVerificacaoServico = {
      id: `fvs-${Date.now()}`,
      obraId: qualidades[0]?.obraId || 'sitta',
      servicoName: servicoName.startsWith('FVS-') ? servicoName : `FVS-0${qualidades.length + 30} - ${servicoName}`,
      setorObra: setorObra,
      responsavelNome: responsavelName,
      dataVerificacao: new Date().toISOString().split('T')[0],
      status: 'CONFORME',
      itensVerificados: checklistReal
    };

    onUpdateQualidades([nova, ...qualidades]);
    setSelectedFvsId(nova.id);
    setServicoName('');
    setSetorObra('');
    setAddedChecklistItems([]);
    setShowAddFvs(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setInnerTab('BIBLIOTECA')}
          className={`px-4 py-2 border-b-2 text-xs font-bold uppercase tracking-wider cursor-pointer transition flex items-center gap-1.5 ${
            innerTab === 'BIBLIOTECA' 
              ? 'border-indigo-500 text-slate-100' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen size={14} /> Biblioteca FVS & PE
        </button>
        <button
          onClick={() => setInnerTab('FVS_ATIVAS')}
          className={`px-4 py-2 border-b-2 text-xs font-bold uppercase tracking-wider cursor-pointer transition flex items-center gap-1.5 ${
            innerTab === 'FVS_ATIVAS' 
              ? 'border-indigo-500 text-slate-100' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ClipboardList size={14} /> FVS Em Andamento
        </button>
        <button
          onClick={() => setInnerTab('CONTROLE_TECNOL')}
          className={`px-4 py-2 border-b-2 text-xs font-bold uppercase tracking-wider cursor-pointer transition flex items-center gap-1.5 ${
            innerTab === 'CONTROLE_TECNOL' 
              ? 'border-indigo-500 text-slate-100' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FlaskConical size={14} /> Controle Tecnológico
        </button>
      </div>

      {innerTab === 'BIBLIOTECA' && (
        <div className="space-y-5">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-2 font-mono">
              <FileCheck size={14} className="text-indigo-400" /> Catálogo de Fichas de Verificação Padrão
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {catalogoFVS.map((fvs) => (
                <div key={fvs.codigo} className="bg-slate-950 border border-slate-850 p-4 rounded-lg flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">{fvs.codigo}</span>
                       <span className="text-[10px] text-slate-500 font-mono">{fvs.revisao}</span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-100 mb-1">{fvs.servico}</h5>
                    <p className="text-[10px] text-slate-500 font-mono mb-3">
                      Disciplina: {fvs.disciplina} | Itens: {fvs.itens.length}
                    </p>
                  </div>
                  <div>
                    {fvs.peVinculado && (
                      <p className="text-[10px] text-emerald-400 font-mono border-t border-slate-800 pt-2 mt-2">
                        Vinc. Procedimento: {fvs.peVinculado}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {innerTab === 'CONTROLE_TECNOL' && (
        <div className="space-y-5">
           <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg">
             <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-850 pb-4 mb-4">
               <div className="space-y-1">
                 <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                   <Beaker size={14} /> Mapeamento & CPs
                 </span>
                 <h3 className="text-sm font-bold font-display text-slate-100">Controle de Corpos de Prova</h3>
               </div>
               <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-blue-500/10 text-blue-400 border-blue-500/20">
                 Amostragem em Lote
               </span>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="bg-slate-950 border border-slate-850 rounded p-4 text-xs font-mono">
                 <p className="text-slate-500 mb-2">ID Controle:</p>
                 <p className="text-slate-200 font-bold mb-3">{controleCPExemplo.id}</p>
                 
                 <p className="text-slate-500 mb-2">Empreendimento:</p>
                 <p className="text-slate-200 mb-3">{controleCPExemplo.empreendimento}</p>

                 <p className="text-slate-500 mb-2">Laboratório:</p>
                 <p className="text-slate-200">{controleCPExemplo.laboratorio}</p>
               </div>
               <div className="bg-slate-950 border border-slate-850 rounded p-4 text-xs font-mono">
                 <p className="text-slate-500 mb-2">Data Moldagem:</p>
                 <p className="text-slate-200 mb-3">{controleCPExemplo.dataMoldagem}</p>
                 
                 <p className="text-slate-500 mb-2">Tipo de Corpo de Prova:</p>
                 <p className="text-slate-200 mb-3">{controleCPExemplo.tipo}</p>

                 <p className="text-slate-500 mb-2">Número CP:</p>
                 <p className="text-slate-200">{controleCPExemplo.numeroCP}</p>
               </div>
             </div>
           </div>
        </div>
      )}

      {innerTab === 'FVS_ATIVAS' && (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left List Pane */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Fichas de Verificação (FVS)</h4>
              {!isReadOnly && (
                <button
                  onClick={() => setShowAddFvs(!showAddFvs)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-slate-100 text-[10px] font-bold px-2.5 py-1 rounded flex items-center gap-1 transition"
                >
                  <Plus size={11} /> Abrir FVS
                </button>
              )}
            </div>

            <div className="space-y-1.5 max-h-120 overflow-y-auto">
              {qualidades.map((q) => {
                const countConformes = q.itensVerificados.filter(i => i.conforme).length;
                const percent = Math.round((countConformes / q.itensVerificados.length) * 100);

                return (
                  <div
                    key={q.id}
                    onClick={() => {
                      setSelectedFvsId(q.id);
                      setShowAddFvs(false);
                    }}
                    className={`p-3.5 rounded border text-left cursor-pointer transition ${
                      activeFvs?.id === q.id 
                        ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' 
                        : 'bg-slate-950 border-slate-900 text-slate-300 hover:bg-slate-900/45'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs font-bold text-slate-100 font-display line-clamp-1">{q.servicoName}</span>
                      <span className="shrink-0">{getStatusBadge(q.status)}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 font-mono">{q.setorObra}</p>
                    
                    {/* Small checklist metrics */}
                    <div className="flex items-center justify-between text-[10px] font-mono mt-3 pt-2.5 border-t border-slate-800/40 text-slate-500">
                      <span>Verificados: {countConformes}/{q.itensVerificados.length}</span>
                      <span>Conformidade: {percent}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Content Sheet */}
        <div className="lg:col-span-7">
          {showAddFvs ? (
            <form onSubmit={handleCreateFvsSubmit} className="bg-slate-900 border border-slate-800 p-5 rounded-lg space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold font-display text-slate-200">Emitir Ficha de Verificação de Serviço (FVS)</h3>
                <button type="button" onClick={() => setShowAddFvs(false)} className="text-xs text-slate-400 hover:text-slate-100">Voltar</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Nome do Serviço / Escopo</label>
                  <input
                    type="text"
                    placeholder="e.g. Concretagem de Vigas Baldrame"
                    value={servicoName}
                    required
                    onChange={(e) => setServicoName(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Localização / Setor da Obra</label>
                  <input
                    type="text"
                    placeholder="e.g. Pavimento Térreo - Eixo A-G"
                    value={setorObra}
                    required
                    onChange={(e) => setSetorObra(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Inspetor / Engenheiro Técnico</label>
                <input
                  type="text"
                  value={responsavelName}
                  required
                  onChange={(e) => setResponsavelName(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none"
                />
              </div>

              {/* Custom checklist assembly */}
              <div className="bg-slate-950 p-4 rounded.5 border border-slate-850 space-y-3">
                <span className="text-[10px] font-bold text-indigo-400 block font-mono uppercase tracking-widest">Montar Checklist de Verificação</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Verificação de armadura de transição conforme Prancha ENG-03"
                    value={checklistInput}
                    onChange={(e) => setChecklistInput(e.target.value)}
                    className="flex-1 text-xs px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddFvsItemInput}
                    className="px-3 py-1 bg-indigo-600 rounded text-xs font-bold text-slate-100 hover:bg-indigo-700"
                  >
                    Adicionar Item
                  </button>
                </div>

                {addedChecklistItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-slate-900 px-3 py-1 text-xs text-slate-300 rounded border border-slate-850">
                    <span>{idx+1}. {item}</span>
                    <button type="button" onClick={() => setAddedChecklistItems(addedChecklistItems.filter((_, i) => i !== idx))} className="text-rose-500"><Trash2 size={12} /></button>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-1.5 text-xs pt-3 border-t border-slate-800/60">
                <button type="button" onClick={() => setShowAddFvs(false)} className="px-3 py-1.5 bg-slate-850 text-slate-400 rounded">Cancelar</button>
                <button type="submit" className="px-3 py-1.5 bg-indigo-600 font-bold text-slate-100 rounded">Criar Checklist FVS</button>
              </div>
            </form>
          ) : activeFvs ? (
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg space-y-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-850 pb-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-widest">SINAL DE QUALIDADE NA OBRA</span>
                  <h3 className="text-base font-bold font-display text-slate-100">{activeFvs.servicoName}</h3>
                  <div className="flex items-center gap-2.5 text-xs text-slate-400 font-mono">
                    <span>Setor: {activeFvs.setorObra}</span>
                    <span>•</span>
                    <span>Data: {activeFvs.dataVerificacao}</span>
                  </div>
                </div>
                <div className="self-start sm:self-auto">{getStatusBadge(activeFvs.status)}</div>
              </div>

              {/* Verification items section */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <ClipboardList size={14} className="text-indigo-400" /> Lista de Verificação de Campo (Checklist)
                </h4>
                <p className="text-[10px] text-slate-500">Desenvolva a conformidade marcando e avaliando cada critério tático:</p>

                <div className="divide-y divide-slate-800/40 p-4.5 bg-slate-950 border border-slate-900 rounded-lg">
                  {activeFvs.itensVerificados.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-start gap-3 first:pt-0 last:pb-0">
                      <input
                        type="checkbox"
                        checked={item.conforme}
                        disabled={isReadOnly}
                        onChange={() => handleToggleItemVal(activeFvs.id, idx)}
                        className="h-4 w-4 bg-slate-900 rounded border-slate-800 text-indigo-500 focus:ring-offset-0 focus:ring-0 cursor-pointer disabled:opacity-40"
                      />
                      <div className="space-y-0.5 flex-1">
                        <p className={`text-xs ${item.conforme ? 'text-slate-400 font-medium' : 'text-rose-400 font-bold'}`}>
                          {item.descricao}
                        </p>
                        {item.observacao && <p className="text-[10px] text-slate-500 font-mono italic">{item.observacao}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Linked RNC section */}
              {activeFvs.rncVinculada && (
                <div className="bg-slate-950 border border-slate-850 p-4.5 rounded-lg space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-850 pb-2.5">
                    <h4 className="text-xs font-bold text-rose-500 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                      <AlertTriangle size={14} /> Registro de Não-Conformidade (RNC Ativo)
                    </h4>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono ${
                      activeFvs.rncVinculada.status === 'RESOLVIDA'
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/10'
                        : 'bg-rose-500/10 text-rose-500 border border-rose-500/10'
                    }`}>
                      {activeFvs.rncVinculada.status}
                    </span>
                  </div>

                  <div className="space-y-3 text-xs leading-relaxed">
                    <div>
                      <span className="text-slate-500 font-mono text-[10px] block uppercase">Código RNC de Origem</span>
                      <span className="font-mono text-slate-300 font-bold">{activeFvs.rncVinculada.id} ({activeFvs.rncVinculada.origem})</span>
                    </div>

                    <div>
                      <span className="text-slate-500 font-mono text-[10px] block uppercase">Tratativa Técnica Definida</span>
                      {editingRncId === activeFvs.id ? (
                        <div className="mt-1 space-y-2">
                          <textarea
                            value={rncTratativaText}
                            placeholder="Digite a tratativa física detalhada de correção..."
                            onChange={(e) => setRncTratativaText(e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 font-mono rounded bg-slate-900 border border-slate-800 text-slate-100 min-h-16"
                          />
                          <div className="flex gap-1 justify-end">
                            <button onClick={() => setEditingRncId(null)} className="px-2 py-1 bg-slate-800 text-slate-400 text-[10px] rounded">Cancelar</button>
                            <button onClick={() => handleUpdateRncTratativa(activeFvs.id)} className="px-2.5 py-1 bg-indigo-600 text-slate-100 font-bold text-[10px] rounded">Salvar Tratativa</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-start gap-4">
                          <p className="text-slate-300 italic font-medium">{activeFvs.rncVinculada.tratativa}</p>
                          {!isReadOnly && activeFvs.rncVinculada.status !== 'RESOLVIDA' && (
                            <button 
                              onClick={() => {
                                setEditingRncId(activeFvs.id);
                                setRncTratativaText(activeFvs.rncVinculada?.tratativa || '');
                              }}
                              className="text-xs text-indigo-400 hover:underline shrink-0"
                            >
                              Editar
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Confirm clearance button */}
                  {!isReadOnly && activeFvs.rncVinculada.status !== 'RESOLVIDA' && (
                    <button
                      onClick={() => handleSetRncResolved(activeFvs.id)}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-slate-100 font-semibold text-xs rounded transition flex items-center justify-center gap-1.5"
                    >
                      <ShieldCheck size={14} /> Homologar Reinspeção - Marcar RNC como Resolvida
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-850 p-12 text-center rounded-lg text-slate-500 italic">
              Nenhuma Ficha de Verificação cadastrada para esta obra.
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
}

