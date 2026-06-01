// FACTORY DE OBRA NOVA — Construções 360. Esqueleto que toda obra nova herda.
import type {
  Obra, Contrato, Orcamento, Cronograma, ResumoFinanceiro,
  EtapaOrcamento, TarefaCronograma, FichaVerificacaoServico, ObraStatus,
} from '../types/obra';
import { ETAPAS_PADRAO } from './etapasPadrao';
import { catalogoFVS } from './bibliotecaQualidade';
export interface NovaObraInput {
  codigoObra: string;
  nomeObra: string;
  cliente: string;
  arquitetoFocal?: string;
  endereco: string;
  tipoObra?: string;
  areaTotalM2?: number;
  numeroPavimentos?: number;
  valorContrato?: number;
  prazoExecucaoMeses?: number;
  status?: ObraStatus;
  dataInicio?: string;
}
function orcamentoEmBranco(): Orcamento {
  const etapas: EtapaOrcamento[] = ETAPAS_PADRAO.map((e) => ({
    item: e.item, descricao: e.descricao, material: 0, maoObra: 0, total: 0,
    excluso: e.excluso ?? false, percentualDoTotal: 0,
  }));
  return { totalMaterial: 0, totalMaoObra: 0, totalGeral: 0, etapas };
}
function cronogramaEmBranco(): Cronograma {
  const tarefas: TarefaCronograma[] = ETAPAS_PADRAO
    .filter((e) => !e.excluso)
    .map((e) => ({
      eap: String(e.item), titulo: e.descricao, percentualConcluido: 0,
      atrasoGanhoDias: 0, financeiroPlanejado: 0, financeiroRealizado: 0,
    }));
  return { percentualFisicoGlobal: 0, tarefas };
}
function financeiroEmBranco(): ResumoFinanceiro {
  return { totalGeral: 0, totalPago: 0, totalEmAberto: 0, vencidoEmAberto: 0, desembolsos: [] };
}
function fvsIniciais(): FichaVerificacaoServico[] {
  return catalogoFVS.map((modelo, idx) => ({
    id: `FVS-${String(idx + 1).padStart(3, '0')}`,
    etapaNome: modelo.servico, responsavel: '', data: '', status: 'pendente',
    checklist: modelo.itens.map((it) => ({ item: it.descricao, conforme: false })),
  }));
}
export function criarObraNova(input: NovaObraInput): Obra {
  const contrato: Contrato = {
    codigoObra: input.codigoObra, nomeObra: input.nomeObra, endereco: input.endereco,
    cliente: input.cliente, arquitetoFocal: input.arquitetoFocal,
    tipoObra: input.tipoObra ?? 'RESIDENCIAL', areaTotalM2: input.areaTotalM2,
    numeroPavimentos: input.numeroPavimentos, valorContrato: input.valorContrato ?? 0,
    valorOrcamento: 0, prazoExecucaoMeses: input.prazoExecucaoMeses ?? 0,
    periodicidadeMedicao: 'Mensal', metodologiaRemuneracao: 'preco_fechado_taxa_adm',
    dataInicio: input.dataInicio,
  };
  return {
    codigoObra: input.codigoObra, nomeObra: input.nomeObra, status: input.status ?? 'pre_obra',
    cliente: input.cliente, arquitetoFocal: input.arquitetoFocal, endereco: input.endereco,
    percentualFisico: 0, percentualFinanceiro: 0, desvioOrcamentario: 0,
    valorOriginal: input.valorContrato ?? 0, alertasQualidade: 0,
    contrato, orcamento: orcamentoEmBranco(), cronograma: cronogramaEmBranco(),
    financeiro: financeiroEmBranco(), medicoes: [], fvs: fvsIniciais(), rncs: [], relatorios: [],
  };
}
export const exemploObraNova = criarObraNova({
  codigoObra: 'OR.C.180.26', nomeObra: 'Residência Exemplo', cliente: 'A definir',
  endereco: 'A definir', status: 'pre_obra',
});
