import { StatusObra } from './types/statusObra';

export type UserRole = 'admin' | 'gestor_obra' | 'engenharia' | 'controladoria' | 'campo' | 'cliente';

export interface User {
  name: string;
  role: UserRole;
  email: string;
}

export interface Obra {
  id: string;
  code: string;
  name: string;
  status: StatusObra;
  client: string | null;
  architect: string | null;
  address: string | null;
  value: number;
  modality: string | null;
  proposalCode: string | null; // e.g. "OB.2024.12"
  startDate: string | null;
  endDate: string | null;
  percentageFisico: number;
  percentageFinanceiro: number;
  desvioOrcamento: number; // percentage, positive is over budget, negative under budget
  proximaMedicao: string | null;
  alertasQualidadeCount: number;
}

export interface Contrato {
  id: string;
  obraId: string;
  clienteNome: string;
  documentoRef: string; // e.g. "CONTRATO_OB.144_2024"
  dataAssinatura: string;
  valorOriginal: number;
  valorAditivos: number;
  modality: string;
  focosContratuais: string[];
  escopoResumido: string[];
  aditivos: {
    id: string;
    numero: string;
    data: string;
    descricao: string;
    valor: number;
  }[];
  marcos: {
    id: string;
    titulo: string;
    dataPrevista: string;
    status: 'PENDENTE' | 'CONCLUIDO' | 'ATRASADO';
  }[];
}

export interface PranchaProjeto {
  id: string;
  obraId: string;
  disciplina: 'Arquitetura' | 'Estrutura Metálica' | 'Instalações' | 'Fundações' | 'Interiores' | 'Terraplenagem';
  codigo: string; // e.g. "ARQ-DET-01"
  titulo: string;
  revisaoAtual: string; // e.g. "R02"
  dataRevisao: string;
  responsavel: string; // e.g. "Pedro Cornetta (Arquiteto)"
  statusAnalise: 'APROVADO' | 'APROVADO_COM_RESSALVAS' | 'EM_REVISAO' | 'PENDENTE_ANALISE';
  linkUrl?: string;
  historicoRevisoes: {
    revisao: string;
    data: string;
    descricao: string;
  }[];
}

export interface OrcamentoItem {
  id: string;
  obraId: string;
  item: string; // e.g. "1.1"
  descricao: string;
  unidade: string;
  quantidade: number;
  precoUnitario: number;
  totalBaseline: number;
  totalCorrente: number;
  executadoAcumulado: number;
  categoria: 'INFRAESTRUTURA' | 'ESTRUTURA_METALICA' | 'ALVENARIA_DEMAIS' | 'REVESTIMENTOS' | 'INSTALACOES' | 'ACABAMENTOS' | 'PINTURA' | 'GERAL';
}

export interface CronogramaEtapa {
  id: string;
  obraId: string;
  etapaName: string;
  startDate: string;
  endDate: string;
  progressFisicoPlanejado: number;
  progressFisicoReal: number;
  desembolsoPrevisto: number;
  desembolsoReal: number;
  status: 'NAO_INICIADO' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'ATRASADO';
}

export interface DiarioObra {
  id: string;
  obraId: string;
  date: string; // e.g. "2026-05-29"
  codigoRelatorio: string; // e.g. "2026-05-29 — Diário OR.C.144.24"
  climaManha: 'SOL' | 'CHUVA' | 'NUBLADO' | 'INSTAVEL';
  climaTarde: 'SOL' | 'CHUVA' | 'NUBLADO' | 'INSTAVEL';
  temperatura: string; // e.g. "18°C - 24°C"
  efetivoFremasa: number;
  efetivoSubempreitados: number;
  atividades: { id: string; descricao: string; setor: string }[];
  ocorrencias: string[];
  fotos: { id: string; url: string; legenda: string; data: string }[];
  aprovadoPor?: string;
  dataAprovacao?: string;
}

export interface Medicao {
  id: string;
  obraId: string;
  numero: number;
  periodoInicio: string;
  periodoFim: string;
  dataEmissao: string;
  codigoMedicao: string; // "Medição 02 — 2026-05-15 — OR.C.144.24"
  fornecedorNome: string;
  servicoMedido: string;
  valorMedido: number;
  valorAprovado: number;
  status: 'EM_ANALISE' | 'APROVADO' | 'APROVADO_PARCIAL' | 'FALHADO' | 'PAGO';
  retencaoGarantia: number;
}

export interface TransacaoFinanceira {
  id: string;
  obraId: string;
  descricao: string;
  tipo: 'DESPESA' | 'RECEITA';
  categoriaContas: 'CON_DIRETO' | 'CLIENTE_APORTE' | 'MAQUINARIO' | 'IMPOSTOS' | 'PEQUENAS_DESPESAS';
  valor: number;
  dataVencimento: string;
  dataPagamento?: string;
  status: 'A_PAGAR' | 'PAGO' | 'RECEBIDO' | 'A_RECEBER';
  fornecedorNome?: string;
}

export interface FichaVerificacaoServico {
  id: string;
  obraId: string;
  servicoName: string; // e.g. "Concretagem da Laje Principal"
  setorObra: string; // e.g. "Pavimento Superior"
  responsavelNome: string; // Inspetor
  dataVerificacao: string;
  status: 'CONFORME' | 'NAO_CONFORME' | 'RETRABALHO';
  itensVerificados: {
    descricao: string;
    conforme: boolean;
    observacao?: string;
  }[];
  rncVinculada?: {
    id: string;
    origem: string;
    tratativa: string;
    status: 'ABERTA' | 'EM_TRATATIVA' | 'RESOLVIDA';
  };
}

export interface QuadroConcorrencia {
  id: string; // e.g. "202605-QC-002"
  obraId: string;
  pacoteNome: string; // e.g. "Estrutura Metálica"
  status: 'ABERTO' | 'EM_COTACAO' | 'FECHADO';
  dataCriacao: string;
  dataFechamento?: string;
  revisao: number;
  itensRequisitados: {
    id: string;
    descricao: string;
    quantidade: number;
    unidade: string;
  }[];
  concorrentes: {
    fornecedorId: string;
    fornecedorNome: string;
    cotacaoTotal: number;
    itensCotados: { itemId: string; precoUnitario: number; prazoEntregaDias: number; nota?: string }[];
    condicaoPagamento: string;
    vencedor: boolean;
    observacoes: string;
  }[];
}
