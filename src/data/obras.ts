// AUTO-GERADO — Dashboard de Portfólio (4 obras reais seed).
import type { Obra } from '../types/obra';
import { orcamentoSitta } from './orcamentoSitta';
import { financeiroSitta } from './financeiroSitta';
import { cronogramaSitta } from './cronogramaSitta';
import { medicoesSitta } from './medicoesSitta';
import { relatoriosNP } from './relatoriosNP';

export const obras: Obra[] = [
  {
    codigoObra: 'OR.C.144.24', nomeObra: 'Residência Sitta', status: 'em_execucao',
    cliente: 'Francisco Sitta', arquitetoFocal: 'Pedro Cornetta',
    endereco: 'Rua Berilo, AQ03, Cond. Serra dos Cristais — Jordanésia, Cajamar/SP',
    percentualFisico: 0.68, percentualFinanceiro: 0.64, desvioOrcamentario: -0.024,
    valorOriginal: 6172428.7, alertasQualidade: 1,
    contrato: {
      codigoObra: 'OR.C.144.24', nomeObra: 'RESIDÊNCIA SITTA',
      endereco: 'Rua Berilo, AQ03, Cond. Serra dos Cristais — Jordanésia, Cajamar/SP',
      cliente: 'Francisco Sitta', arquitetoFocal: 'Pedro Cornetta', tipoObra: 'RESIDENCIAL',
      areaTotalM2: 640, numeroPavimentos: 2, valorContrato: 1253531, valorOrcamento: 6172428.7,
      prazoExecucaoMeses: 16, periodicidadeMedicao: 'Mensal', metodologiaRemuneracao: 'preco_fechado_taxa_adm',
    },
    orcamento: orcamentoSitta, financeiro: financeiroSitta,
    cronograma: cronogramaSitta, medicoes: medicoesSitta,
  },
  {
    codigoObra: 'OR.R.217.22', nomeObra: 'Residência Paulo Mesquita Prado', status: 'em_execucao',
    cliente: 'Paulo Victor Mesquita Prado', arquitetoFocal: 'Escritório Fremasa (Interno)',
    endereco: 'São Giusto, nº 238 — Jardim Luzitânia, São Paulo/SP',
    percentualFisico: 0.82, percentualFinanceiro: 0.85, desvioOrcamentario: 0.032,
    valorOriginal: 2350000, alertasQualidade: 0, relatorios: relatoriosNP,
  },
  {
    codigoObra: 'OR.C.172.25', nomeObra: 'Residência Ana e André', status: 'pre_obra',
    cliente: 'Ana e André', endereco: 'Residencial Alphaville Zero, Barueri/SP',
    percentualFisico: 0, percentualFinanceiro: 0, desvioOrcamentario: 0, valorOriginal: 0, alertasQualidade: 0,
  },
  {
    codigoObra: 'OR.C.162.25', nomeObra: 'Residência Bella Alves', status: 'paralisada',
    cliente: 'Bella Alves', arquitetoFocal: 'Pedro Trigo', endereco: 'Represa de Piracaia, Piracaia/SP',
    percentualFisico: 0, percentualFinanceiro: 0, desvioOrcamentario: 0, valorOriginal: 0, alertasQualidade: 0,
  },
];
export const portfolioKPIs = {
  valorPortfolio: obras.reduce((s, o) => s + o.valorOriginal, 0),
  obrasCadastradas: obras.length,
  avancoFisicoMedio:
    obras.filter((o) => o.percentualFisico > 0).reduce((s, o) => s + o.percentualFisico, 0) /
    Math.max(1, obras.filter((o) => o.percentualFisico > 0).length),
  alertasQualidade: obras.reduce((s, o) => s + o.alertasQualidade, 0),
};
