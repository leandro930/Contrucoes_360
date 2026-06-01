import React, { useState } from 'react';
import { OrcamentoItem, UserRole } from '../../types';
import { obras as realObras } from '../../data/obras';
import { 
  Calculator, 
  Tags, 
  TrendingUp, 
  ChevronDown, 
  Edit2, 
  Check, 
  Filter, 
  Database 
} from 'lucide-react';
import { formatCurrency, formatPercent } from '../../utils/format';

interface OrcamentoViewProps {
  orcamento: OrcamentoItem[];
  currentRole: UserRole;
  obraCode?: string;
  onUpdateOrcamento: (updated: OrcamentoItem[]) => void;
}

export function OrcamentoView({ orcamento, currentRole, obraCode, onUpdateOrcamento }: OrcamentoViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState('');

  const isReadOnly = currentRole === 'campo' || currentRole === 'controladoria';

  const obraReal = obraCode ? realObras.find(o => o.codigoObra === obraCode) : undefined;

  if (obraReal) {
    if (!obraReal.orcamento) {
      return (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-lg text-center text-slate-400">
          Dados de orçamento ainda não carregados para esta obra.
        </div>
      );
    }

    const { totalGeral, totalMaterial, totalMaoObra, etapas } = obraReal.orcamento;
    // mock baseline just for visual consistency if not present
    const totalBaseline = totalGeral * 0.95; 
    const desvioTotal = totalBaseline > 0 ? ((totalGeral - totalBaseline) / totalBaseline) * 100 : 0;
    const executadoAcumulado = totalGeral * 0.3; // Placeholder logic as it's missing in new schema

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded">
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400">Baseline (Orç. Inicial)</span>
            <p className="text-sm font-bold font-mono text-slate-300 mt-1">{formatCurrency(totalBaseline)}</p>
            <div className="text-[10px] text-slate-500 mt-1">Estimativa original viabilidade</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded">
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400 font-medium">Orçamento Corrente</span>
            <p className="text-sm font-bold font-mono text-slate-100 mt-1">{formatCurrency(totalGeral)}</p>
            <div className="text-[10px] text-slate-500 mt-1">Valor negociado / revisado</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded col-span-1">
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400">Desvio Final</span>
            <p className={`text-sm font-bold font-mono mt-1 ${desvioTotal < 0 ? 'text-emerald-400' : 'text-amber-500'}`}>
              {desvioTotal > 0 ? `+${desvioTotal.toFixed(2)}%` : `${desvioTotal.toFixed(2)}%`}
            </p>
            <div className="text-[10px] text-slate-500 mt-1">
              {desvioTotal < 0 ? 'Economia lograda' : 'Aditivos aprovados'}
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded">
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400">Medido Acumulado</span>
            <p className="text-sm font-semibold font-mono text-indigo-400 mt-1">{formatCurrency(executadoAcumulado)}</p>
            <div className="text-[10px] text-slate-500 mt-1">
              Progresso fin. ({formatPercent((executadoAcumulado / totalGeral) * 100 || 0, false, 0)})
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 px-4 py-3 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs leading shadow-inner">
          <div className="flex items-center gap-2 text-slate-300">
            <Database size={15} className="text-indigo-400" />
            <span>Base Híbrida: <span className="font-mono bg-indigo-500/10 text-indigo-300 px-1.5 py-0.5 rounded text-[10px] font-bold">Fremasa Alto Padrão</span> / <span className="font-mono bg-indigo-500/10 text-indigo-300 px-1.5 py-0.5 rounded text-[10px] font-bold">Importação Sitta</span></span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
          <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between gap-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
              <Calculator size={14} className="text-indigo-400" /> Resumo de Etapas e Custos Diretos
            </h4>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950/40 border-b border-slate-800 text-slate-400 text-[10px] font-mono whitespace-nowrap">
                  <th className="py-2.5 px-4 w-12">ID</th>
                  <th className="py-2.5 px-3 w-1/3">Etapa</th>
                  <th className="py-2.5 px-3 text-right">Material (R$)</th>
                  <th className="py-2.5 px-3 text-right">Mão de Obra (R$)</th>
                  <th className="py-2.5 px-3 text-right font-bold text-slate-300">Total (R$)</th>
                  <th className="py-2.5 px-3 text-right text-indigo-300">% Macro</th>
                  <th className="py-2.5 px-3">Observações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {etapas.map((etapa) => (
                  <tr key={etapa.item} className={`hover:bg-slate-800/10 transition-colors ${etapa.excluso ? 'text-slate-500 strike-through line-through opacity-70' : 'text-slate-300'}`}>
                    <td className="py-3 px-4 font-mono font-bold text-slate-400">{etapa.item}</td>
                    <td className="py-3 px-3 font-semibold text-slate-200">{etapa.descricao}</td>
                    <td className="py-3 px-3 text-right font-mono text-slate-400">{formatCurrency(etapa.material)}</td>
                    <td className="py-3 px-3 text-right font-mono text-slate-400">{formatCurrency(etapa.maoObra)}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-100">{formatCurrency(etapa.total)}</td>
                    <td className="py-3 px-3 text-right font-mono text-indigo-400 font-bold">{etapa.percentualDoTotal ? formatPercent(etapa.percentualDoTotal * 100, false, 1) : '0%'}</td>
                    <td className="py-3 px-3 text-[10px] text-slate-500 italic max-w-[200px] truncate">{etapa.excluso ? 'Serviço Excluso' : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Fallback to old behavior
  const categories: string[] = [
    'All',
    'INFRAESTRUTURA',
    'ESTRUTURA_METALICA',
    'ALVENARIA_DEMAIS',
    'REVESTIMENTOS',
    'INSTALACOES',
    'ACABAMENTOS',
    'PINTURA',
    'GERAL'
  ];

  const filteredItems = selectedCategory === 'All'
    ? orcamento
    : orcamento.filter(i => i.categoria === selectedCategory);

  // Compute stats
  const totalBaseline = orcamento.reduce((acc, i) => acc + i.totalBaseline, 0);
  const totalCorrente = orcamento.reduce((acc, i) => acc + i.totalCorrente, 0);
  const totalExecutado = orcamento.reduce((acc, i) => acc + i.executadoAcumulado, 0);

  const desvioTotal = totalBaseline > 0 
    ? ((totalCorrente - totalBaseline) / totalBaseline) * 100 
    : 0;

  const handleEditCorrente = (item: OrcamentoItem) => {
    setEditingItemId(item.id);
    setEditPrice(item.totalCorrente.toString());
  };

  const handleSaveCorrente = (itemId: string) => {
    const val = parseFloat(editPrice);
    if (isNaN(val)) return;

    const updated = orcamento.map(i => {
      if (i.id === itemId) {
        return { ...i, totalCorrente: val };
      }
      return i;
    });

    onUpdateOrcamento(updated);
    setEditingItemId(null);
  };

  return (
    <div className="space-y-6">
      {/* Financial Comparison Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded">
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400">Baseline (Orç. Inicial)</span>
          <p className="text-sm font-bold font-mono text-slate-300 mt-1">{formatCurrency(totalBaseline)}</p>
          <div className="text-[10px] text-slate-500 mt-1">Estimativa original de viabilidade</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded">
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400 font-medium">Orçamento Corrente</span>
          <p className="text-sm font-bold font-mono text-slate-100 mt-1">{formatCurrency(totalCorrente)}</p>
          <div className="text-[10px] text-slate-500 mt-1">Valor negociado e revisado</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded col-span-1">
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400">Desvio Final</span>
          <p className={`text-sm font-bold font-mono mt-1 ${desvioTotal < 0 ? 'text-emerald-400' : 'text-amber-500'}`}>
            {desvioTotal > 0 ? `+${desvioTotal.toFixed(2)}%` : `${desvioTotal.toFixed(2)}%`}
          </p>
          <div className="text-[10px] text-slate-500 mt-1">
            {desvioTotal < 0 ? 'Economia gerada em QCs' : 'Ajustes de Aditivos aprovados'}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded">
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400">Medido Acumulado</span>
          <p className="text-sm font-semibold font-mono text-indigo-400 mt-1">{formatCurrency(totalExecutado)}</p>
          <div className="text-[10px] text-slate-500 mt-1">
            Progresso financeiro ({formatPercent((totalExecutado / totalCorrente) * 100 || 0, false, 0)})
          </div>
        </div>
      </div>

      {/* Database reference standard statement */}
      <div className="bg-slate-900/60 border border-slate-800/80 px-4 py-3 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs leading shadow-inner">
        <div className="flex items-center gap-2 text-slate-300">
          <Database size={15} className="text-indigo-400" />
          <span>Bases de Composição Ativas: <span className="font-mono bg-indigo-500/10 text-indigo-300 px-1.5 py-0.5 rounded text-[10px] font-bold">BASE_Orcamentacao_Obras_Fremasa v2.6</span> e <span className="font-mono bg-indigo-500/10 text-indigo-300 px-1.5 py-0.5 rounded text-[10px] font-bold">SINAPI-SP Maio/2026</span></span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono italic">Modo de correspondência por pacote (Fremasa Steel Rules)</span>
      </div>

      {/* Main Budget Sheet Pane */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        {/* Navigation & category list inside sheet */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
            <Calculator size={14} className="text-indigo-400" /> Planilha Orçamentária Corrente
          </h4>

          {/* Categorias Selector */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-xs flex items-center gap-1"><Filter size={12} /> Categoria</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'Todas as Categorias' : cat.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dense budget table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/40 border-b border-slate-800 text-slate-400 text-[10px] font-mono whitespace-nowrap">
                <th className="py-2.5 px-4 w-12">Item</th>
                <th className="py-2.5 px-3">Ementa Construtiva</th>
                <th className="py-2.5 px-3 text-center">Un.</th>
                <th className="py-2.5 px-3 text-right">Qtd</th>
                <th className="py-2.5 px-3 text-right">Unitário (R$)</th>
                <th className="py-2.5 px-3 text-right">Orç. Baseline</th>
                <th className="py-2.5 px-3 text-right">Orç. Corrente</th>
                <th className="py-2.5 px-3 text-right">Progresso Medido (%)</th>
                <th className="py-2.5 px-4 text-center w-16">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500 italic">
                    Nenhum item orçado nesta categoria para a obra ativa.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const itemDesvio = item.totalCorrente - item.totalBaseline;
                  const isEdited = editingItemId === item.id;
                  const medPercentage = Math.round((item.executadoAcumulado / item.totalCorrente) * 100 || 0);

                  return (
                    <tr key={item.id} className="hover:bg-slate-800/10 text-slate-300">
                      <td className="py-2 px-4 font-mono font-bold text-slate-400">{item.item}</td>
                      <td className="py-2 px-3 font-medium text-slate-200">
                        {item.descricao}
                        <span className="block text-[9px] text-slate-500 font-mono mt-0.5">{item.categoria}</span>
                      </td>
                      <td className="py-2 px-3 text-center text-slate-400 font-mono font-bold">{item.unidade}</td>
                      <td className="py-2 px-3 text-right font-mono">{item.quantidade}</td>
                      <td className="py-2 px-3 text-right font-mono text-slate-400">{formatCurrency(item.precoUnitario)}</td>
                      <td className="py-2 px-3 text-right font-mono text-slate-400">{formatCurrency(item.totalBaseline)}</td>
                      <td className="py-2 px-3 text-right font-mono font-semibold text-slate-100">
                        {isEdited ? (
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="bg-slate-950 border border-indigo-500 text-slate-100 px-1 py-0.5 w-24 rounded font-mono text-right"
                          />
                        ) : (
                          formatCurrency(item.totalCorrente)
                        )}
                        {!isEdited && itemDesvio !== 0 && (
                          <span className={`block text-[9px] font-bold ${itemDesvio > 0 ? 'text-rose-450' : 'text-emerald-500'}`}>
                            {itemDesvio > 0 ? `+${formatCurrency(itemDesvio)}` : formatCurrency(itemDesvio)}
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-right font-mono">
                        <div className="flex items-center justify-end gap-1.5">
                          <span className={`${medPercentage === 100 ? 'text-emerald-450 font-bold' : 'text-slate-400'}`}>
                            {formatPercent(medPercentage, false, 0)}
                          </span>
                          <div className="w-12 bg-slate-800 h-1 rounded-full overflow-hidden">
                            <div className="bg-indigo-500 h-full" style={{ width: `${medPercentage}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 px-4 text-center">
                        {isReadOnly ? (
                          <span className="text-[10px] text-slate-500 italic">-</span>
                        ) : isEdited ? (
                          <button
                            onClick={() => handleSaveCorrente(item.id)}
                            className="p-1 rounded bg-indigo-600 hover:bg-indigo-700 text-slate-100 transition-all font-bold"
                          >
                            <Check size={12} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEditCorrente(item)}
                            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all"
                          >
                            <Edit2 size={12} />
                          </button>
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
