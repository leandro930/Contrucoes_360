import React, { useState, useEffect } from 'react';
import { UserRole, Obra, Contrato, PranchaProjeto, OrcamentoItem, CronogramaEtapa, DiarioObra, Medicao, TransacaoFinanceira, FichaVerificacaoServico, QuadroConcorrencia } from './types';
import { STATUS_OBRA } from './types/statusObra';
import { Dashboard } from './components/Dashboard';
import { ObraWorkspace } from './components/ObraWorkspace';
import { obras as realObras } from './data/obras';
import { criarObraNova } from './data/criarObraNova';

import { LogoFremasa } from './components/LogoFremasa';

// Seed initializations
import {
  CONTRATOS_SEED,
  PROJETOS_SEED,
  ORCAMENTOS_SEED,
  CRONOGRAMAS_SEED,
  DIARIOS_SEED,
  MEDICOES_SEED,
  TRANSCOES_SEED,
  FVS_SEED,
  QC_SEED,
  GALERIA_SEED,
  INTEGRACAO_CATALOGO_SEED
} from './data/mockData';
import { normalizeObra } from './utils/normalizeObra';

const OBRAS_MAPPED: Obra[] = realObras.map(o => normalizeObra({
  id: o.codigoObra,
  code: o.codigoObra,
  proposalCode: `PROP-${o.codigoObra.split('-')[1] || o.codigoObra.split('.')[2] || ''}`,
  name: o.nomeObra,
  address: o.endereco,
  modality: o.contrato?.metodologiaRemuneracao,
  status: o.status.toUpperCase(),
  client: o.cliente,
  architect: o.arquitetoFocal,
  startDate: o.contrato?.dataInicio,
  endDate: o.contrato?.dataConclusaoPrevista,
  proximaMedicao: o.contrato?.periodicidadeMedicao,
  percentageFisico: Math.round(o.percentualFisico * 100),
  percentageFinanceiro: Math.round(o.percentualFinanceiro * 100),
  value: o.valorOriginal,
  desvioOrcamento: Number((o.desvioOrcamentario * 100).toFixed(1)),
  alertasQualidadeCount: o.alertasQualidade
}));

