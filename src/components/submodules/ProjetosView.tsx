import React, { useState } from 'react';
import { PranchaProjeto, UserRole } from '../../types';
import { 
  FolderLock, 
  Layers, 
  History, 
  Plus, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';

interface ProjetosViewProps {
  projetos: PranchaProjeto[];
  currentRole: UserRole;
  onUpdateProjetos: (updated: PranchaProjeto[]) => void;
}

export function ProjetosView({ projetos, currentRole, onUpdateProjetos }: ProjetosViewProps) {
  const [selectedDisciplina, setSelectedDisciplina] = useState<string>('All');
  const [showAddPrancha, setShowAddPrancha] = useState(false);
  const [activeHistoryPranchaId, setActiveHistoryPranchaId] = useState<string | null>(null);

  // Form states for new prancha
  const [newCodigo, setNewCodigo] = useState('');
  const [newTitulo, setNewTitulo] = useState('');
  const [newDisciplina, setNewDisciplina] = useState<PranchaProjeto['disciplina']>('Arquitetura');
  const [newResponsavel, setNewResponsavel] = useState('');

  // Form states for adding revision to active prancha
  const [showAddRevisionId, setShowAddRevisionId] = useState<string | null>(null);
  const [newRevCode, setNewRevCode] = useState('');
  const [newRevDesc, setNewRevDesc] = useState('');

  const isReadOnly = currentRole === 'campo' || currentRole === 'controladoria';

  const disciplinas: string[] = ['All', 'Arquitetura', 'Fundações', 'Estrutura Metálica', 'Instalações', 'Interiores'];

  const filteredProjetos = selectedDisciplina === 'All'
    ? projetos
    : projetos.filter(p => p.disciplina === selectedDisciplina);

  const getStatusStyle = (status: PranchaProjeto['statusAnalise']) => {
    switch (status) {
      case 'APROVADO':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'APROVADO_COM_RESSALVAS':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'EM_REVISAO':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'PENDENTE_ANALISE':
        return 'bg-slate-800 text-slate-400 border-slate-700/60';
    }
  };

  const handleAddPrancha = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCodigo || !newTitulo || !newResponsavel) return;

    const nova: PranchaProjeto = {
      id: `p-${Date.now()}`,
      obraId: projetos[0]?.obraId || 'sitta',
      disciplina: newDisciplina,
      codigo: newCodigo,
      titulo: newTitulo,
      revisaoAtual: 'R00',
      dataRevisao: new Date().toISOString().split('T')[0],
      responsavel: newResponsavel,
      statusAnalise: 'PENDENTE_ANALISE',
      historicoRevisoes: [
        {
          revisao: 'R00',
          data: new Date().toISOString().split('T')[0],
          descricao: 'Emissão Inicial para Coordenação'
        }
      ]
    };

    onUpdateProjetos([nova, ...projetos]);
    setNewCodigo('');
    setNewTitulo('');
    setNewResponsavel('');
    setShowAddPrancha(false);
  };

  const handleCreateRevision = (pranchaId: string) => {
    if (!newRevCode || !newRevDesc) return;

    const updated = projetos.map(p => {
      if (p.id === pranchaId) {
        const novaRev = {
          revisao: newRevCode.toUpperCase(),
          data: new Date().toISOString().split('T')[0],
          descricao: newRevDesc
        };
        return {
          ...p,
          revisaoAtual: novaRev.revisao,
          dataRevisao: novaRev.data,
          statusAnalise: 'PENDENTE_ANALISE' as const, // goes back to pending coordinate approval
          historicoRevisoes: [novaRev, ...p.historicoRevisoes]
        };
      }
      return p;
    });

    onUpdateProjetos(updated);
    setNewRevCode('');
    setNewRevDesc('');
    setShowAddRevisionId(null);
  };

  const updatePranchaStatus = (pranchaId: string, status: PranchaProjeto['statusAnalise']) => {
    if (isReadOnly) return;
    const updated = projetos.map(p => {
      if (p.id === pranchaId) {
        return { ...p, statusAnalise: status };
      }
      return p;
    });
    onUpdateProjetos(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {/* Disciplines Toolbar */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
          {disciplinas.map(disc => (
            <button
              key={disc}
              onClick={() => setSelectedDisciplina(disc)}
              className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition ${
                selectedDisciplina === disc 
                  ? 'bg-indigo-600 text-slate-100' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {disc === 'All' ? 'Todas' : disc}
            </button>
          ))}
        </div>

        {!isReadOnly && (
          <button
            onClick={() => setShowAddPrancha(!showAddPrancha)}
            className="sm:self-auto self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-slate-100 transition whitespace-nowrap"
          >
            <Plus size={14} /> Registrar Nova Prancha
          </button>
        )}
      </div>

      {showAddPrancha && (
        <form onSubmit={handleAddPrancha} className="bg-slate-900 border border-slate-800 p-4 rounded-lg space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Registrar Nova Prancha de Projeto</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Disciplina</label>
              <select
                value={newDisciplina}
                onChange={(e) => setNewDisciplina(e.target.value as any)}
                className="w-full text-xs px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none"
              >
                <option value="Arquitetura">Arquitetura</option>
                <option value="Fundações">Fundações</option>
                <option value="Estrutura Metálica">Estrutura Metálica</option>
                <option value="Instalações">Instalações</option>
                <option value="Interiores">Interiores</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Código da Folha</label>
              <input
                type="text"
                placeholder="e.g. ARQ-DET-003"
                value={newCodigo}
                required
                onChange={(e) => setNewCodigo(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] text-slate-400 block mb-1">Título do Projeto</label>
              <input
                type="text"
                placeholder="e.g. Detalhe da Cobertura de Vidro Hall Master"
                value={newTitulo}
                required
                onChange={(e) => setNewTitulo(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] text-slate-400 block mb-1">Projetista / Responsável</label>
              <input
                type="text"
                placeholder="e.g. Arquitetura Cornetta (Pedro Cornetta)"
                value={newResponsavel}
                required
                onChange={(e) => setNewResponsavel(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 text-xs">
            <button 
              type="button" 
              onClick={() => setShowAddPrancha(false)}
              className="px-3 py-1.5 rounded bg-slate-800 text-slate-400 hover:bg-slate-700 font-medium"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-3 py-1.5 rounded bg-indigo-600 text-slate-100 hover:bg-indigo-700 font-bold"
            >
              Registrar Prancha
            </button>
          </div>
        </form>
      )}

      {/* Grid of sheets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjetos.map(prancha => {
          const isHistoryActive = activeHistoryPranchaId === prancha.id;
          const isAddRevActive = showAddRevisionId === prancha.id;

          return (
            <div key={prancha.id} className="bg-slate-900 border border-slate-800 p-4.5 rounded-lg flex flex-col justify-between space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                    <Layers size={11} className="text-indigo-400" /> {prancha.disciplina}
                  </div>
                  <h4 className="text-sm font-bold font-display text-slate-100 mt-1.5">
                    <span className="text-indigo-400 mr-2 font-mono">{prancha.codigo}</span>
                    {prancha.titulo}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium">{prancha.responsavel}</p>
                </div>

                <div className={`px-2.5 py-1 rounded inline-flex border text-[10px] font-bold ${getStatusStyle(prancha.statusAnalise)}`}>
                  {prancha.statusAnalise.replace(/_/g, ' ')}
                </div>
              </div>

              {/* Revision Banner */}
              <div className="bg-slate-950 border border-slate-800/60 p-2.5 rounded flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-slate-500 mr-1.5 block text-[10px]">REVISÃO ATUAL</span>
                  <span className="font-bold text-slate-300 bg-slate-900 border border-slate-850 px-1.5 py-0.5 rounded text-[11px]">{prancha.revisaoAtual}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 mr-1.5 block text-[10px]">DATA DE LIBERAÇÃO</span>
                  <span className="text-slate-300 text-[11px]">{prancha.dataRevisao}</span>
                </div>
              </div>

              {/* Actions row */}
              <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-800/40 text-[11px]">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveHistoryPranchaId(isHistoryActive ? null : prancha.id)}
                    className="inline-flex items-center gap-1 text-inherit text-slate-400 hover:text-slate-200 transition font-medium"
                  >
                    <History size={13} /> {isHistoryActive ? 'Ocultar Histórico' : 'Ver Revisões'}
                  </button>
                  {!isReadOnly && (
                    <button
                      onClick={() => setShowAddRevisionId(isAddRevActive ? null : prancha.id)}
                      className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition font-medium"
                    >
                      <Plus size={13} /> Nova Revisão
                    </button>
                  )}
                </div>

                {/* Control approval buttons for admins or coordination roles */}
                {!isReadOnly && (
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500 mr-1 text-[10px]">Aprovar:</span>
                    <button
                      onClick={() => updatePranchaStatus(prancha.id, 'APROVADO')}
                      title="Aprovar sem ressalvas"
                      className="p-1 rounded bg-slate-950 hover:bg-emerald-500/10 hover:text-emerald-400 border border-slate-800 text-slate-500"
                    >
                      👍
                    </button>
                    <button
                      onClick={() => updatePranchaStatus(prancha.id, 'APROVADO_COM_RESSALVAS')}
                      title="Aprovar com observações"
                      className="p-1 rounded bg-slate-950 hover:bg-amber-500/10 hover:text-amber-400 border border-slate-800 text-slate-500"
                    >
                      ⚠️
                    </button>
                    <button
                      onClick={() => updatePranchaStatus(prancha.id, 'EM_REVISAO')}
                      title="Solicitar Revisão"
                      className="p-1 rounded bg-slate-950 hover:bg-blue-500/10 hover:text-blue-400 border border-slate-800 text-slate-500"
                    >
                      🔄
                    </button>
                  </div>
                )}
              </div>

              {/* Add Revision Form */}
              {isAddRevActive && (
                <div className="bg-slate-950 border border-slate-800 p-3 rounded mt-2 space-y-3">
                  <h5 className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider font-mono">Lançar Nova Revisão</h5>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[9px] text-slate-500 block mb-0.5">Rev (e.g. R04)</label>
                      <input
                        type="text"
                        placeholder="R04"
                        value={newRevCode}
                        onChange={(e) => setNewRevCode(e.target.value)}
                        className="w-full text-xs px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-100"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[9px] text-slate-500 block mb-0.5">Nota de Alteração</label>
                      <input
                        type="text"
                        placeholder="e.g. Adequação da cota de lareira"
                        value={newRevDesc}
                        onChange={(e) => setNewRevDesc(e.target.value)}
                        className="w-full text-xs px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-100"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-1.5 text-[10px]">
                    <button onClick={() => setShowAddRevisionId(null)} className="px-2 py-1 rounded bg-slate-800 text-slate-400">Cancelar</button>
                    <button onClick={() => handleCreateRevision(prancha.id)} className="px-2.5 py-1 rounded bg-indigo-600 text-slate-100 font-bold">Lançar</button>
                  </div>
                </div>
              )}

              {/* Revision History list */}
              {isHistoryActive && (
                <div className="bg-slate-950 border border-slate-800 p-3 rounded mt-2 text-xs space-y-2">
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono border-b border-slate-800 pb-1.5">Historico de Transmissões / Revisões</h5>
                  <div className="divide-y divide-slate-800/40">
                    {prancha.historicoRevisoes.map((hist, hIdx) => (
                      <div key={hIdx} className="py-2 flex items-start gap-2">
                        <span className="font-mono bg-indigo-500/10 text-indigo-400 @font-bold px-1 rounded text-[10px] shrink-0 mt-0.5">{hist.revisao}</span>
                        <div className="space-y-0.5">
                          <p className="text-slate-300 font-medium leading-normal">{hist.descricao}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{hist.data}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
