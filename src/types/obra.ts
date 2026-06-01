export type ObraStatus = 'em_execucao' | 'em_finalizacao' | 'pre_obra' | 'paralisada' | 'concluida';
export type ClasseCusto = 'MATERIAL' | 'MAO_DE_OBRA';
export type StatusPagamento = 'PAGO' | 'EM_ABERTO' | 'VENCIDO' | 'AGUARDANDO';
export type StatusFVS = 'conforme' | 'nao_conforme' | 'retrabalho' | 'pendente';
export type MetodologiaRemuneracao = 'preco_fechado' | 'taxa_administrativa' | 'preco_fechado_taxa_adm' | 'preco_unitario';

export interface Contrato {
  codigoObra: string;
  nomeObra: string;
  endereco: string;
  cliente: string;
  arquitetoFocal?: string;
  tipoObra: string;
  areaTotalM2?: number;
  numeroPavimentos?: number;
  valorContrato: number;
  valorOrcamento: number;
  prazoExecucaoMeses: number;
  periodicidadeMedicao: string;
  metodologiaRemuneracao: MetodologiaRemuneracao;
  dataInicio?: string;
  dataConclusaoPrevista?: string;
  observacoes?: string;
}

export interface EtapaOrcamento {
  item: number;
  descricao: string;
  material: number;
  maoObra: number;
  total: number;
  excluso?: boolean;
  percentualDoTotal?: number;
}

export interface ItemOrcamento {
  codigo: string;
  etapaPai: number;
  ambiente: string;
  descricao: string;
  unidade: string;
  quantidade: number;
  precoUnitMaterial: number;
  precoUnitMaoObra: number;
  totalMaterial: number;
  totalMaoObra: number;
  total: number;
}

export interface Orcamento {
  totalMaterial: number;
  totalMaoObra: number;
  totalGeral: number;
  etapas: EtapaOrcamento[];
  itens?: ItemOrcamento[];
}

export interface TarefaCronograma {
  eap: string;
  titulo: string;
  dataInicioPlanejada?: string;
  dataFimPlanejada?: string;
  dataInicioRealizada?: string;
  dataFimRealizada?: string;
  duracaoDias?: number;
  percentualConcluido: number;
  atrasoGanhoDias: number;
  financeiroPlanejado: number;
  financeiroRealizado: number;
}

export interface Cronograma {
  percentualFisicoGlobal: number;
  tarefas: TarefaCronograma[];
  atrasoAcumuladoDias?: number;
  ganhoAcumuladoDias?: number;
}

export interface Desembolso {
  id: number;
  favorecido: string;
  cnpj?: string;
  valor: number;
  descricao: string;
  status: StatusPagamento;
  dataVencimento?: string;
  formaPagamento?: string;
  classeCusto: ClasseCusto;
  etapaNome: string;
  competencia?: string;
  temNotaFiscal: boolean;
}

export interface ResumoFinanceiro {
  totalGeral: number;
  totalPago: number;
  totalEmAberto: number;
  vencidoEmAberto: number;
  desembolsos: Desembolso[];
}

export interface ItemMedicao {
  item: number;
  descricao: string;
  etapa: string;
  quantidade: number;
  unidade: string;
  precoUnitario: number;
  precoTotal: number;
  medido: number;
  saldo: number;
}

export interface ContratoMedicao {
  servico: string;
  fornecedor: string;
  valorTotalContrato: number;
  aditivo?: number;
  valorTotalPago: number;
  valorTotalEmAberto: number;
  itens: ItemMedicao[];
}

export interface FichaVerificacaoServico {
  id: string;
  etapaNome: string;
  ambiente?: string;
  responsavel: string;
  data: string;
  status: StatusFVS;
  checklist: { item: string; conforme: boolean }[];
  observacoes?: string;
}

export interface NaoConformidade {
  id: string;
  fvsId?: string;
  descricao: string;
  abertaEm: string;
  responsavelTratativa: string;
  status: 'aberta' | 'em_tratativa' | 'reinspecao' | 'resolvida';
  resolvidaEm?: string;
}

export interface RelatorioAtividades {
  id: string;
  codigoObra: string;
  cliente: string;
  obra: string;
  endereco: string;
  data: string;
  panorama: { etapa: string; itens: string[] }[];
  equipes: { funcao: string; empresa: string }[];
  observacoes: string[];
  proximasEtapas: string[];
  visaoGeral: { servico: string; percentual: number }[];
  percentualConcluidoGlobal: number;
  fotos: { legenda: string; categoria?: string }[];
}

export interface Obra {
  codigoObra: string;
  nomeObra: string;
  status: ObraStatus;
  cliente: string;
  arquitetoFocal?: string;
  endereco: string;
  percentualFisico: number;
  percentualFinanceiro: number;
  desvioOrcamentario: number;
  valorOriginal: number;
  alertasQualidade: number;
  contrato?: Contrato;
  orcamento?: Orcamento;
  cronograma?: Cronograma;
  financeiro?: ResumoFinanceiro;
  medicoes?: ContratoMedicao[];
  fvs?: FichaVerificacaoServico[];
  rncs?: NaoConformidade[];
  relatorios?: RelatorioAtividades[];
}