export default function App() {
  const [selectedObraId, setSelectedObraId] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Application-wide react states for real-time in-memory persistence
  const [obras, setObras] = useState<Obra[]>(OBRAS_MAPPED);
  const [contratos, setContratos] = useState<Contrato[]>(CONTRATOS_SEED);
  const [projetos, setProjetos] = useState<PranchaProjeto[]>(PROJETOS_SEED);
  const [orcamentos, setOrcamentos] = useState<OrcamentoItem[]>(ORCAMENTOS_SEED);
  const [cronogramas, setCronogramas] = useState<CronogramaEtapa[]>(CRONOGRAMAS_SEED);
  const [diarios, setDiarios] = useState<DiarioObra[]>(DIARIOS_SEED);
  const [medicoes, setMedicoes] = useState<Medicao[]>(MEDICOES_SEED);
  const [financeiro, setFinanceiro] = useState<TransacaoFinanceira[]>(TRANSCOES_SEED);
  const [qualidades, setQualidades] = useState<FichaVerificacaoServico[]>(FVS_SEED);
  const [qcs, setQcs] = useState<QuadroConcorrencia[]>(QC_SEED);
  const [fotos, setFotos] = useState<any[]>(GALERIA_SEED);

  // Compute derived properties dynamically based on children collections
  const d_obras = obras.map(obra => {
    // 1. Quality alerts (pending RNCs)
    const pendingQualidades = qualidades.filter(q => q.obraId === obra.id && q.status !== 'APROVADO').length;

    // 2. Physical Progress (average from Cronograma)
    const cw = cronogramas.filter(c => c.obraId === obra.id);
    const avgFis = cw.length ? Math.round(cw.reduce((acc, curr) => acc + curr.progressFisicoReal, 0) / cw.length) : obra.percentageFisico;

    // 3. Financial Progress
    const sumMed = medicoes.filter(m => m.obraId === obra.id && m.status === 'APROVADA').reduce((a, b) => a + (b.valorHomologado || b.valorMedido), 0);
    const avgFin = obra.value > 0 ? Math.round((sumMed / obra.value) * 100) : obra.percentageFinanceiro;

    // 4. Financial Deviation
    const budgetItems = orcamentos.filter(o => o.obraId === obra.id);
    const totalProj = budgetItems.reduce((acc, curr) => acc + curr.valorProjetado, 0);
    const totalReal = budgetItems.reduce((acc, curr) => acc + curr.valorRealizado, 0);
    let dev = obra.desvioOrcamento;
    if (totalProj > 0 && totalReal > 0) {
       dev = Number(((totalReal - totalProj) / totalProj * 100).toFixed(1));
    }

    return {
      ...obra,
      alertasQualidadeCount: pendingQualidades,
      percentageFisico: avgFis,
      percentageFinanceiro: Math.max(avgFin, obra.percentageFinanceiro), // Never go down if mocked higher
      desvioOrcamento: dev !== 0 ? dev : obra.desvioOrcamento
    };
  });

  // Find currently active Obra object if selected
  const activeObra = d_obras.find(o => o.id === selectedObraId);
  
  // Find single linked contract for the active obra
  const activeContrato = contratos.find(c => c.obraId === selectedObraId) || contratos[0];

  // Handler functions to sync edits back to centralized state
  const handleUpdateContrato = (updated: Contrato) => {
    setContratos(contratos.map(c => c.obraId === updated.obraId ? updated : c));
  };

  const handleUpdateProjetos = (updated: PranchaProjeto[]) => {
    // Replace current scope of project sheets for active Obra
    const nonObraPrejs = projetos.filter(p => p.obraId !== selectedObraId);
    setProjetos([...nonObraPrejs, ...updated]);
  };

  const handleUpdateOrcamento = (updated: OrcamentoItem[]) => {
    const nonObraItems = orcamentos.filter(i => i.obraId !== selectedObraId);
    setOrcamentos([...nonObraItems, ...updated]);
  };

  const handleUpdateCronograma = (updated: CronogramaEtapa[]) => {
    const nonObraSteps = cronogramas.filter(c => c.obraId !== selectedObraId);
    setCronogramas([...nonObraSteps, ...updated]);
  };

  const handleUpdateDiarios = (updated: DiarioObra[]) => {
    const nonObraDiarios = diarios.filter(d => d.obraId !== selectedObraId);
    setDiarios([...nonObraDiarios, ...updated]);
  };

  const handleUpdateMedicoes = (updated: Medicao[]) => {
    const nonObraMedicoes = medicoes.filter(m => m.obraId !== selectedObraId);
    setMedicoes([...nonObraMedicoes, ...updated]);
  };

  const handleUpdateFinanceiro = (updated: TransacaoFinanceira[]) => {
    const nonObraFin = financeiro.filter(f => f.obraId !== selectedObraId);
    setFinanceiro([...nonObraFin, ...updated]);
  };

  const handleUpdateQualidades = (updated: FichaVerificacaoServico[]) => {
    const nonObraQual = qualidades.filter(q => q.obraId !== selectedObraId);
    setQualidades([...nonObraQual, ...updated]);
  };

  const handleUpdateQcs = (updated: QuadroConcorrencia[]) => {
    const nonObraQcs = qcs.filter(qc => qc.obraId !== selectedObraId);
    setQcs([...nonObraQcs, ...updated]);
  };

  const handleUpdateFotos = (updated: any[]) => {
    const nonObraFotos = fotos.filter(f => f.obraId !== selectedObraId);
    setFotos([...nonObraFotos, ...updated]);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleAddObra = () => {
    const nextNum = obras.length + 180;
    const constCode = `OR.C.${nextNum}.26`;
    const novaRealObra = criarObraNova({
      codigoObra: constCode,
      nomeObra: 'Nova Residência',
      cliente: 'A definir',
      endereco: 'Em definição',
      status: 'pre_obra'
    });
    
    // Push it to realObras array
    realObras.push(novaRealObra);

    // Add mapped obra to state
    const mapped: Obra = {
      id: novaRealObra.codigoObra,
      code: novaRealObra.codigoObra,
      proposalCode: `PROP-${constCode.split('.')[2] || '00'}`,
      name: novaRealObra.nomeObra,
      address: novaRealObra.endereco,
      modality: 'N/A',
      status: STATUS_OBRA.PRE_OBRA,
      client: novaRealObra.cliente,
      architect: '',
      startDate: 'A definir',
      endDate: 'A definir',
      proximaMedicao: 'A definir',
      percentageFisico: 0,
      percentageFinanceiro: 0,
      value: 0,
      desvioOrcamento: 0,
      alertasQualidadeCount: 0
    };

    setObras(prev => [...prev, mapped]);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 select-none selection:bg-indigo-600/30">
      
      {/* Mini top ribbon for corporate identity */}
      <header className="max-w-7xl mx-auto mb-6 flex justify-between items-center border-b border-slate-900 pb-3.5">
        <div className="flex items-center gap-3">
          <LogoFremasa variant="light" width={170} showEngenharia={false} />
          <div>
            <h1 className="text-sm font-bold font-display uppercase tracking-wider text-slate-200">
              <span className="text-slate-500 font-medium">CONSTRUÇÕES 360</span>
            </h1>
            <span className="text-[10px] text-slate-500 block font-mono">Vault Obsidian Mapeado · S-Curve Core Engine</span>
          </div>
        </div>

        <div className="text-right text-[10px] text-slate-500 font-mono hidden sm:block">
          Estabilidade operacional: <span className="text-emerald-500 uppercase font-bold">100% On-memory persistence</span>
        </div>
      </header>

      <section className="max-w-7xl mx-auto">
        {!selectedObraId ? (
          <Dashboard 
            obras={d_obras}
            currentRole={currentRole}
            isLoading={isLoading}
            onChangeRole={setCurrentRole}
            onSelectObra={setSelectedObraId}
            onAddObra={handleAddObra}
          />
        ) : activeObra ? (
          <ObraWorkspace
            obra={activeObra}
            currentRole={currentRole}
            onChangeRole={setCurrentRole}
            onBackToDashboard={() => setSelectedObraId(null)}
            
            contrato={activeContrato}
            projetos={projetos}
            orcamento={orcamentos}
            cronograma={cronogramas}
            diarios={diarios}
            medicoes={medicoes}
            financeiro={financeiro}
            qualidades={qualidades}
            qcs={qcs}
            fotos={fotos}
            catalogoFornecedores={INTEGRACAO_CATALOGO_SEED.fornecedores}

            onUpdateContrato={handleUpdateContrato}
            onUpdateProjetos={handleUpdateProjetos}
            onUpdateOrcamento={handleUpdateOrcamento}
            onUpdateCronograma={handleUpdateCronograma}
            onUpdateDiarios={handleUpdateDiarios}
            onUpdateMedicoes={handleUpdateMedicoes}
            onUpdateFinanceiro={handleUpdateFinanceiro}
            onUpdateQualidades={handleUpdateQualidades}
            onUpdateQcs={handleUpdateQcs}
            onUpdateFotos={handleUpdateFotos}
          />
        ) : (
          <div className="text-center p-12 bg-slate-900 border border-slate-800 rounded-lg">
            <p className="text-sm text-slate-400">Obra não encontrada ou removida.</p>
          </div>
        )}
      </section>

      {/* Corporate footer */}
      <footer className="max-w-7xl mx-auto mt-16 pt-6 border-t border-slate-900 text-center text-slate-650 text-[10px] font-mono leading-relaxed space-y-1">
        <p>© 2026 Fremasa Construções Residências Alto Padrão S.A.</p>
        <p className="text-[9px] opacity-40">Módulo 4 (Con Execução) · Engenharia e Controladoria integrada</p>
      </footer>
    </main>
  );
}
