// CONSTRUÇÕES 360 — MOTOR DE REGRAS DO RADAR DE DESVIOS
import type { Obra } from '../types/obra';
import type { Alerta, ResumoAlertas, CategoriaAlerta } from '../types/alertas';
const LIMIAR = {
  estouroCritico: 0.0,
  derrapagemAtencao: 0.15,
  atrasoCritico: 60,
  atrasoAtencao: 15,
  vencimentoDias: 7,
};
const hoje = () => new Date().toISOString().slice(0, 10);
function novo(
  obra: Obra,
  seq: number,
  severidade: Alerta['severidade'],
  categoria: CategoriaAlerta,
  titulo: string,
  detalhe: string,
  origemTipo: Alerta['origemTipo'],
  origemRef: string,
  valorReferencia?: number,
): Alerta {
  return {
    id: `ALT-${obra.codigoObra}-${String(seq).padStart(3, '0')}`,
    codigoObra: obra.codigoObra,
    severidade, categoria, titulo, detalhe,
    valorReferencia, origemTipo, origemRef, criadoEm: hoje(),
  };
}
function regraCusto(obra: Obra, alertas: Alerta[]) {
  const cron = obra.cronograma;
  if (!cron) return;
  for (const t of cron.tarefas) {
    if (/EXCLUSO/i.test(t.titulo)) continue;
    const orcado = t.financeiroPlanejado;
    const gasto = t.financeiroRealizado;
    if (!orcado || orcado <= 0) continue;
    const excesso = (gasto - orcado) / orcado;
    if (gasto > orcado) {
      alertas.push(novo(
        obra, alertas.length + 1, 'critico', 'custo',
        `${t.titulo} estourou o orçamento`,
        `Realizado R$ ${fmt(gasto)} contra orçado R$ ${fmt(orcado)} (+${(excesso * 100).toFixed(1)}%).`,
        'etapa', t.eap, gasto - orcado,
      ));
    } else if (t.percentualConcluido > 0) {
      const gastoPct = gasto / orcado;
      const folga = gastoPct - t.percentualConcluido;
      if (folga >= LIMIAR.derrapagemAtencao) {
        alertas.push(novo(
          obra, alertas.length + 1, 'atencao', 'custo',
          `${t.titulo} consumindo orçamento à frente do avanço`,
          `${(gastoPct * 100).toFixed(0)}% do orçamento gasto com ${(t.percentualConcluido * 100).toFixed(0)}% físico concluído — projeta estouro.`,
          'etapa', t.eap, folga,
        ));
      }
    }
  }
}
function regraPrazo(obra: Obra, alertas: Alerta[]) {
  const cron = obra.cronograma;
  if (!cron) return;
  for (const t of cron.tarefas) {
    if (/EXCLUSO/i.test(t.titulo)) continue;
    const jaIniciou = t.percentualConcluido > 0 || t.financeiroRealizado > 0;
    if (!jaIniciou) continue;
    if (t.percentualConcluido >= 1) continue;
    const atraso = -t.atrasoGanhoDias;
    if (atraso >= LIMIAR.atrasoCritico) {
      alertas.push(novo(
        obra, alertas.length + 1, 'critico', 'prazo',
        `${t.titulo} com atraso crítico`,
        `${atraso} dias de atraso — ameaça o marco contratual.`,
        'tarefa', t.eap, atraso,
      ));
    } else if (atraso >= LIMIAR.atrasoAtencao) {
      alertas.push(novo(
        obra, alertas.length + 1, 'atencao', 'prazo',
        `${t.titulo} atrasando`,
        `${atraso} dias de atraso — acompanhar produtividade.`,
        'tarefa', t.eap, atraso,
      ));
    }
  }
}
function regraFinanceiro(obra: Obra, alertas: Alerta[]) {
  const fin = obra.financeiro;
  if (!fin) return;
  const hojeMs = Date.now();
  for (const d of fin.desembolsos) {
    if (d.status === 'PAGO') continue;
    if (d.status === 'VENCIDO') {
      alertas.push(novo(
        obra, alertas.length + 1, 'critico', 'financeiro',
        `Conta vencida — ${d.favorecido}`,
        `R$ ${fmt(d.valor)} em aberto e vencido. Risco de multa e atrito com fornecedor.`,
        'desembolso', String(d.id), d.valor,
      ));
    } else if (d.dataVencimento) {
      const dias = Math.round((new Date(d.dataVencimento).getTime() - hojeMs) / 86400000);
      if (dias >= 0 && dias <= LIMIAR.vencimentoDias) {
        alertas.push(novo(
          obra, alertas.length + 1, 'informativo', 'financeiro',
          `Conta a vencer — ${d.favorecido}`,
          `R$ ${fmt(d.valor)} vence em ${dias} dia(s).`,
          'desembolso', String(d.id), d.valor,
        ));
      }
    }
  }
  if (fin.vencidoEmAberto > 0 && !fin.desembolsos.some((d: typeof fin.desembolsos[number]) => d.status === 'VENCIDO')) {
    alertas.push(novo(
      obra, alertas.length + 1, 'critico', 'financeiro',
      'Há valores vencidos em aberto',
      `R$ ${fmt(fin.vencidoEmAberto)} vencidos segundo o resumo financeiro.`,
      'desembolso', 'resumo', fin.vencidoEmAberto,
    ));
  }
}
function regraQualidade(obra: Obra, alertas: Alerta[]) {
  for (const f of obra.fvs ?? []) {
    if (f.status === 'nao_conforme' || f.status === 'retrabalho') {
      alertas.push(novo(
        obra, alertas.length + 1, 'critico', 'qualidade',
        `FVS reprovada — ${f.etapaNome}`,
        `Ficha ${f.id} marcada como ${f.status === 'nao_conforme' ? 'não conforme' : 'retrabalho'}. Trava a liberação da etapa seguinte.`,
        'fvs', f.id,
      ));
    }
  }
  for (const r of obra.rncs ?? []) {
    if (r.status !== 'resolvida') {
      alertas.push(novo(
        obra, alertas.length + 1, 'critico', 'qualidade',
        'Não-conformidade em aberto',
        `${r.descricao} (status: ${r.status}).`,
        'fvs', r.id,
      ));
    }
  }
}
function regraMedicao(obra: Obra, alertas: Alerta[]) {
  for (const contrato of obra.medicoes ?? []) {
    for (const item of contrato.itens) {
      if (item.medido > item.precoTotal && item.precoTotal > 0) {
        alertas.push(novo(
          obra, alertas.length + 1, 'atencao', 'medicao',
          `Medição acima do contratado — ${contrato.fornecedor}`,
          `Item "${item.descricao.slice(0, 40)}": medido R$ ${fmt(item.medido)} > contratado R$ ${fmt(item.precoTotal)}.`,
          'medicao', `${contrato.fornecedor}-${item.item}`, item.medido - item.precoTotal,
        ));
      }
    }
  }
}
function fmt(n: number): string {
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}
export function calcularAlertas(obra: Obra): Alerta[] {
  const alertas: Alerta[] = [];
  regraCusto(obra, alertas);
  regraPrazo(obra, alertas);
  regraFinanceiro(obra, alertas);
  regraQualidade(obra, alertas);
  regraMedicao(obra, alertas);
  const ordem = { critico: 0, atencao: 1, informativo: 2 };
  return alertas.sort((a, b) => ordem[a.severidade] - ordem[b.severidade]);
}
export function resumirAlertas(obra: Obra): ResumoAlertas {
  const alertas = calcularAlertas(obra);
  const porCategoria: Record<CategoriaAlerta, number> = {
    custo: 0, prazo: 0, financeiro: 0, qualidade: 0, medicao: 0,
  };
  for (const a of alertas) porCategoria[a.categoria]++;
  return {
    codigoObra: obra.codigoObra,
    total: alertas.length,
    criticos: alertas.filter((a) => a.severidade === 'critico').length,
    atencao: alertas.filter((a) => a.severidade === 'atencao').length,
    informativos: alertas.filter((a) => a.severidade === 'informativo').length,
    porCategoria,
    alertas,
  };
}
