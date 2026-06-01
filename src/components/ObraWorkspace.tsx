import React, { useState } from 'react';
import { Obra, UserRole, Contrato, PranchaProjeto, OrcamentoItem, CronogramaEtapa, DiarioObra, Medicao, TransacaoFinanceira, FichaVerificacaoServico, QuadroConcorrencia } from '../types';
import { ContratoView } from './submodules/ContratoView';
import { ProjetosView } from './submodules/ProjetosView';
import { OrcamentoView } from './submodules/OrcamentoView';
import { CronogramaView } from './submodules/CronogramaView';
import { DiarioView } from './submodules/DiarioView';
import { MedicoesView } from './submodules/MedicoesView';
import { FinanceiroView } from './submodules/FinanceiroView';
import { QualidadeView } from './submodules/QualidadeView';
import { QCView } from './submodules/QCView';
import { GaleriaView } from './submodules/GaleriaView';
import { RelatoriosView } from './submodules/RelatoriosView';
import { RadarDesviosView } from './submodules/RadarDesviosView';
import { LogoFremasa } from './LogoFremasa';
import { StatusBadge } from './StatusBadge';
import { obras as realObras } from '../data/obras';
import { resumirAlertas } from '../data/alertas';

import { 
  ArrowLeft, 
  Settings, 
  HelpCircle, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  User,
  ChevronRight,
  FileText,
  Bookmark,
  Activity,
  Layers,
  Sparkles,
  Lock,
  ArrowRight,
  Bell
} from 'lucide-react';

interface ObraWorkspaceProps {
  obra: Obra;
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  onBackToDashboard: () => void;
  
  // States passed from parent App to allow persistence across tabs
  contrato: Contrato;
  projetos: PranchaProjeto[];
  orcamento: OrcamentoItem[];
  cronograma: CronogramaEtapa[];
  diarios: DiarioObra[];
  medicoes: Medicao[];
  financeiro: TransacaoFinanceira[];
  qualidades: FichaVerificacaoServico[];
  qcs: QuadroConcorrencia[];
  fotos: any[];
  catalogoFornecedores: any[];

  onUpdateContrato: (updated: Contrato) => void;
  onUpdateProjetos: (updated: PranchaProjeto[]) => void;
  onUpdateOrcamento: (updated: OrcamentoItem[]) => void;
  onUpdateCronograma: (updated: CronogramaEtapa[]) => void;
  onUpdateDiarios: (updated: DiarioObra[]) => void;
  onUpdateMedicoes: (updated: Medicao[]) => void;
  onUpdateFinanceiro: (updated: TransacaoFinanceira[]) => void;
  onUpdateQualidades: (updated: FichaVerificacaoServico[]) => void;
  onUpdateQcs: (updated: QuadroConcorrencia[]) => void;
  onUpdateFotos: (updated: any[]) => void;
}

