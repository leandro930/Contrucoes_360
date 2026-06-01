import { useMemo } from 'react';
import { Obra } from '../types';
import { obras as realObras } from '../data/obras';
import { resumirAlertas } from '../data/alertas';
import type { ResumoAlertas } from '../types/alertas';

/**
 * Hook customizado para calcular as métricas consolidadas (KPIs globais) de um dado
 * conjunto de obras para exibição no painel gerencial.
 * Calcula valor total do portfólio, médias de avanço físico, desvio orçamentário médio,
 * contagem total de não-conformidades (alertas) e gera um mapa sumarizado do "radar" por obra.
 * Memoizado para evitar cálculos repetitivos desnecessários.
 *
 * @param obras - Array de obras a serem analisadas (normalmente apenas obras ativas/em execução).
 * @returns Objeto contendo valores agregados do portfólio e o mapa de alertas por código da obra.
 */
export function usePortfolioMetrics(obras: Obra[]) {
  return useMemo(() => {
    let totalValor = 0;
    let somaFisico = 0;
    let somaDesvio = 0;
    let countComAvanco = 0;
    let alertasQualidade = 0;
    const mapaAlertas = new Map<string, ResumoAlertas>();

    realObras.forEach(real => {
      mapaAlertas.set(real.codigoObra, resumirAlertas(real));
    });

    for (let i = 0; i < obras.length; i++) {
      const o = obras[i];
      totalValor += o.value || 0;
      alertasQualidade += o.alertasQualidadeCount || 0;
      
      if (o.percentageFisico > 0) {
        somaFisico += o.percentageFisico;
        somaDesvio += o.desvioOrcamento || 0;
        countComAvanco++;
      }
    }

    const avancoFisicoMedio = countComAvanco > 0 ? Math.round(somaFisico / countComAvanco) : 0;
    const desvioOrcamentarioMedio = countComAvanco > 0 ? Number((somaDesvio / countComAvanco).toFixed(1)) : 0;

    return {
      mapaAlertas,
      totalValor,
      avancoFisicoMedio,
      desvioOrcamentarioMedio,
      alertasQualidade
    };
  }, [obras]);
}
