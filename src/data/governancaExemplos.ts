import type { RDO, MapaConcorrencia, ControleCorpoProva, ChecklistEntrega } from '../types/governanca';

export const rdoExemplo: RDO = {
  id: 'RDO-2026-04-24',
  codigoObra: 'OR.R.217.22',
  data: '2026-04-24',
  cliente: 'Paulo Victor Mesquita Prado',
  local: 'Sao Giusto, no 238 - Jardim Luzitania',
  gerenciadora: 'FREMASA SERVICOS LTDA',
  clima: [
    { periodo: 'manha', condicao: 'sol' },
    { periodo: 'tarde', condicao: 'nublado' },
    { periodo: 'noite', condicao: 'sol' },
  ],
  efetivo: [
    { funcao: 'Encarregados', empresa: 'Joao', quantidade: 1 },
    { funcao: 'Pedreiros', empresa: 'Martins & Campos', quantidade: 4 },
    { funcao: 'Ajudantes', empresa: 'Martins & Campos', quantidade: 3 },
    { funcao: 'Eletricistas', empresa: 'Hidroeletric', quantidade: 2 },
    { funcao: 'Pintores', empresa: 'Familia Fernandes', quantidade: 3 },
  ],
  totalEfetivo: 13,
  atividades: [
    'Execucao de formas de pisadas laterais',
    'Instalacao de luminarias e loucas/metais',
    'Pintura de fachada - primeira demao',
    'Instalacao de equipamentos de piscina',
  ],
  observacaoFiscalizacao: 'Servicos conforme cronograma.',
  comentariosAdicionais: 'Previsao de start-up do gerador em 27/04.',
};

export const mapaConcorrenciaExemplo: MapaConcorrencia = {
  id: '202604-QC-001',
  codigoObra: 'OR.C.144.24',
  obra: 'Altavis 01 - Thiago e Natasha Stanger',
  endereco: 'Rua Carpatos, Residencial Altavis - Santana do Parnaiba/SP',
  responsavel: 'Eng. Hugo Fortunato',
  pacote: 'Estrutura metalica',
  status: 'em_cotacao',
  propostas: [
    {
      fornecedor: 'Fornecedor 01',
      itens: [
        { item: '1.0', quantidade: 1, unidade: 'vb', descricao: 'Fornecimento e montagem de estrutura metalica', precoUnitario: 0, precoTotal: 0 },
        { item: '2.0', quantidade: 1, unidade: 'vb', descricao: 'Icamento e logistica', precoUnitario: 0, precoTotal: 0 },
      ],
      totalPropostaInicial: 0,
    },
    {
      fornecedor: 'Fornecedor 02',
      itens: [
        { item: '1.0', quantidade: 1, unidade: 'vb', descricao: 'Fornecimento e montagem de estrutura metalica', precoUnitario: 0, precoTotal: 0 },
        { item: '2.0', quantidade: 1, unidade: 'vb', descricao: 'Icamento e logistica', precoUnitario: 0, precoTotal: 0 },
      ],
      totalPropostaInicial: 0,
    },
  ],
};

export const controleCPExemplo: ControleCorpoProva = {
  id: 'CP-2026-001',
  codigoObra: 'OR.C.144.24',
  empreendimento: 'Residencia Sitta',
  tipo: 'prisma_oco',
  dataMoldagem: '2026-03-15',
  numeroCP: '001',
  fpkProjeto: undefined,
  laboratorio: 'A definir',
};

const DOCS_PADRAO = (extras: string[] = []) =>
  ['Notas fiscais', 'Certificados de garantia', 'Manuais tecnicos / Catalogo', ...extras]
    .map((tipo) => ({ tipo, entregue: false }));

export const checklistEntregaExemplo: ChecklistEntrega = {
  id: 'ENTREGA-OR.C.144.24',
  codigoObra: 'OR.C.144.24',
  obra: 'Residencia Sitta',
  percentualCompleto: 0,
  sistemas: [
    { sistema: 'Sistema de Agua Quente', documentos: DOCS_PADRAO(['Manual tecnico de uso/operacao/manutencao', 'A.R.T das instalacoes']) },
    { sistema: 'Bombas Hidraulicas', subsistema: 'Recalque Agua Potavel', documentos: DOCS_PADRAO() },
    { sistema: 'Bombas Hidraulicas', subsistema: 'Aguas Pluviais / Retardo', documentos: DOCS_PADRAO() },
    { sistema: 'Bombas Hidraulicas', subsistema: 'Pressurizacao Cobertura', documentos: DOCS_PADRAO() },
    { sistema: 'Bombas Hidraulicas', subsistema: 'Esgoto', documentos: DOCS_PADRAO() },
    { sistema: 'Bombas Hidraulicas', subsistema: 'Agua Servida', documentos: DOCS_PADRAO() },
    { sistema: 'Bombas Hidraulicas', subsistema: 'Drenagem', documentos: DOCS_PADRAO() },
  ],
};