export function ObraWorkspace({
  obra,
  currentRole,
  onChangeRole,
  onBackToDashboard,
  contrato,
  projetos,
  orcamento,
  cronograma,
  diarios,
  medicoes,
  financeiro,
  qualidades,
  qcs,
  fotos,
  catalogoFornecedores,
  onUpdateContrato,
  onUpdateProjetos,
  onUpdateOrcamento,
  onUpdateCronograma,
  onUpdateDiarios,
  onUpdateMedicoes,
  onUpdateFinanceiro,
  onUpdateQualidades,
  onUpdateQcs,
  onUpdateFotos
}: ObraWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<number>(1);

  // Filter lists based on the selected Obra ID
  const workContrato = contrato; // assumes already single work from App selection
  const workProjetos = React.useMemo(() => projetos.filter(p => p.obraId === obra.id), [projetos, obra.id]);
  const workOrcamento = React.useMemo(() => orcamento.filter(i => i.obraId === obra.id), [orcamento, obra.id]);
  const workCronograma = React.useMemo(() => cronograma.filter(c => c.obraId === obra.id), [cronograma, obra.id]);
  const workDiarios = React.useMemo(() => diarios.filter(d => d.obraId === obra.id), [diarios, obra.id]);
  const workMedicoes = React.useMemo(() => medicoes.filter(m => m.obraId === obra.id), [medicoes, obra.id]);
  const workFinanceiro = React.useMemo(() => financeiro.filter(f => f.obraId === obra.id), [financeiro, obra.id]);
  const workQualidades = React.useMemo(() => qualidades.filter(q => q.obraId === obra.id), [qualidades, obra.id]);
  const workQcs = React.useMemo(() => qcs.filter(qc => qc.obraId === obra.id), [qcs, obra.id]);
  const workFotos = React.useMemo(() => fotos.filter(f => f.obraId === obra.id), [fotos, obra.id]);
  const activeRealObra = React.useMemo(() => realObras.find(o => o.codigoObra === obra.code), [obra.code]);

  // Define the 11 tabs from the Obsidian workflow
  const menuItems = [
    { id: 1, label: '1. Contrato & Escopo', minRole: 'cliente' },
    { id: 2, label: '2. Projetos', minRole: 'engenharia' },
    { id: 3, label: '3. Orçamento', minRole: 'engenharia' },
    { id: 4, label: '4. Cronograma', minRole: 'engenharia' },
    { id: 5, label: '5. Diário de Obra (RDO)', minRole: 'campo' },
    { id: 6, label: '6. Medições / Boletins', minRole: 'controladoria' },
    { id: 7, label: '7. Financeiro da Obra', minRole: 'controladoria' },
    { id: 8, label: '8. Qualidade / FVS', minRole: 'campo' },
    { id: 9, label: '9. Fornecedores & QC', minRole: 'controladoria' },
    { id: 10, label: '10. Galeria / Evidências', minRole: 'campo' },
    { id: 11, label: '11. Relatórios', minRole: 'controladoria' },
    { id: 12, label: '12. Radar de Desvios', minRole: 'engenharia' }
  ];

  // RBAC Permission Check
  // Leandro / André have 'admin' -> see everything
  // Rafael Icimoto has 'gestor_obra' -> see everything except config
  // Felipe Rosa has 'engenharia' -> see projects, budget, schedule, quality, RDO. Blocked on financials, billing, and contracts.
  // Quaresma has 'controladoria' -> see financials, billing, reports. Blocked on projects, RDOs.
  // Field has 'campo' -> RDO, quality, gallery. Blocked on others.
  const hasPermission = (tabId: number): boolean => {
    if (currentRole === 'admin' || currentRole === 'gestor_obra') return true;

    if (currentRole === 'engenharia') {
      return [1, 2, 3, 4, 8, 10, 12].includes(tabId);
    }
    if (currentRole === 'controladoria') {
      return [3, 4, 6, 7, 9, 11, 12].includes(tabId);
    }
    if (currentRole === 'campo') {
      return [5, 8, 10, 11].includes(tabId);
    }
    if (currentRole === 'cliente') {
      return [1, 4, 10, 11].includes(tabId); // Client Area Phase 2 Filter Preview
    }
    return false;
  };

  // Rendering of the Active Submodule inside the panel
  const renderTabContent = () => {
    if (!hasPermission(activeTab)) {
      return (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-12 text-center max-w-lg mx-auto my-12 space-y-4">
          <div className="h-12 w-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto border border-rose-500/20">
            <Lock size={20} />
          </div>
          <h3 className="text-sm font-bold font-display text-slate-200">Acesso Restrito ao Módulo</h3>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">
            Seu perfil atual de teste (<span className="font-mono bg-indigo-500/15 text-indigo-400 px-1 py-0.5 rounded uppercase font-bold">{currentRole}</span>) não possui permissão de leitura sobre esta pasta do Obsidian.
          </p>
          <div className="pt-4 flex flex-col gap-2">
            <span className="text-[10px] text-slate-500 font-mono">ALTERE O PERFIL NO TOPO DA TELA PARA EXPERIMENTAR OUTROS ACESSOS</span>
            <div className="flex flex-wrap justify-center gap-1.5 mt-2">
              <button onClick={() => onChangeRole('admin')} className="text-[9px] bg-slate-950 hover:bg-indigo-600/15 text-slate-400 px-2.5 py-1 rounded border border-slate-850">Admin</button>
              <button onClick={() => onChangeRole('controladoria')} className="text-[9px] bg-slate-950 hover:bg-indigo-600/15 text-slate-400 px-2.5 py-1 rounded border border-slate-850">Controladoria</button>
              <button onClick={() => onChangeRole('engenharia')} className="text-[9px] bg-slate-950 hover:bg-indigo-600/15 text-slate-350 px-2.5 py-1 rounded border border-slate-850">Engenharia</button>
            </div>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 1:
        return <ContratoView contrato={workContrato} currentRole={currentRole} onUpdateContrato={onUpdateContrato} />;
      case 2:
        return <ProjetosView projetos={workProjetos} currentRole={currentRole} onUpdateProjetos={onUpdateProjetos} />;
      case 3:
        return <OrcamentoView orcamento={workOrcamento} currentRole={currentRole} obraCode={obra.code} onUpdateOrcamento={onUpdateOrcamento} />;
      case 4:
        return <CronogramaView cronograma={workCronograma} currentRole={currentRole} onUpdateCronograma={onUpdateCronograma} realObra={activeRealObra} />;
      case 5:
        return <DiarioView diarios={workDiarios} currentRole={currentRole} obraCode={obra.code} onUpdateDiarios={onUpdateDiarios} />;
      case 6:
        return <MedicoesView medicoes={workMedicoes} currentRole={currentRole} obraCode={obra.code} onUpdateMedicoes={onUpdateMedicoes} realObra={activeRealObra} />;
      case 7:
        return <FinanceiroView financeiro={workFinanceiro} currentRole={currentRole} obraCode={obra.code} onUpdateFinanceiro={onUpdateFinanceiro} />;
      case 8:
        return <QualidadeView qualidades={workQualidades} currentRole={currentRole} onUpdateQualidades={onUpdateQualidades} />;
      case 9:
        return <QCView qcs={workQcs} currentRole={currentRole} onUpdateQcs={onUpdateQcs} catalogoFornecedores={catalogoFornecedores} />;
      case 10:
        return <GaleriaView fotos={workFotos} currentRole={currentRole} onUpdateFotos={onUpdateFotos} />;
      case 11:
        return <RelatoriosView obra={obra} diarios={workDiarios} financeiro={workFinanceiro} realObra={activeRealObra} />;
      case 12:
        return <RadarDesviosView realObra={activeRealObra} />;
      default:
        return <div className="text-slate-400">Em desenvolvimento</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Workspace Top Navigation Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="p-2 hover:bg-slate-800 text-slate-300 hover:text-slate-100 rounded-lg border border-slate-800 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title="Voltar ao Portfólio de Obras"
            aria-label="Voltar ao Portfólio de Obras"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/10">
                {obra.code}
              </span>
              <StatusBadge status={obra.status} />
            </div>
            <h2 className="text-lg font-bold font-display text-slate-100 mt-1 flex items-center gap-3">
              {obra.name}
              {(() => {
                if (!activeRealObra) return null;
                const resumo = resumirAlertas(activeRealObra);
                if (resumo.total === 0) return null;
                return (
                  <button 
                    onClick={() => setActiveTab(12)}
                    className="flex items-center gap-1.5 px-2 py-0.5 bg-rose-500/10 text-rose-500 rounded border border-rose-500/20 hover:bg-rose-500/20 transition-colors text-xs font-bold focus:outline-none focus:ring-2 focus:ring-rose-500"
                    aria-label={`${resumo.total} alertas. Clique para ver o radar de desvios`}
                  >
                    <Bell size={14} className="animate-pulse" />
                    <span>{resumo.total} alertas</span>
                  </button>
                );
              })()}
            </h2>
          </div>
        </div>

        {/* Dynamic RBAC selector switch */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-500 font-mono uppercase font-bold pl-1">Testar Perfil:</span>
          <div className="flex gap-1.5">
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
                aria-pressed={currentRole === role.key}
                className={`px-2.5 py-1 rounded text-[10px] font-semibold cursor-pointer transition whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  currentRole === role.key 
                    ? 'bg-indigo-600 text-slate-100 font-bold shadow' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
                title={`Mudar visualização de interface para ${role.label}`}
              >
                {role.label.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Workspace Frame */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Side Panel Menu: 11 divisions */}
        <div className="lg:col-span-1 space-y-3.5">
          <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-3 shadow-md">
            <div className="pl-2 mb-4">
              <LogoFremasa variant="dark" width={150} />
            </div>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-2 mb-3.5 font-mono">
              Obsidian Vault Divisions
            </h3>

            <div className="space-y-1">
              {menuItems.map((item) => {
                const isActive = activeTab === item.id;
                const permitted = hasPermission(item.id);

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    aria-label={`Acessar aba ${item.label}`}
                    aria-current={isActive ? 'page' : undefined}
                    disabled={!permitted}
                    className={`w-full text-left px-3.5 py-2 rounded text-xs font-semibold flex items-center justify-between transition duration-200 group focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isActive 
                        ? 'bg-indigo-600 font-bold text-white shadow-sm' 
                        : 'bg-transparent border border-transparent hover:bg-[#1E293B] text-slate-300 hover:text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 py-0.5">
                      {item.label}
                    </span>
                    {!permitted ? (
                      <Lock size={12} className="text-slate-600 group-hover:text-rose-400" />
                    ) : (
                      <ChevronRight size={12} className={`opacity-40 group-hover:opacity-100 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick info metrics of the selected work */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs space-y-3 font-mono shadow-card-shadow">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2">Informações da Obra</h4>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Modalidade:</span>
                <span className="text-slate-200 font-bold text-right max-w-[120px] truncate">{obra.modality || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Início Planejado:</span>
                <span className="text-slate-300">{obra.startDate || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Previsão Entrega:</span>
                <span className="text-slate-300">{obra.endDate || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Próm. Medição:</span>
                <span className="text-slate-300 font-bold">{obra.proximaMedicao || '—'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side module pane */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-slate-950 rounded-lg min-h-120">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
