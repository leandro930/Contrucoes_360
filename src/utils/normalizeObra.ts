import { Obra } from '../types';
import { STATUS_OBRA } from '../types/statusObra';

/**
 * Centraliza e padroniza o parseamento e a limpeza segura de um objeto
 * de dados de Obra (idealmente retornado de uma API). Lida adequadamente 
 * com tipagem restrita do objeto final, assegurando numéricos consistentes (sem NaN),
 * strings sanitizadas ou null fallbacks, evitando comportamentos falhos no front-end.
 *
 * @param raw - Objeto dinâmico/livre com prováveis dados não tratados da obra.
 * @returns Um objeto tipado estrito do tipo `Obra` pronto para consumo no app.
 */
export function normalizeObra(raw: any): Obra {
  const getNum = (val: any, fallback = 0): number => {
    const parsed = Number(val);
    return Number.isNaN(parsed) ? fallback : parsed;
  };

  const getStrOrNull = (val: any): string | null => {
    if (val === undefined || val === null || val === '') return null;
    return String(val);
  };

  const getStr = (val: any, fallback = ''): string => {
    const str = getStrOrNull(val);
    return str !== null ? str : fallback;
  };

  const getStatus = (val: any): any => {
    if (!val) return STATUS_OBRA.PRE_OBRA;
    const upper = String(val).toUpperCase();
    if (Object.values(STATUS_OBRA).includes(upper as any)) {
      return upper;
    }
    return STATUS_OBRA.PRE_OBRA;
  };

  return {
    id: getStr(raw?.id),
    code: getStr(raw?.code),
    name: getStr(raw?.name),
    status: getStatus(raw?.status),
    client: getStrOrNull(raw?.client),
    architect: getStrOrNull(raw?.architect),
    address: getStrOrNull(raw?.address),
    value: getNum(raw?.value),
    modality: getStrOrNull(raw?.modality),
    proposalCode: getStrOrNull(raw?.proposalCode),
    startDate: getStrOrNull(raw?.startDate),
    endDate: getStrOrNull(raw?.endDate),
    percentageFisico: getNum(raw?.percentageFisico),
    percentageFinanceiro: getNum(raw?.percentageFinanceiro),
    desvioOrcamento: getNum(raw?.desvioOrcamento),
    proximaMedicao: getStrOrNull(raw?.proximaMedicao),
    alertasQualidadeCount: getNum(raw?.alertasQualidadeCount),
  };
}
