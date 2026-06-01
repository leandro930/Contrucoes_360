import React, { useState } from 'react';
import { TransacaoFinanceira, UserRole } from '../../types';
import { obras as realObras } from '../../data/obras';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Briefcase, 
  Plus, 
  DollarSign, 
  CheckCircle, 
  HelpCircle,
  Filter,
  TrendingDown,
  FileCheck
} from 'lucide-react';
import { formatCurrency } from '../../utils/format';

interface FinanceiroProps {
  financeiro: TransacaoFinanceira[];
  currentRole: UserRole;
  obraCode?: string;
  onUpdateFinanceiro: (updated: TransacaoFinanceira[]) => void;
}

export function FinanceiroView({ financeiro, currentRole, obraCode, onUpdateFinanceiro }: FinanceiroProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAddTrans, setShowAddTrans] = useState(false);

  // Form states (kept for fallback)
  const [desc, setDesc] = useState('');
  const [tipo, setTipo] = useState<'DESPESA' | 'RECEITA'>('DESPESA');
  const [cat, setCat] = useState<TransacaoFinanceira['categoriaContas']>('CON_DIRETO');
  const [valor, setValor] = useState('');
  const [vencimento, setVencimento] = useState(new Date().toISOString().split('T')[0]);
  const [fornecedor, setFornecedor] = useState('');

  const isReadOnly = currentRole === 'campo' || currentRole === 'engenharia' || currentRole === 'cliente';

  const obraReal = obraCode ? realObras.find(o => o.codigoObra === obraCode) : undefined;
  
  if (obraReal) {
    if (!obraReal.financeiro || !obraReal.financeiro.desembolsos || obraReal.financeiro.desembolsos.length === 0) {
      return (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-lg text-center text-slate-400">
          Dados do diário financeiro ainda não carregados para esta obra.
        </div>
      );
    }
    
    const despesas = obraReal.financeiro.desembolsos;
    const { totalGeral, totalPago, totalEmAberto } = obraReal.financeiro;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded">
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400">Total Desembolsado (Pago)</span>
            <p className="text-sm font-bold font-mono text-emerald-400 mt-1">{formatCurrency(totalPago)}</p>
            <div className="text-[10px] text-slate-500 mt-1">Custos liquidados no contas</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded col-span-1">
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400">A pagar da Obra</span>
            <p className="text-sm font-semibold font-mono text-amber-500 mt-1">{formatCurrency(totalEmAberto)}</p>
            <div className="text-[10px] text-slate-500 mt-1">Lançamentos vigentes / programados</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded col-span-2">
            <div className="flex flex-col h-full justify-center text-slate-400 text-xs italic opacity-70">
              * Relatórios avançados de caixa são exibidos apenas na aba consolidação. Exibição de {despesas.length} transações importadas de integração Sitta.
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
          <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between gap-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5 font-display">
              <DollarSign size={14} className="text-indigo-400" /> Fluxo Analítico (Fornecedores & Serviços) — {obraCode}
            </h4>
          </div>

          <div className="overflow-x-auto max-h-[800px]">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 bg-slate-950 z-10 border-b border-slate-800 shadow-md">
                <tr className="text-slate-400 text-[10px] font-mono">
                  <th className="py-2.5 px-4 w-12">Orig.</th>
                  <th className="py-2.5 px-3">Favorecido / Histórico</th>
                  <th className="py-2.5 px-3 text-right">Valor (R$)</th>
                  <th className="py-2.5 px-3">Venc. / Pgto.</th>
                  <th className="py-2.5 px-3">Doc</th>
                  <th className="py-2.5 px-3 text-center">Status Sitta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {despesas.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/10 text-slate-300 transition-colors">
                    <td className="py-3 px-4 text-center">
                       <span className="inline-flex p-1 bg-rose-500/10 text-rose-500 rounded-full">
                         <ArrowDownLeft size={14} />
                       </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-200 block">{t.favorecido}</span>
                      <span className="text-[9px] text-slate-500 font-medium font-mono uppercase mt-0.5 block">{t.descricao || t.etapaNome}</span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-100">
                      {formatCurrency(t.valor)}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-400">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px]">V: <span className="text-amber-200">{t.dataVencimento || '-'}</span></span>
                        <span className="text-[10px]">P: {t.status === 'PAGO' && t.dataVencimento ? <span className="text-emerald-400">{t.dataVencimento}</span> : <span className="italic opacity-50">-</span>}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500 text-[10px]">
                      {t.temNotaFiscal ? (
                         <div className="flex items-center gap-1 text-emerald-400"><FileCheck size={10}/> Sim</div>
                      ) : '-'}
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-bold border font-mono uppercase tracking-widest ${
                        t.status === 'PAGO'
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      }`}>
                        {t.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  const filteredTrans = selectedCategory === 'All'
    ? financeiro
    : financeiro.filter(f => f.categoriaContas === selectedCategory);

  // Stats calculate
  const totalReceitas = financeiro.filter(f => f.tipo === 'RECEITA').reduce((acc, f) => acc + f.valor, 0);
  const totalDespesas = financeiro.filter(f => f.tipo === 'DESPESA').reduce((acc, f) => acc + f.valor, 0);
  const totalPagas = financeiro.filter(f => f.tipo === 'DESPESA' && f.status === 'PAGO').reduce((acc, f) => acc + f.valor, 0);
  const totalAPagar = financeiro.filter(f => f.tipo === 'DESPESA' && f.status === 'A_PAGAR').reduce((acc, f) => acc + f.valor, 0);

  const cashBalance = totalReceitas - totalDespesas;

  const handlePay = (id: string) => {
    if (isReadOnly) return;
    const updated = financeiro.map(f => {
      if (f.id === id) {
        return { 
          ...f, 
          status: f.tipo === 'RECEITA' ? 'RECEBIDO' as const : 'PAGO' as const,
          dataPagamento: new Date().toISOString().split('T')[0]
        };
      }
      return f;
    });
    onUpdateFinanceiro(updated);
  };

  const handleCreateTransSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc || !valor) return;

    const parsedVal = parseFloat(valor);
    if (isNaN(parsedVal)) return;

    const nova: TransacaoFinanceira = {
      id: `f-${Date.now()}`,
      obraId: financeiro[0]?.obraId || 'sitta',
      descricao: desc,
      tipo: tipo,
      categoriaContas: cat,
      valor: parsedVal,
      dataVencimento: vencimento,
      status: tipo === 'RECEITA' ? 'A_RECEBER' : 'A_PAGAR',
      fornecedorNome: fornecedor || undefined
    };

    onUpdateFinanceiro([nova, ...financeiro]);
    setDesc('');
    setValor('');
    setFornecedor('');
    setShowAddTrans(false);
  };

  return (
    <div className="space-y-6">
      {/* Visual financial statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded">
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400">Total Recebido (Aportes)</span>
          <p className="text-sm font-bold font-mono text-emerald-400 mt-1">{formatCurrency(totalReceitas)}</p>
          <div className="text-[10px] text-slate-500 mt-1">Fundo total provido pelo cliente</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded">
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-rose-450 font-medium">Total Desembolsado (Pago)</span>
          <p className="text-sm font-bold font-mono text-rose-400 mt-1">{formatCurrency(totalPagas)}</p>
          <div className="text-[10px] text-slate-500 mt-1">Custos liquidados e comprovados</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded col-span-1">
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400">A pagar da Obra</span>
          <p className="text-sm font-semibold font-mono text-amber-500 mt-1">{formatCurrency(totalAPagar)}</p>
          <div className="text-[10px] text-slate-500 mt-1">Boletins aprovados no contas a pagar</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded">
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400">Saldo Disponível em Caixa</span>
          <p className={`text-sm font-bold font-mono mt-1 ${cashBalance >= 0 ? 'text-indigo-400' : 'text-rose-400'}`}>
            {formatCurrency(cashBalance)}
          </p>
          <div className="text-[10px] text-slate-500 mt-1">Margem operacional fluida da obra</div>
        </div>
      </div>

      {/* Main transactions list */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5 font-display">
            <DollarSign size={14} className="text-indigo-400" /> Transações Financeiras e Fluxo de Caixa (CC: CON_DIRETO)
          </h4>

          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none"
            >
              <option value="All">Plano de Contas Completo</option>
              <option value="CON_DIRETO">CON_DIRETO (Custo de Obra)</option>
              <option value="CLIENTE_APORTE">Aporte de Clientes</option>
              <option value="MAQUINARIO">Maquinários & Aluguéis</option>
              <option value="IMPOSTOS">Impostos & Taxas Administrata</option>
              <option value="PEQUENAS_DESPESAS">Pequenas Despesas Canteiro</option>
            </select>

            {!isReadOnly && (
              <button
                onClick={() => setShowAddTrans(!showAddTrans)}
                className="bg-indigo-600 hover:bg-indigo-700 text-slate-100 text-[10px] font-bold px-2.5 py-1.5 rounded flex items-center gap-1 min-h-[30px]"
              >
                <Plus size={12} /> Lançar Transação
              </button>
            )}
          </div>
        </div>

        {showAddTrans && (
          <form onSubmit={handleCreateTransSubmit} className="bg-slate-955 p-4 border-b border-slate-850 space-y-3.5">
            <h5 className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">Lançar Nova Receita / Despesa no Fluxo</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Descrição do lançamento</label>
                <input
                  type="text"
                  placeholder="e.g. Aluguel de betoneira diesel e andaimes"
                  value={desc}
                  required
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-100"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Tipo</label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as any)}
                  className="w-full text-xs px-2 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-100"
                >
                  <option value="DESPESA">DESPESA (Saída de Caixa)</option>
                  <option value="RECEITA">RECEITA (Aporte ou Entrada)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Plano de Contas</label>
                <select
                  value={cat}
                  onChange={(e) => setCat(e.target.value as any)}
                  className="w-full text-xs px-2 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-100"
                >
                  <option value="CON_DIRETO">CON_DIRETO</option>
                  <option value="CLIENTE_APORTE">CLIENTE_APORTE</option>
                  <option value="MAQUINARIO">MAQUINARIO</option>
                  <option value="IMPOSTOS">IMPOSTOS</option>
                  <option value="PEQUENAS_DESPESAS">PEQUENAS_DESPESAS</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Valor (R$)</label>
                <input
                  type="number"
                  placeholder="e.g. 15000"
                  value={valor}
                  required
                  onChange={(e) => setValor(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-100 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Data Vencimento</label>
                <input
                  type="date"
                  value={vencimento}
                  required
                  onChange={(e) => setVencimento(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-100"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Fornecedor / Favorecido</label>
                <input
                  type="text"
                  placeholder="Opcional"
                  value={fornecedor}
                  onChange={(e) => setFornecedor(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-100"
                />
              </div>
            </div>

            <div className="flex justify-end gap-1.5 text-[10px] pt-1.5">
              <button type="button" onClick={() => setShowAddTrans(false)} className="px-3 py-1.5 bg-slate-800 text-slate-450 rounded">Cancelar</button>
              <button type="submit" className="px-3 py-1.5 bg-indigo-600 font-bold text-slate-100 rounded">Efetuar Lançamento</button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/20 border-b border-slate-800 text-slate-400 text-[10px] font-mono">
                <th className="py-2.5 px-4">Fluxo</th>
                <th className="py-2.5 px-3">Ementa Lançamento</th>
                <th className="py-2.5 px-3">Conta / Classificação</th>
                <th className="py-2.5 px-3 text-right">Valor bruto</th>
                <th className="py-2.5 px-3">Vencimento</th>
                <th className="py-2.5 px-3">Pagamento / Liquidação</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredTrans.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 italic">
                    Nenhuma transação financeira registrada neste plano de contas para a obra corrente.
                  </td>
                </tr>
              ) : (
                filteredTrans.map((t) => {
                  const isRevenue = t.tipo === 'RECEITA';

                  return (
                    <tr key={t.id} className="hover:bg-slate-800/10 text-slate-300">
                      <td className="py-3 px-4 text-center">
                        {isRevenue ? (
                          <span className="inline-flex p-1 bg-emerald-500/10 text-emerald-400 rounded-full" title="Entrada / Recebimento">
                            <ArrowUpRight size={14} />
                          </span>
                        ) : (
                          <span className="inline-flex p-1 bg-rose-500/10 text-rose-500 rounded-full" title="Saída / Despesa">
                            <ArrowDownLeft size={14} />
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-200 block">{t.descricao}</span>
                        {t.fornecedorNome && <span className="text-[10px] text-slate-500 font-medium">Favorecido: {t.fornecedorNome}</span>}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono bg-indigo-500/10 text-indigo-300 px-1.5 py-0.5 rounded text-[10px] font-bold">
                          {t.categoriaContas}
                        </span>
                      </td>
                      <td className={`py-3 px-3 text-right font-mono font-bold text-sm ${isRevenue ? 'text-emerald-400' : 'text-slate-100'}`}>
                        {isRevenue ? `+ ${formatCurrency(t.valor)}` : formatCurrency(t.valor)}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-400">{t.dataVencimento}</td>
                      <td className="py-3 px-3 font-mono text-slate-500">
                        {t.dataPagamento || <span className="italic opacity-50">Não liquidado</span>}
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                          t.status === 'PAGO' || t.status === 'RECEBIDO'
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {isReadOnly ? (
                          <span className="text-slate-500 italic">-</span>
                        ) : (t.status === 'A_PAGAR' || t.status === 'A_RECEBER') ? (
                          <button
                            onClick={() => handlePay(t.id)}
                            className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-slate-100 font-bold text-[10px] rounded transition-all"
                          >
                            Quitar lanc.
                          </button>
                        ) : (
                          <span className="text-slate-500 font-mono text-[9px]">✔ LIQUIDADO</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
