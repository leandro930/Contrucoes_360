import React, { useState } from 'react';
import { DiarioObra, TransacaoFinanceira, Obra as ObraVelha } from '../../types';
import { Obra } from '../../types/obra';
import { 
  FileText, 
  TrendingUp, 
  Users, 
  Calendar, 
  Printer, 
  ChevronRight, 
  Download,
  Percent,
  CheckSquare,
  Activity,
  Camera
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { checklistEntregaExemplo } from '../../data/governancaExemplos';
import { FolderOpen } from 'lucide-react';
import { formatCurrency, formatPercent } from '../../utils/format';

interface RelatoriosProps {
  obra: ObraVelha;
  diarios: DiarioObra[];
  financeiro: TransacaoFinanceira[];
  realObra?: Obra;
}

export function RelatoriosView(props: RelatoriosProps) {
  const [innerTab, setInnerTab] = useState<'RELATORIO' | 'ENTREGA'>('RELATORIO');

  return (
    <div className="space-y-6">
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setInnerTab('RELATORIO')}
          className={`px-4 py-2 border-b-2 text-xs font-bold uppercase tracking-wider cursor-pointer transition flex items-center gap-1.5 ${
            innerTab === 'RELATORIO' 
              ? 'border-indigo-500 text-slate-100' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText size={14} /> Relatórios Financeiros/Executivos
        </button>
        <button
          onClick={() => setInnerTab('ENTREGA')}
          className={`px-4 py-2 border-b-2 text-xs font-bold uppercase tracking-wider cursor-pointer transition flex items-center gap-1.5 ${
            innerTab === 'ENTREGA' 
              ? 'border-indigo-500 text-slate-100' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FolderOpen size={14} /> Entrega & Databook
        </button>
      </div>

      {innerTab === 'ENTREGA' && (
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg space-y-6">
          <div className="flex justify-between items-center border-b border-slate-850 pb-4">
            <div>
              <h3 className="text-sm font-bold font-display text-slate-100 flex items-center gap-2">
                <FolderOpen size={16} className="text-indigo-400"/> Checklist de Entrega de Obra
              </h3>
              <p className="text-[10px] text-slate-500 mt-1 font-mono">{checklistEntregaExemplo.obra} - ID: {checklistEntregaExemplo.id}</p>
            </div>
            <div className="bg-slate-950 px-3 py-1.5 rounded border border-slate-800 text-center">
               <span className="block text-[10px] uppercase font-bold text-slate-500">Progresso Databook</span>
               <span className="text-sm font-bold text-indigo-400 font-mono">{checklistEntregaExemplo.percentualCompleto}%</span>
            </div>
          </div>

          <div className="space-y-4">
            {checklistEntregaExemplo.sistemas.map((sis, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-850 rounded p-4">
                <h4 className="text-xs font-bold text-slate-300 font-mono flex items-center gap-2 mb-2">
                  <span className="bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded uppercase font-bold text-[10px]">{sis.sistema}</span>
                  {sis.subsistema && <span className="text-slate-500 font-bold"> / {sis.subsistema}</span>}
                </h4>
                
                <div className="mt-3 space-y-2">
                  {sis.documentos.map((doc, docIdx) => (
                    <div key={docIdx} className="flex items-center gap-3 text-xs bg-slate-900 p-2 rounded border border-slate-800">
                      <input type="checkbox" checked={doc.entregue} readOnly className="h-4 w-4 bg-slate-900 rounded border-slate-700 text-indigo-500 focus:ring-offset-0 focus:ring-0" />
                      <span className={doc.entregue ? "text-slate-500" : "text-slate-200"}>{doc.tipo}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {innerTab === 'RELATORIO' && <RelatoriosViewInner {...props} />}
    </div>
  );
}

function RelatoriosViewInner({ obra, diarios, financeiro, realObra }: RelatoriosProps) {
  const [selectedFormat, setSelectedFormat] = useState<'SEMANAL' | 'QUINZENAL' | 'MENSAL'>('QUINZENAL');
  const relatorioBase = realObra?.relatorios?.[0];
  const [diretorNote, setDiretorNote] = useState(
    relatorioBase?.observacoes.join('\n') || 'Todas as metas da quinzena foram superadas.'
  );
  const [printStatus, setPrintStatus] = useState<string | null>(null);

  if (realObra) {
    if (!realObra.relatorios || realObra.relatorios.length === 0) {
      return (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-lg text-center text-slate-400">
          Dados de relatórios ainda não carregados para esta obra.
        </div>
      );
    }

    const relatorio = realObra.relatorios[0];

    const chartData = relatorio.visaoGeral.map(s => ({
      name: s.servico,
      Avanço: Math.round(s.percentual * 100),
      color: s.percentual > 0.8 ? '#4f46e5' : s.percentual > 0.4 ? '#818cf8' : '#cbd5e1'
    }));

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950 p-3 rounded-lg border border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider font-mono">Boletim de Performance:</span>
            <div className="flex gap-1.5">
               <button className="px-3 py-1 rounded text-xs font-semibold bg-indigo-600 text-slate-100 uppercase">
                  Relatório ({relatorio.data})
               </button>
            </div>
          </div>
          <button
            onClick={() => {
              setPrintStatus('gerando');
              setTimeout(() => setPrintStatus('concluido'), 1500);
              setTimeout(() => setPrintStatus(null), 4000);
            }}
            disabled={printStatus !== null}
            className={`px-3 py-1.5 rounded text-[11px] font-semibold text-slate-100 font-mono flex items-center gap-1.5 transition ${
              printStatus === 'gerando' ? 'bg-amber-500/50 cursor-wait' 
              : printStatus === 'concluido' ? 'bg-emerald-600' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            <Printer size={14} /> {printStatus === 'gerando' ? 'Gerando...' : printStatus === 'concluido' ? 'Gerado!' : 'Imprimir PDF'}
          </button>
        </div>

        {/* Dashboard Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg flex flex-col justify-between">
             <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
               <h4 className="text-xs font-bold tracking-widest text-slate-300 uppercase font-mono flex items-center gap-2"><Activity size={14} className="text-indigo-400"/> Panorama Operacional</h4>
               <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold">Concluído Global: {formatPercent(relatorio.percentualConcluidoGlobal * 100, false, 1)}</span>
             </div>
             
             <div className="h-64 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }} barSize={14}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace'}} width={100} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b', fontSize: '11px', color: '#f8fafc', borderRadius: '4px'}} />
                    <Bar dataKey="Avanço" radius={[0, 4, 4, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
             </div>
             <p className="text-[10px] text-slate-500 italic mt-2">* Referência S-curve estrutural</p>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg">
               <h4 className="text-xs font-bold tracking-widest text-slate-300 uppercase font-mono flex items-center gap-2 mb-4"><Users size={14} className="text-emerald-400"/> Distribuição de Efetivo</h4>
               <div className="space-y-3">
                 <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-400">Efetivo reportado:</span>
                    <span className="text-slate-100 font-bold">{relatorio.equipes.length} frentes alocadas</span>
                 </div>
                 
                 <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
                    {relatorio.equipes.slice(0, 3).map((eq, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[10px] font-mono">
                         <span className="text-indigo-300">{eq.funcao}</span>
                         <span className="text-slate-500">{eq.empresa}</span>
                      </div>
                    ))}
                    {relatorio.equipes.length > 3 && (
                      <div className="text-[10px] text-slate-500 font-mono mt-1">+ {relatorio.equipes.length - 3} equipes</div>
                    )}
                 </div>
               </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg flex-grow">
               <h4 className="text-xs font-bold tracking-widest text-slate-300 uppercase font-mono flex items-center gap-2 mb-3"><TrendingUp size={14} className="text-amber-400"/> Próximas Etapas</h4>
               <ul className="space-y-1.5">
                  {relatorio.proximasEtapas.map((pe, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span> <span>{pe}</span>
                    </li>
                  ))}
               </ul>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg">
          <label className="text-[10px] text-slate-400 uppercase font-mono font-bold tracking-widest block mb-2">Considerações e Parecer Técnico</label>
          <textarea
            value={diretorNote}
            onChange={(e) => setDiretorNote(e.target.value)}
            className="w-full text-xs px-3 py-2.5 font-serif italic text-slate-300 rounded bg-slate-950/50 border border-slate-800 min-h-20 focus:outline-none focus:border-indigo-500/50 transition-colors"
          />
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg">
          <h4 className="text-xs font-bold tracking-widest text-slate-300 uppercase font-mono flex items-center gap-2 mb-4 border-b border-slate-800 pb-2"><Camera size={14} className="text-indigo-400"/> Caderno Fotográfico</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
             {relatorio.fotos.map((rf, idx) => (
               <div key={idx} className="group relative overflow-hidden rounded border border-slate-800">
                  <div className="aspect-[4/3] bg-slate-950 relative">
                     <img src={`https://images.unsplash.com/photo-1541888086425-d81bb19240f5?w=500&q=80&idx=${idx}`} alt="obra" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                  </div>
                  <div className="p-2.5 bg-slate-950 border-t border-slate-800">
                     <span className="block text-[9px] font-mono text-indigo-400 font-bold mb-0.5">{rf.categoria || 'Geral'}</span>
                     <p className="text-[10px] text-slate-400 leading-tight">{rf.legenda}</p>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    );
  }

  const activeRdos = diarios.slice(0, 3); // take recent logs

  return (
    <div className="space-y-6">
      {/* Selector Format Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950 p-3 rounded-lg border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 text-xs font-bold uppercase tracking-wider font-mono">Formato do Relatório:</span>
          <div className="flex gap-1.5">
            {(['SEMANAL', 'QUINZENAL', 'MENSAL'] as const).map(fmt => (
              <button
                key={fmt}
                onClick={() => setSelectedFormat(fmt)}
                className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition ${
                  selectedFormat === fmt 
                    ? 'bg-indigo-600 text-slate-100' 
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {fmt === 'SEMANAL' ? 'Semanal (Campo)' : fmt === 'QUINZENAL' ? 'Quinzenal (Cliente)' : 'Mensal (Executivo Fin.)'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 relative">
          <button
            onClick={() => {
              setPrintStatus('gerando');
              setTimeout(() => setPrintStatus('concluido'), 1500);
              setTimeout(() => setPrintStatus(null), 4000);
            }}
            disabled={printStatus !== null}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold text-slate-100 font-mono flex items-center gap-1.5 transition ${
              printStatus === 'gerando' 
                ? 'bg-amber-500/50 cursor-wait' 
                : printStatus === 'concluido'
                ? 'bg-emerald-600'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            <Printer size={12} /> {printStatus === 'gerando' ? 'Gerando...' : printStatus === 'concluido' ? 'Relatório Gerado!' : 'Imprimir PDF'}
          </button>
          {printStatus === 'concluido' && (
            <div className="absolute top-10 right-0 bg-emerald-950 border border-emerald-500 p-2 rounded shadow-lg text-[10px] text-emerald-400 font-mono w-52 z-10 text-center">
              Aviso: Impressão bloqueada no iframe de preview.
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Director Note box */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg space-y-2">
        <label className="text-[10px] text-slate-400 uppercase font-mono font-bold tracking-widest block">Considerações do Engenheiro Gestor (Rafael Icimoto)</label>
        <textarea
          value={diretorNote}
          onChange={(e) => setDiretorNote(e.target.value)}
          className="w-full text-xs px-2.5 py-1.5 font-sans rounded bg-slate-950 border border-slate-850 text-slate-200 min-h-16 focus:outline-none"
        />
      </div>

      {/* PRINT AREA PREVIEW CARD */}
      <div className="bg-white text-slate-900 p-8 rounded-lg shadow-2xl relative overflow-hidden font-sans border border-slate-300 print:shadow-none print:border-none">
        
        {/* Fremasa Header Stamp */}
        <div className="flex justify-between items-start border-b-2 border-indigo-900 pb-5">
          <div>
            <span className="text-xs font-bold tracking-widest text-indigo-900 font-mono uppercase">GRUPO FREMASA CONSTRUÇÕES</span>
            <h3 className="text-xl font-bold tracking-tight text-slate-800 mt-1">{obra.name}</h3>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">Código Único: {obra.code} | Contrato: {obra.proposalCode}</p>
          </div>
          <div className="text-right">
            <span className="inline-block bg-indigo-950 text-white text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider font-mono">
              {selectedFormat === 'SEMANAL' ? 'Relatório Técnico Semanal' : selectedFormat === 'QUINZENAL' ? 'Caderno Quinzenal do Cliente' : 'Ficha Consolidada Mensal'}
            </span>
            <p className="text-[10px] text-slate-400 font-mono mt-1.5">Emitido: 30/05/2026</p>
          </div>
        </div>

        {/* Dynamic Inner Layout depending on the format selected */}
        {selectedFormat === 'QUINZENAL' && (
          <div className="mt-8 space-y-6">
            <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-900">
              <span className="text-[10px] font-mono font-bold uppercase text-indigo-900 block">Prezado(a) {obra.client || 'Cliente'},</span>
              <p className="text-xs text-slate-700 leading-relaxed mt-1">
                Apresentamos o caderno de acompanhamento quinzenal com os destaques físicos da sua residência no condomínio Quinta da Baroneza. Nosso compromisso é transparência total e cuidado meticuloso com cada milímetro da execução.
              </p>
            </div>

            {/* Current Completion Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                <span className="text-[9px] font-mono text-slate-500 uppercase block">Avanço Construtivo Geral</span>
                <span className="text-2xl font-bold text-indigo-900 mt-1 block">{obra.percentageFisico}%</span>
                <span className="text-[9px] text-slate-500 block mt-1">S-Curve Aligned</span>
              </div>
              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                <span className="text-[9px] font-mono text-slate-500 uppercase block">Medido Acumulado</span>
                <span className="text-2xl font-bold text-slate-800 mt-1 block">{obra.percentageFinanceiro}%</span>
                <span className="text-[9px] text-slate-500 block mt-1">Homologações Ativas</span>
              </div>
              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                <span className="text-[9px] font-mono text-slate-500 uppercase block">Situação de Prazo</span>
                <span className="text-xs font-bold text-emerald-600 mt-2.5 block uppercase">Dentro do Ritmo</span>
                <span className="text-[9px] text-slate-500 block mt-1">Sem desvios</span>
              </div>
            </div>

            {/* Photo collage */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-indigo-900 uppercase font-mono">Destaques Visuais do Canteiro</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded overflow-hidden border border-slate-200">
                  <div className="aspect-video bg-slate-100">
                    <img 
                      src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800" 
                      alt="campo" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="p-2 text-slate-600 text-[10px] bg-slate-50">
                    Assentamento e nivelamento milimétrico do Drywall Acústico na suíte master.
                  </div>
                </div>
                <div className="rounded overflow-hidden border border-slate-200">
                  <div className="aspect-video bg-slate-100">
                    <img 
                      src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800" 
                      alt="campo" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="p-2 text-slate-600 text-[10px] bg-slate-50">
                    Nivelamento do contrapiso rústico e dreno d'água perimetral da varanda norte.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedFormat === 'SEMANAL' && (
          <div className="mt-8 space-y-6 text-xs text-slate-800">
            {/* Weekly field accomplishments */}
            <div>
              <h4 className="text-xs font-bold tracking-widest text-indigo-900 uppercase font-mono mb-2.5">Atividades Consolidadas (Campo)</h4>
              <div className="space-y-2">
                {activeRdos.map((r, idx) => (
                  <div key={r.id} className="bg-slate-50 p-3 rounded text-[11px] border border-slate-200">
                    <div className="flex justify-between font-mono font-bold text-slate-700 mb-1">
                      <span>Data: {r.date} — {r.codigoRelatorio.split(' — ')[1]}</span>
                      <span>Efetivo: {r.efetivoFremasa + r.efetivoSubempreitados} pessoas</span>
                    </div>
                    <ul className="list-disc pl-4 space-y-0.5 text-slate-600 mt-1.5">
                      {r.atividades.map((at) => (
                        <li key={at.id}>{at.descricao}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly count statistics */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
              <div>
                <h5 className="font-bold text-slate-700 font-mono text-[11px] uppercase mb-2">Climas Observados no Período</h5>
                <div className="space-y-1 text-[11px] text-slate-600 font-mono">
                  <p>✔ Sol Pleno: 4 dias</p>
                  <p>🌦 Nublado: 1 dia</p>
                  <p>🌧 Chuva Intempestiva: 1 dia (tarde, com remobilização interna)</p>
                </div>
              </div>
              <div>
                <h5 className="font-bold text-slate-700 font-mono text-[11px] uppercase mb-2">Focos de Controle de Qualidade</h5>
                <div className="space-y-1 text-[11px] text-slate-600">
                  <p>• Inspeção FVS-034 Drywall: Aprovado sem ressalvas.</p>
                  <p>• Inspeção FVS-029 Hidrossanitária: Retrabalho em andamento.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedFormat === 'MENSAL' && (
          <div className="mt-8 space-y-6 text-xs text-slate-800">
            {/* Financial consolidator stats */}
            <div>
              <h4 className="text-xs font-bold tracking-widest text-indigo-900 uppercase font-mono mb-3">CONSOLIDADO OPERACIONAL FINANCEIRO DA OBRA</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-slate-500 font-medium">Orçamento Previsto (baseline):</span>
                    <span className="font-mono font-bold">{formatCurrency(obra.value)}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-slate-500 font-medium font-bold">Orçamento Homologado Corrente:</span>
                    <span className="font-mono font-bold text-indigo-900">{formatCurrency(obra.value * 0.992)}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-slate-500 font-medium">Economia Lograda p/ Cliente:</span>
                    <span className="font-mono font-bold text-emerald-600">{formatCurrency(obra.value * 0.008)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-slate-500 font-medium">Fundo Recebido Cliente:</span>
                    <span className="font-mono font-bold">{formatCurrency((obra.value * 64) / 100)}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-slate-500 font-medium">Executado Real Consolidado:</span>
                    <span className="font-mono font-bold">{formatCurrency((obra.value * 62.4) / 100)}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-slate-500 font-medium">Percentual Executado Mês:</span>
                    <span className="font-mono font-bold text-indigo-900">4.2%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Accounts breakdown */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold tracking-widest text-slate-700 uppercase font-mono mb-2">Previsões de Desembolso Próxima Quinzena (CON_DIRETO)</h4>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-mono text-slate-650">
                  <span>- NF-3490 Esquadrias Caixilhos (Medição 16)</span>
                  <span className="font-bold">R$ 55.000</span>
                </div>
                <div className="flex justify-between text-[11px] font-mono text-slate-650">
                  <span>- Forno Refratário Varanda Leste</span>
                  <span className="font-bold">R$ 14.800</span>
                </div>
                <div className="flex justify-between text-[11px] font-mono text-slate-650">
                  <span>- Retorno e dreno piscineiro auxiliar (TA-01)</span>
                  <span className="font-bold">R$ 38.200</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Director opinion block in printable view */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <span className="text-[9px] font-mono text-slate-450 uppercase block font-bold">Considerações e Parecer Técnico da Engenharia</span>
          <p className="text-xs font-serif text-slate-700 leading-relaxed italic mt-2 pl-3 border-l-2 border-indigo-900">
            "{diretorNote}"
          </p>
        </div>

        {/* Footer info signable offline */}
        <div className="mt-12 flex justify-between items-end text-[10px] text-slate-400 font-mono">
          <div className="space-y-1">
            <p>GRUPO FREMASA CONSTRUÇÕES R.A. Ltda.</p>
            <p className="text-[8px]">Rua Amauri, 305 - Itaim Bibi - São Paulo - SP</p>
          </div>
          <div className="text-center">
            <div className="w-40 border-b border-slate-350 mx-auto mb-1"></div>
            <p>Assinatura Responsável Técnico</p>
          </div>
        </div>
      </div>
    </div>
  );
}
