import React, { useState, useEffect } from 'react';
import { DiarioObra, UserRole } from '../../types';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  UserCheck, 
  Clipboard, 
  FileText, 
  Camera, 
  Plus, 
  Trash2, 
  CheckCircle,
  Calendar,
  Thermometer,
  CloudLightning,
  Users
} from 'lucide-react';
import { rdoExemplo } from '../../data/governancaExemplos';

interface DiarioProps {
  diarios: DiarioObra[];
  currentRole: UserRole;
  obraCode: string;
  onUpdateDiarios: (updated: DiarioObra[]) => void;
}

export function DiarioView({ diarios, currentRole, obraCode, onUpdateDiarios }: DiarioProps) {
  const isExemploRdo = obraCode === rdoExemplo.codigoObra;
  
  const [selectedDiarioId, setSelectedDiarioId] = useState<string | null>(
    isExemploRdo ? rdoExemplo.id : (diarios[0]?.id || null)
  );
  
  useEffect(() => {
    setSelectedDiarioId(isExemploRdo ? rdoExemplo.id : (diarios[0]?.id || null));
  }, [obraCode, isExemploRdo, diarios]);

  const [showAddDiario, setShowAddDiario] = useState(false);

  // Form states for a new RDO
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newClimaManha, setNewClimaManha] = useState<'SOL' | 'CHUVA' | 'NUBLADO' | 'INSTAVEL'>('SOL');
  const [newClimaTarde, setNewClimaTarde] = useState<'SOL' | 'CHUVA' | 'NUBLADO' | 'INSTAVEL'>('SOL');
  const [newTemp, setNewTemp] = useState('18°C - 24°C');
  const [newEfetivoFremasa, setNewEfetivoFremasa] = useState(3);
  const [newEfetivoSubs, setNewEfetivoSubs] = useState(12);

  const [atividadesText, setAtividadesText] = useState('');
  const [newOcorrenciasText, setNewOcorrenciasText] = useState('');
  const [newFotoUrl, setNewFotoUrl] = useState('');
  const [newFotoLegenda, setNewFotoLegenda] = useState('');

  // Local helper arrays during form creation
  const [addedAtividades, setAddedAtividades] = useState<{descricao: string; setor: string}[]>([]);
  const [addedOcorrencias, setAddedOcorrencias] = useState<string[]>([]);
  const [addedFotos, setAddedFotos] = useState<{url: string; legenda: string}[]>([]);

  const isReadOnly = currentRole === 'controladoria' || currentRole === 'cliente';

  // Find currently active log
  const activeDiario = diarios.find(d => d.id === selectedDiarioId) || diarios[0];

  const getWeatherIcon = (clima: DiarioObra['climaManha']) => {
    switch (clima) {
      case 'SOL':
        return <Sun size={15} className="text-amber-500 fill-amber-500/20" />;
      case 'CHUVA':
        return <CloudRain size={15} className="text-blue-400" />;
      case 'NUBLADO':
        return <Cloud size={15} className="text-slate-400 fill-slate-500/10" />;
      case 'INSTAVEL':
        return <CloudLightning size={15} className="text-indigo-400" />;
    }
  };

  const handleAddAtividade = () => {
    if (!atividadesText) return;
    setAddedAtividades([...addedAtividades, { descricao: atividadesText, setor: 'Setor Geral' }]);
    setAtividadesText('');
  };

  const handleAddOcorrencia = () => {
    if (!newOcorrenciasText) return;
    setAddedOcorrencias([...addedOcorrencias, newOcorrenciasText]);
    setNewOcorrenciasText('');
  };

  const handleAddFoto = () => {
    if (!newFotoUrl) return;
    setAddedFotos([...addedFotos, { url: newFotoUrl, legenda: newFotoLegenda || 'Foto do dia' }]);
    setNewFotoUrl('');
    setNewFotoLegenda('');
  };

  const handleCreateRDO = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Assemble structured entry
    const finalReportCode = `${newDate} — Diário ${obraCode}`;
    
    const novoRDO: DiarioObra = {
      id: `rd-${Date.now()}`,
      obraId: diarios[0]?.obraId || 'sitta',
      date: newDate,
      codigoRelatorio: finalReportCode,
      climaManha: newClimaManha,
      climaTarde: newClimaTarde,
      temperatura: newTemp,
      efetivoFremasa: newEfetivoFremasa,
      efetivoSubempreitados: newEfetivoSubs,
      atividades: addedAtividades.map((a, idx) => ({ id: `at-new-${idx}`, descricao: a.descricao, setor: a.setor })),
      ocorrencias: addedOcorrencias.length > 0 ? addedOcorrencias : ['Atividades transcorridas dentro do planejamento padrão, sem acidentes ou desvios registrados.'],
      fotos: addedFotos.map((f, idx) => ({ id: `ft-new-${idx}`, url: f.url, legenda: f.legenda, data: newDate })),
      aprovadoPor: currentRole === 'admin' || currentRole === 'gestor_obra' ? 'Homologado na entrada' : undefined,
      dataAprovacao: currentRole === 'admin' || currentRole === 'gestor_obra' ? newDate : undefined
    };

    const updated = [novoRDO, ...diarios];
    onUpdateDiarios(updated);
    setSelectedDiarioId(novoRDO.id);

    // Clear form
    setAddedAtividades([]);
    setAddedOcorrencias([]);
    setAddedFotos([]);
    setShowAddDiario(false);
  };

  const handleApproveDiario = (diarioId: string) => {
    const updated = diarios.map(d => {
      if (d.id === diarioId) {
        return {
          ...d,
          aprovadoPor: 'Leandro Frehse (Diretor Eng.)',
          dataAprovacao: new Date().toISOString().split('T')[0]
        };
      }
      return d;
    });
    onUpdateDiarios(updated);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Left Sidebar List of historical journals */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Histórico de RDOs</h4>
            {!isReadOnly && (
              <button
                onClick={() => setShowAddDiario(!showAddDiario)}
                className="bg-indigo-600 hover:bg-indigo-700 text-[10px] font-bold text-slate-100 px-2.5 py-1 rounded tracking-wide transition flex items-center gap-1 cursor-pointer"
              >
                <Plus size={11} /> Novo Diário
              </button>
            )}
          </div>

          <div className="space-y-1.5 max-h-120 overflow-y-auto pr-1">
            {isExemploRdo && (
                <div 
                  onClick={() => {
                    setSelectedDiarioId(rdoExemplo.id);
                    setShowAddDiario(false);
                  }}
                  className={`p-3 rounded border text-left cursor-pointer transition ${
                    selectedDiarioId === rdoExemplo.id 
                      ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' 
                      : 'bg-slate-950 border-slate-900 text-slate-300 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold font-mono text-slate-100">{rdoExemplo.data}</span>
                    <span className="text-[10px] bg-slate-900 border border-slate-800 px-1 py-0.2 rounded font-mono text-slate-400">
                      RDO
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1.5 truncate">Relatório Diário Oficial</p>
                  <div className="flex items-center gap-2 mt-2 text-[10px] font-mono text-slate-500">
                    <span className="flex items-center gap-0.5"><Users size={10} /> {rdoExemplo.totalEfetivo}p</span>
                    <span className="flex items-center gap-1">Manhã: <Sun size={12} className="text-amber-500" /></span>
                  </div>
                </div>
            )}
            
            {diarios.map((d) => {
              const isActive = activeDiario?.id === d.id;
              return (
                <div 
                  key={d.id}
                  onClick={() => {
                    setSelectedDiarioId(d.id);
                    setShowAddDiario(false);
                  }}
                  className={`p-3 rounded border text-left cursor-pointer transition ${
                    isActive 
                      ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' 
                      : 'bg-slate-950 border-slate-900 text-slate-300 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold font-mono text-slate-100">{d.date}</span>
                    <span className="text-[10px] bg-slate-900 border border-slate-800 px-1 py-0.2 rounded font-mono text-slate-400">
                      RDO
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1.5 truncate">{d.codigoRelatorio}</p>
                  <div className="flex items-center gap-2 mt-2 text-[10px] font-mono text-slate-500">
                    <span className="flex items-center gap-0.5"><UserCheck size={10} /> {d.efetivoFremasa + d.efetivoSubempreitados}p</span>
                    <span className="flex items-center gap-1">Manhã: {getWeatherIcon(d.climaManha)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Content Panel - Selected Active RDO or Create Form */}
      <div className="lg:col-span-8">
        {showAddDiario ? (
          <form onSubmit={handleCreateRDO} className="bg-slate-900 border border-slate-800 p-5 rounded-lg space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold font-display text-slate-200">Gerar Novo Diário de Obra (RDO)</h3>
              <button 
                type="button" 
                onClick={() => setShowAddDiario(false)} 
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                Voltar
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Data da Observação</label>
                <input 
                  type="date" 
                  value={newDate} 
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded bg-slate-950 border border-slate-850 text-slate-100" 
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Clima Manhã</label>
                <select 
                  value={newClimaManha} 
                  onChange={(e) => setNewClimaManha(e.target.value as any)}
                  className="w-full text-xs px-2.5 py-1.5 rounded bg-slate-950 border border-slate-850 text-slate-100"
                >
                  <option value="SOL">SOL</option>
                  <option value="NUBLADO">NUBLADO</option>
                  <option value="CHUVA">CHUVA</option>
                  <option value="INSTAVEL">INSTÁVEL</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Clima Tarde</label>
                <select 
                  value={newClimaTarde} 
                  onChange={(e) => setNewClimaTarde(e.target.value as any)}
                  className="w-full text-xs px-2.5 py-1.5 rounded bg-slate-950 border border-slate-850 text-slate-100"
                >
                  <option value="SOL">SOL</option>
                  <option value="NUBLADO">NUBLADO</option>
                  <option value="CHUVA">CHUVA</option>
                  <option value="INSTAVEL">INSTÁVEL</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1 font-mono">Temp (°C)</label>
                <input 
                  type="text" 
                  value={newTemp}
                  onChange={(e) => setNewTemp(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded bg-slate-950 border border-slate-850 text-slate-100 font-mono" 
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Fremasa Direto</label>
                <input 
                  type="number" 
                  value={newEfetivoFremasa} 
                  onChange={(e) => setNewEfetivoFremasa(parseInt(e.target.value) || 0)}
                  className="w-full text-xs px-2.5 py-1.5 rounded bg-slate-950 border border-slate-850 text-slate-100 font-mono" 
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Subempreitados</label>
                <input 
                  type="number" 
                  value={newEfetivoSubs} 
                  onChange={(e) => setNewEfetivoSubs(parseInt(e.target.value) || 0)}
                  className="w-full text-xs px-2.5 py-1.5 rounded bg-slate-950 border border-slate-850 text-slate-100 font-mono" 
                />
              </div>
            </div>

            {/* Activities Inputs */}
            <div className="bg-slate-950 p-3 rounded.5 border border-slate-800 space-y-3 mt-4">
              <label className="text-[10px] font-bold text-indigo-400 block uppercase tracking-wider font-mono">Atividades Executadas (Registrar uma a uma)</label>
              
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="e.g. Assentamento de caixilho de alumínio no hall de entrada"
                  value={atividadesText}
                  onChange={(e) => setAtividadesText(e.target.value)}
                  className="flex-1 text-xs px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-100"
                />
                <button 
                  type="button" 
                  onClick={handleAddAtividade}
                  className="px-3 bg-indigo-600 rounded text-xs font-bold text-slate-100 hover:bg-indigo-700"
                >
                  Incluir
                </button>
              </div>

              {addedAtividades.length > 0 && (
                <div className="space-y-1.5 pt-1.5">
                  {addedAtividades.map((at, index) => (
                    <div key={index} className="flex items-center justify-between text-xs bg-slate-900 border border-slate-850/60 px-2.5 py-1.5 rounded text-slate-300">
                      <span>• {at.descricao}</span>
                      <button 
                        type="button" 
                        onClick={() => setAddedAtividades(addedAtividades.filter((_, i) => i !== index))}
                        className="text-rose-500 hover:text-rose-400 p-0.5"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Occurrences Inputs */}
            <div className="bg-slate-950 p-3 rounded.5 border border-slate-800 space-y-3 mt-2">
              <label className="text-[10px] font-bold text-amber-500 block uppercase tracking-wider font-mono">Ocorrências, Visitas & Incidentes</label>
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="e.g. Visita técnica do projetista de esquadrias metálicas para conferir limites"
                  value={newOcorrenciasText}
                  onChange={(e) => setNewOcorrenciasText(e.target.value)}
                  className="flex-1 text-xs px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-100"
                />
                <button 
                  type="button" 
                  onClick={handleAddOcorrencia}
                  className="px-3 bg-amber-600 rounded text-xs font-bold text-slate-100 hover:bg-amber-700"
                >
                  Incluir
                </button>
              </div>
              {addedOcorrencias.map((oc, index) => (
                <div key={index} className="flex justify-between items-center text-xs bg-slate-900 border border-slate-850/60 px-2.5 py-1.5 rounded text-slate-300">
                  <span>- {oc}</span>
                  <button type="button" onClick={() => setAddedOcorrencias(addedOcorrencias.filter((_, i) => i !== index))} className="text-rose-500"><Trash2 size={12} /></button>
                </div>
              ))}
            </div>

            {/* Photos input */}
            <div className="bg-slate-950 p-3 rounded.5 border border-slate-800 space-y-3 mt-2">
              <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider font-mono">Visualizar Fotos de Evidência</label>
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="text"
                  placeholder="Cole uma URL de Imagem (ex. Unsplash)"
                  value={newFotoUrl}
                  onChange={(e) => setNewFotoUrl(e.target.value)}
                  className="text-xs px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-100"
                />
                <input 
                  type="text"
                  placeholder="Legenda descritiva de apoio"
                  value={newFotoLegenda}
                  onChange={(e) => setNewFotoLegenda(e.target.value)}
                  className="text-xs px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-100"
                />
              </div>
              <button 
                type="button" 
                onClick={handleAddFoto}
                className="w-full py-1.5 bg-slate-800 rounded text-xs font-semibold text-slate-300 hover:bg-slate-700 block"
              >
                Incluir Foto de Evidência
              </button>
              {addedFotos.map((ft, index) => (
                <div key={index} className="flex justify-between items-center text-xs bg-slate-900 border border-slate-850 px-2.5 py-1.5 rounded text-slate-400">
                  <span className="truncate">{ft.url} ({ft.legenda})</span>
                  <button type="button" onClick={() => setAddedFotos(addedFotos.filter((_, i) => i !== index))} className="text-rose-500"><Trash2 size={11} /></button>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 text-xs pt-4 border-t border-slate-800/60">
              <button 
                type="button" 
                onClick={() => setShowAddDiario(false)} 
                className="px-3 py-1.5 rounded bg-slate-800 text-slate-400 hover:bg-slate-700"
              >
                Voltar
              </button>
              <button 
                type="submit" 
                className="px-4 py-1.5 rounded bg-indigo-600 text-slate-100 font-bold hover:bg-indigo-700"
              >
                Gravar e Fechar Diário (RDO)
              </button>
            </div>
          </form>
        ) : isExemploRdo && selectedDiarioId === rdoExemplo.id ? (
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg space-y-6">
            {/* Header displaying selected RDO details */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-400">Fremasa Diário de Obra</span>
                <h3 className="text-base font-bold font-display text-slate-100">DATA: {rdoExemplo.data}</h3>
                <div className="flex items-center gap-2.5 text-xs text-slate-400 font-mono mt-1">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {rdoExemplo.data}</span>
                  <span className="flex items-center gap-1">Cliente: {rdoExemplo.cliente}</span>
                </div>
              </div>

              {/* Weather indicators at day of entry */}
              <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-[11px] font-mono self-start sm:self-auto">
                <span className="text-slate-500 block text-[10px] uppercase font-bold text-center">Clima</span>
                <div className="flex items-center gap-3">
                  {rdoExemplo.clima.map(c => (
                     <div key={c.periodo} className="flex flex-col items-center gap-0.5 text-slate-300">
                        <span className="text-[9px] uppercase text-slate-500">{c.periodo}</span>
                        <div className="flex items-center gap-1">
                          {c.condicao === 'sol' ? <Sun size={12} className="text-amber-500" /> : <Cloud size={12} className="text-slate-400" />} 
                          <span className="capitalize">{c.condicao}</span>
                        </div>
                     </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Manpower indicators */}
            <div className="space-y-3.5">
               <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-slate-800/60 font-mono">
                 <Users size={14} className="text-indigo-400" /> Distribuição de Efetivo
               </h4>
               <div className="bg-slate-950 border border-slate-900 rounded p-4">
                 <table className="w-full text-left text-xs text-slate-300">
                   <thead>
                     <tr className="border-b border-slate-800 text-slate-500 font-mono text-[10px] uppercase">
                        <th className="pb-2 font-medium">Função</th>
                        <th className="pb-2 font-medium">Empresa</th>
                        <th className="pb-2 text-right font-medium">Unidades</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-800/60">
                     {rdoExemplo.efetivo.map((ef, idx) => (
                       <tr key={idx}>
                         <td className="py-2.5 font-semibold text-slate-200">{ef.funcao}</td>
                         <td className="py-2.5 text-slate-400">{ef.empresa}</td>
                         <td className="py-2.5 text-right font-mono font-bold">{ef.quantidade} <span className="text-[10px] font-normal text-slate-500">pax</span></td>
                       </tr>
                     ))}
                   </tbody>
                   <tfoot>
                     <tr className="border-t border-slate-800">
                       <td colSpan={2} className="pt-3 font-bold text-slate-400 text-right uppercase text-[10px] font-mono">Total de Efetivo do Dia:</td>
                       <td className="pt-3 text-right font-bold text-indigo-400 text-base">{rdoExemplo.totalEfetivo}</td>
                     </tr>
                   </tfoot>
                 </table>
               </div>
            </div>

            {/* Activities logs lists */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-slate-800/60 font-mono">
                <Clipboard size={14} className="text-indigo-400" /> Atividades Executadas
              </h4>
              <div className="space-y-2">
                {rdoExemplo.atividades.map((at, idx) => (
                  <div key={idx} className="bg-slate-950/60 border border-slate-850 p-3 rounded flex items-start gap-3">
                    <span className="font-mono text-[9px] bg-indigo-500/15 text-indigo-400 px-1.5 py-0.5 rounded font-bold uppercase shrink-0 mt-0.5">
                      Check
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                      {at}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Occurrences logs */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-slate-800/60 font-mono">
                <FileText size={14} className="text-amber-500" /> Ocorrências & Observações Gerais
              </h4>
              <div className="bg-slate-950 border border-slate-900 p-4 rounded-lg space-y-4 text-xs text-slate-300 leading-relaxed">
                 <div>
                   <span className="text-[10px] font-mono font-bold text-amber-500 block mb-1 uppercase">Observação Fiscalização</span>
                   <p className="pl-3 border-l-2 border-slate-700">{rdoExemplo.observacaoFiscalizacao}</p>
                 </div>
                 <div>
                   <span className="text-[10px] font-mono font-bold text-amber-500 block mb-1 uppercase">Comentários Adicionais</span>
                   <p className="pl-3 border-l-2 border-slate-700">{rdoExemplo.comentariosAdicionais}</p>
                 </div>
              </div>
            </div>
          </div>
        ) : activeDiario ? (
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg space-y-6">
            {/* Header displaying selected RDO details */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-400">Fremasa Diário de Obra</span>
                <h3 className="text-base font-bold font-display text-slate-100">{activeDiario.codigoRelatorio}</h3>
                <div className="flex items-center gap-2.5 text-xs text-slate-400 font-mono mt-1">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {activeDiario.date}</span>
                  <span className="flex items-center gap-1"><Thermometer size={12} /> {activeDiario.temperatura}</span>
                </div>
              </div>

              {/* Weather indicators at day of entry */}
              <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-[11px] font-mono self-start sm:self-auto">
                <span className="text-slate-500 block text-[10px] uppercase font-bold text-center">Clima</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-slate-300">
                    <span>Manhã:</span> {getWeatherIcon(activeDiario.climaManha)}
                  </div>
                  <div className="flex items-center gap-1 text-slate-300">
                    <span>Tarde:</span> {getWeatherIcon(activeDiario.climaTarde)}
                  </div>
                </div>
              </div>
            </div>

            {/* Manpower indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 border border-slate-900 p-3.5 rounded flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Diretos Fremasa</span>
                  <p className="text-sm font-bold text-slate-200">Equipe de Supervisão</p>
                </div>
                <span className="text-lg font-mono font-bold bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded border border-indigo-500/20">
                  {activeDiario.efetivoFremasa} <span className="text-xs">pax</span>
                </span>
              </div>

              <div className="bg-slate-950 border border-slate-900 p-3.5 rounded flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Instaladores Subempreitados</span>
                  <p className="text-sm font-bold text-slate-200">Gesso, Hidráulica, Civil</p>
                </div>
                <span className="text-lg font-mono font-bold bg-sky-500/10 text-sky-400 px-3 py-1 rounded border border-sky-500/20">
                  {activeDiario.efetivoSubempreitados} <span className="text-xs">pax</span>
                </span>
              </div>
            </div>

            {/* Activities logs lists */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-slate-800/60 font-mono">
                <Clipboard size={14} className="text-indigo-400" /> Atividades Executadas
              </h4>

              {activeDiario.atividades.length === 0 ? (
                <p className="text-xs text-slate-500 italic p-3 bg-slate-950 rounded text-center">Nenhuma atividade registrada para a data corrente.</p>
              ) : (
                <div className="space-y-2">
                  {activeDiario.atividades.map((at) => (
                    <div key={at.id} className="bg-slate-950/60 border border-slate-850 p-3 rounded flex items-start gap-3">
                      <span className="font-mono text-[9px] bg-indigo-500/15 text-indigo-400 px-1.5 py-0.5 rounded font-bold uppercase shrink-0 mt-0.5">
                        {at.setor}
                      </span>
                      <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                        {at.descricao}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Occurrences logs */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-slate-800/60 font-mono">
                <FileText size={14} className="text-amber-500" /> Ocorrências & Observações Gerais
              </h4>
              <div className="bg-slate-950 border border-slate-900 p-4 rounded-lg space-y-2.5">
                {activeDiario.ocorrencias.map((oc, index) => (
                  <p key={index} className="text-xs text-slate-300 leading-relaxed pl-3 border-l-2 border-amber-500/80">
                    {oc}
                  </p>
                ))}
              </div>
            </div>

            {/* Album attachments inside RDO */}
            {activeDiario.fotos.length > 0 && (
              <div className="space-y-3.5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-slate-800/60 font-mono">
                  <Camera size={14} className="text-indigo-400" /> Registro Fotográfico Recomendado (Evidências)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeDiario.fotos.map((foto) => (
                    <div key={foto.id} className="group bg-slate-950 border border-slate-900 rounded overflow-hidden">
                      <div className="aspect-video relative overflow-hidden bg-slate-900">
                        <img 
                          src={foto.url} 
                          alt={foto.legenda} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                        />
                      </div>
                      <div className="p-2.5 text-xs text-slate-400 font-mono italic">
                        {foto.legenda}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Approval Banner */}
            <div className="bg-slate-950 border border-slate-850 p-4 rounded-lg flex items-center justify-between flex-wrap gap-4 text-xs font-mono">
              <div className="flex items-center gap-2">
                <CheckCircle size={15} className={activeDiario.aprovadoPor ? 'text-emerald-500' : 'text-slate-600'} />
                <div>
                  <span className="text-slate-500 text-[10px] block">RESPONSÁVEL PELA HOMOLOGAÇÃO</span>
                  <span className="text-slate-300 font-semibold">{activeDiario.aprovadoPor || 'AGUARDANDO CONFERÊNCIA DIRETORIA'}</span>
                </div>
              </div>

              {!activeDiario.aprovadoPor && (currentRole === 'admin' || currentRole === 'gestor_obra') && (
                <button
                  type="button"
                  onClick={() => handleApproveDiario(activeDiario.id)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-slate-100 font-semibold px-3 py-1.5 rounded transition text-[11px]"
                >
                  Homologar Diário
                </button>
              )}

              {activeDiario.aprovadoPor && (
                <div className="text-right text-[10px] text-emerald-500">
                  Aprovado em {activeDiario.dataAprovacao}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-850 p-12 text-center rounded-lg text-slate-500 italic">
            Nenhum Diário de Obra (RDO) disponível. Clique em "Novo Diário" no menu para registrar.
          </div>
        )}
      </div>
    </div>
  );
}
