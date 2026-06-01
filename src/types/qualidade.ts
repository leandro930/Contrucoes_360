export type DisciplinaQualidade =
  | 'FUN' | 'EST' | 'ALV' | 'REV' | 'IMP' | 'PIS' | 'PGA' | 'ESQ' | 'INS' | 'PIN' | 'CONT';

export const DISCIPLINA_LABEL: Record<DisciplinaQualidade, string> = {
  FUN: 'Fundacoes', EST: 'Estrutura', ALV: 'Alvenaria', REV: 'Revestimento',
  IMP: 'Impermeabilizacao', PIS: 'Contrapiso / Piso', PGA: 'Gesso Acartonado',
  ESQ: 'Esquadrias', INS: 'Instalacoes', PIN: 'Pintura', CONT: 'Controle Tecnologico',
};

export interface ItemInspecaoModelo {
  n: number;
  descricao: string;
  metodo?: string;
  amostragem?: string;
  equipamento?: string;
  tolerancia?: string;
  fase?: string;
}

export interface FVSModelo {
  codigo: string;
  disciplina: DisciplinaQualidade;
  servico: string;
  revisao: string;
  itens: ItemInspecaoModelo[];
  peVinculado?: string;
  observacao?: string;
}

export interface ProcedimentoExecutivo {
  codigo: string;
  disciplina: DisciplinaQualidade;
  titulo: string;
  revisao: string;
  status: 'pronto' | 'em_desenvolvimento';
  formato: 'pptx' | 'pdf';
  fvsVinculada?: string;
}
