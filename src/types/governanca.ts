export type CondicaoTempo = 'sol' | 'nublado' | 'chuva_fraca' | 'chuva_forte';

export interface ClimaPeriodo {
  periodo: 'manha' | 'tarde' | 'noite';
  condicao: CondicaoTempo;
}

export interface EfetivoFuncao {
  funcao: string;
  empresa?: string;
  quantidade: number;
}

export const FUNCOES_RDO = [
  'Laboratorista','Ajudantes','Pedreiros','Carpinteiros','Eletricistas',
  '1/2 Ofic. Eletricista','Aj. de Limpeza','Administrativo','Lider','Almoxarifes',
  'Aux. Almoxarifado','Pintores','Serralheiros','Encarregados','Tec. de Seguranca',
  'Aux. de Seguranca','Encanadores','Engenheiros','Mecanico de Refrigeracao',
  'Soldadores','Montadores','Armador','Estagiario','Tecnico de materiais',
  'Operadores','Mestre de Obra',
] as const;

export interface RDO {
  id: string;
  codigoObra: string;
  data: string;
  cliente: string;
  local: string;
  gerenciadora: string;
  clima: ClimaPeriodo[];
  observacoesClima?: string;
  efetivo: EfetivoFuncao[];
  totalEfetivo: number;
  atividades: string[];
  observacaoFiscalizacao?: string;
  comentariosAdicionais?: string;
}

export interface ItemCotacao {
  item: string;
  quantidade: number;
  unidade: string;
  descricao: string;
  precoUnitario: number;
  precoTotal: number;
}

export interface PropostaFornecedor {
  fornecedor: string;
  contato?: string;
  telefone?: string;
  celular?: string;
  email?: string;
  observacao?: string;
  itens: ItemCotacao[];
  totalPropostaInicial: number;
  totalPropostaFinal?: number;
  percentualDesconto?: number;
  variacaoVsOrcamento?: number;
  variacaoVsMenorPreco?: number;
  dataProposta?: string;
  numeroProposta?: string;
}

export interface MapaConcorrencia {
  id: string;
  codigoObra: string;
  obra: string;
  endereco: string;
  responsavel: string;
  pacote: string;
  status: 'aberto' | 'em_cotacao' | 'fechado';
  propostas: PropostaFornecedor[];
  fornecedorVencedor?: string;
}

export interface MapeamentoConcreto {
  id: string;
  codigoObra: string;
  empreendimento: string;
  local: string;
  cor?: string;
  numeroBT?: string;
  numeroNotaFiscal?: string;
  data: string;
  engenheiro?: string;
}

export interface ControleCorpoProva {
  id: string;
  codigoObra: string;
  empreendimento: string;
  tipo: 'prisma_oco' | 'cilindrico' | 'argamassa';
  dataMoldagem: string;
  numeroCP: string;
  torre?: string;
  pavimento?: string;
  fpkProjeto?: number;
  fbkBloco?: number;
  loteFabricacaoBloco?: string;
  faProjetoArgamassa?: number;
  laboratorio?: string;
}

export interface SistemaEntrega {
  sistema: string;
  subsistema?: string;
  documentos: { tipo: string; entregue: boolean; }[];
}

export interface ChecklistEntrega {
  id: string;
  codigoObra: string;
  obra: string;
  sistemas: SistemaEntrega[];
  percentualCompleto: number;
}
