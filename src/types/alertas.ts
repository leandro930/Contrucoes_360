// CONSTRUÇÕES 360 — RADAR DE DESVIOS (schema)
export type SeveridadeAlerta = 'critico' | 'atencao' | 'informativo';
export type CategoriaAlerta =
  | 'custo'
  | 'prazo'
  | 'financeiro'
  | 'qualidade'
  | 'medicao';
export interface Alerta {
  id: string;
  codigoObra: string;
  severidade: SeveridadeAlerta;
  categoria: CategoriaAlerta;
  titulo: string;
  detalhe: string;
  valorReferencia?: number;
  origemTipo: 'etapa' | 'desembolso' | 'tarefa' | 'fvs' | 'medicao';
  origemRef: string;
  criadoEm: string;
}
export interface ResumoAlertas {
  codigoObra: string;
  total: number;
  criticos: number;
  atencao: number;
  informativos: number;
  porCategoria: Record<CategoriaAlerta, number>;
  alertas: Alerta[];
}
