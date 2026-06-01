import { 
  Obra, 
  Contrato, 
  PranchaProjeto, 
  OrcamentoItem, 
  CronogramaEtapa, 
  DiarioObra, 
  Medicao, 
  TransacaoFinanceira, 
  FichaVerificacaoServico, 
  QuadroConcorrencia 
} from '../types';
import { STATUS_OBRA } from '../types/statusObra';

export const OBRAS_SEED: Obra[] = [
  {
    id: 'sitta',
    code: 'OR.C.144.24',
    name: 'Residência Sitta',
    status: STATUS_OBRA.EM_EXECUCAO,
    client: 'Francisco Sitta',
    architect: 'Pedro Cornetta',
    address: 'Condomínio Quinta da Baroneza, Bragança Paulista - SP',
    value: 4850000,
    modality: 'Administração Controlada',
    proposalCode: 'OB.2024.12',
    startDate: '2024-06-15',
    endDate: '2026-10-30',
    percentageFisico: 68,
    percentageFinanceiro: 64,
    desvioOrcamento: -2.4, // Economia
    proximaMedicao: '2026-06-10',
    alertasQualidadeCount: 1
  },
  {
    id: 'paulo-mesquita',
    code: 'OR.R.217.22',
    name: 'Residência Paulo Mesquita Prado',
    status: STATUS_OBRA.EM_EXECUCAO,
    client: 'Paulo Mesquita Prado',
    architect: 'Escritório Fremasa (Interno)',
    address: 'Altos de São Fernando, Barueri - SP',
    value: 2350000,
    modality: 'Empreitada Global',
    proposalCode: 'DM.2023.05',
    startDate: '2024-01-10',
    endDate: '2026-08-15',
    percentageFisico: 82,
    percentageFinanceiro: 85,
    desvioOrcamento: 3.2, // Um pouco acima
    proximaMedicao: '2026-06-05',
    alertasQualidadeCount: 0
  },
  {
    id: 'ana-andre',
    code: 'OR.C.172.25',
    name: 'Residência Ana e André',
    status: STATUS_OBRA.PRE_OBRA,
    client: 'Ana & André Guimarães',
    architect: 'Sexto Sentido Arquitetura',
    address: 'Residencial Alphaville Zero, Barueri - SP',
    value: 3950000,
    modality: 'Administração de Taxa Fixa',
    proposalCode: 'RF.2025.18',
    startDate: '2026-07-01',
    endDate: '2028-02-15',
    percentageFisico: 0,
    percentageFinanceiro: 5, // Aporte sinal
    desvioOrcamento: 0,
    proximaMedicao: '2026-07-15',
    alertasQualidadeCount: 0
  },
  {
    id: 'bella-alves',
    code: 'OR.C.162.25',
    name: 'Residência Bella Alves',
    status: STATUS_OBRA.PARALISADA,
    client: 'Bella Alves',
    architect: 'Pedro Trigo (Piracaia)',
    address: 'Represa de Piracaia, Piracaia - SP',
    value: 3100000,
    modality: 'Administração',
    proposalCode: 'EM.2025.04',
    startDate: '2025-02-01',
    endDate: '2026-12-20',
    percentageFisico: 20,
    percentageFinanceiro: 20,
    desvioOrcamento: 1.5,
    proximaMedicao: '-',
    alertasQualidadeCount: 2
  }
];

export const CONTRATOS_SEED: Contrato[] = [
  {
    id: 'c-sitta',
    obraId: 'sitta',
    clienteNome: 'Francisco Sitta',
    documentoRef: 'CONTRATO_OB.144_2024_DE_EXEC_OBR',
    dataAssinatura: '2024-05-10',
    valorOriginal: 4600000,
    valorAditivos: 250000,
    modality: 'Administração Controlada (Taxa de Gestão 12%)',
    focosContratuais: [
      'Garantia de limite orçamentário por pacotes com QC obrigatório',
      'Fidelidade ao cronograma físico regulado com bônus de antecipação',
      'Padrão construtivo de alto nível baroneza (FVS assinado digitalmente)'
    ],
    escopoResumido: [
      'Execução completa de residência térrea de 780m² de área construída',
      'Fundações em estacas hélice contínua e blocos de coroamento',
      'Estrutura em Steel Frame e vigas de transição metálicas pesadas',
      'Fechamento em placas cimentícias e sistema de isolamento termoacústico',
      'Acabamentos sofisticados: mármores importados nos banhos e esquadrias termoacústicas minimalistas'
    ],
    aditivos: [
      {
        id: 'ad-sitta-01',
        numero: 'TA-01',
        data: '2025-02-14',
        descricao: 'Ampliação da Varanda Gourmet e alteração da piscina para transbordante de borda infinita',
        valor: 180000
      },
      {
        id: 'ad-sitta-02',
        numero: 'TA-02',
        data: '2025-11-05',
        descricao: 'Substituição das esquadrias da fachada leste para modelo minimalista importado com vidro acústico',
        valor: 70000
      }
    ],
    marcos: [
      { id: 'm-sitta-1', titulo: 'Mobilização & Serviços Iniciais', dataPrevista: '2024-06-20', status: 'CONCLUIDO' },
      { id: 'm-sitta-2', titulo: 'Conclusão Fundações & Baldrame', dataPrevista: '2024-10-15', status: 'CONCLUIDO' },
      { id: 'm-sitta-3', titulo: 'Montagem de Estrutura Metálica Central', dataPrevista: '2025-03-30', status: 'CONCLUIDO' },
      { id: 'm-sitta-4', titulo: 'Fechamento de Coberturas e Painéis', dataPrevista: '2025-09-15', status: 'CONCLUIDO' },
      { id: 'm-sitta-5', titulo: 'Instalações Hidrossanitárias/Elétricas Rinconadas', dataPrevista: '2026-02-28', status: 'CONCLUIDO' },
      { id: 'm-sitta-6', titulo: 'Revestimentos e Acabamento de Mármores', dataPrevista: '2026-07-20', status: 'PENDENTE' },
      { id: 'm-sitta-7', titulo: 'Entrega das Chaves / As-Built', dataPrevista: '2026-10-30', status: 'PENDENTE' }
    ]
  },
  {
    id: 'c-paulo',
    obraId: 'paulo-mesquita',
    clienteNome: 'Paulo Mesquita Prado',
    documentoRef: 'CONTRATO_DM.2023_PAULO_MP',
    dataAssinatura: '2023-11-15',
    valorOriginal: 2350000,
    valorAditivos: 0,
    modality: 'Empreitada Global',
    focosContratuais: [
      'Preço fechado e prazo improrrogável',
      'Seguro de obra integral'
    ],
    escopoResumido: [
      'Construção de sobrado de 390m² com estrutura mista concreto e blocos de gesso estrutural',
      'Fachada frontal com painéis de alumínio ripado amadeirado',
      'Aquecimento central solar com respaldo elétrico'
    ],
    aditivos: [],
    marcos: [
      { id: 'm-p-1', titulo: 'Fundação concluída', dataPrevista: '2024-03-01', status: 'CONCLUIDO' },
      { id: 'm-p-2', titulo: 'Estrutura de Concreto Armado', dataPrevista: '2024-11-20', status: 'CONCLUIDO' },
      { id: 'm-p-3', titulo: 'Instalações internas e reboco', dataPrevista: '2025-06-15', status: 'CONCLUIDO' },
      { id: 'm-p-4', titulo: 'Pintura e Iluminação', dataPrevista: '2026-05-30', status: 'PENDENTE' },
      { id: 'm-p-5', titulo: 'Vistoria final e Entrega', dataPrevista: '2026-08-15', status: 'PENDENTE' }
    ]
  },
  {
    id: 'c-ana',
    obraId: 'ana-andre',
    clienteNome: 'Ana & André Guimarães',
    documentoRef: 'CONTRATO_RF.2025.18_PR_OBRA',
    dataAssinatura: '2026-05-02',
    valorOriginal: 3950000,
    valorAditivos: 0,
    modality: 'Administração de Taxa Fixa (8% sobre contas homologadas)',
    focosContratuais: [
      'Garantia de QCs com mínima de 3 concorrentes por contrato',
      'Relatórios financeiros bissemanais estruturados'
    ],
    escopoResumido: [
      'Construção alto padrão em lote plano de 1000m²',
      'Ecoeficiente com captação de água pluvial e sistema de reuso cinza',
      'Esquadrias alemãs termo-acústicas integradas com tela mosqueteiro'
    ],
    aditivos: [],
    marcos: [
      { id: 'm-a-1', titulo: 'Aprovação de Projetos Prefeitura', dataPrevista: '2026-06-15', status: 'PENDENTE' },
      { id: 'm-a-2', titulo: 'Instalação de Tapumes e Canteiro', dataPrevista: '2026-07-05', status: 'PENDENTE' }
    ]
  },
  {
    id: 'c-bella',
    obraId: 'bella-alves',
    clienteNome: 'Bella Alves',
    documentoRef: 'CONTRATO_OB_162_BELLA_PIRACAIA',
    dataAssinatura: '2024-12-10',
    valorOriginal: 3100000,
    valorAditivos: 0,
    modality: 'Administração por Taxa Variável (10%)',
    focosContratuais: [
      'Exigência de compliance ambiental por limite da represa',
      'Fornecedores locais homologados em Piracaia'
    ],
    escopoResumido: [
      'Residência de lazer rústica-industrial de 420m²',
      'Pé direito duplo na sala central com tesouras metálicas aparentes',
      'Decks extensos debruçados sobre a represa'
    ],
    aditivos: [],
    marcos: [
      { id: 'm-b-1', titulo: 'Serviços de Terraplenagem e Licença', dataPrevista: '2025-02-28', status: 'CONCLUIDO' },
      { id: 'm-b-2', titulo: 'Fundações e Laje do Piso principal', dataPrevista: '2025-07-15', status: 'CONCLUIDO' },
      { id: 'm-b-3', titulo: 'Elevação de Pilares de Apoio Decks', dataPrevista: '2025-11-30', status: 'ATRASADO' }
    ]
  }
];

export const PROJETOS_SEED: PranchaProjeto[] = [
  {
    id: 'p-sitta-01',
    obraId: 'sitta',
    disciplina: 'Arquitetura',
    codigo: 'ARQ-PLA-01',
    titulo: 'Planta Layout Geral e Setorização',
    revisaoAtual: 'R04',
    dataRevisao: '2025-04-12',
    responsavel: 'Pedro Cornetta (Arquiteto)',
    statusAnalise: 'APROVADO',
    linkUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800',
    historicoRevisoes: [
      { revisao: 'R00', data: '2024-05-15', descricao: 'Emissão Inicial para Coordenação' },
      { revisao: 'R01', data: '2024-07-02', descricao: 'Ajuste de cota no pátio interno' },
      { revisao: 'R02', data: '2024-10-18', descricao: 'Ampliação do closet master' },
      { revisao: 'R03', data: '2025-02-14', descricao: 'Adequação da varanda gourmet para transbordo piscina' },
      { revisao: 'R04', data: '2025-04-12', descricao: 'Liberação para obra - Revisão das cotas de acabamento' }
    ]
  },
  {
    id: 'p-sitta-02',
    obraId: 'sitta',
    disciplina: 'Fundações',
    codigo: 'FUND-GEO-02',
    titulo: 'Planta de Locação de Estacas e Cargas',
    revisaoAtual: 'R01',
    dataRevisao: '2024-06-02',
    responsavel: 'Ingegneria Associados (Humberto Silva)',
    statusAnalise: 'APROVADO',
    historicoRevisoes: [
      { revisao: 'R00', data: '2024-05-20', descricao: 'Emissão Inicial' },
      { revisao: 'R01', data: '2024-06-02', descricao: 'Correção de cargas na viga V-103' }
    ]
  },
  {
    id: 'p-sitta-03',
    obraId: 'sitta',
    disciplina: 'Estrutura Metálica',
    codigo: 'EST-MET-01',
    titulo: 'Detalhamento do Pórtico Metálico de Entrada',
    revisaoAtual: 'R02',
    dataRevisao: '2024-11-20',
    responsavel: 'Nova Engemetal',
    statusAnalise: 'APROVADO',
    linkUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=800',
    historicoRevisoes: [
      { revisao: 'R00', data: '2024-09-10', descricao: 'Envio Técnico Metálica Sitta' },
      { revisao: 'R01', data: '2024-10-05', descricao: 'Compatibilização tubulações pluviais embutidas nos pilares' },
      { revisao: 'R02', data: '2024-11-20', descricao: 'Espessamento das chapas de ligação do pilar P-22' }
    ]
  },
  {
    id: 'p-sitta-04',
    obraId: 'sitta',
    disciplina: 'Instalações',
    codigo: 'INST-HID-03',
    titulo: 'Esquema Isométrico Redes de Água Quente e Boiler',
    revisaoAtual: 'R02',
    dataRevisao: '2025-08-30',
    responsavel: 'Projeta Elétrica e Hidráulica',
    statusAnalise: 'APROVADO_COM_RESSALVAS',
    historicoRevisoes: [
      { revisao: 'R00', data: '2025-06-11', descricao: 'Análise Preliminar' },
      { revisao: 'R01', data: '2025-07-22', descricao: 'Integração com bomba de recirculação bronze' },
      { revisao: 'R02', data: '2025-08-30', descricao: 'Alteração do diâmetro do coletor principal de 1\" para 1.1/2\"' }
    ]
  },
  {
    id: 'p-sitta-05',
    obraId: 'sitta',
    disciplina: 'Interiores',
    codigo: 'INT-MAO-01',
    titulo: 'Esquema de Paginação de Mármores de Lareira e Banho Master',
    revisaoAtual: 'R00',
    dataRevisao: '2026-03-05',
    responsavel: 'Pedro Cornetta (Arquiteto)',
    statusAnalise: 'EM_REVISAO',
    historicoRevisoes: [
      { revisao: 'R00', data: '2026-03-05', descricao: 'Distribuição preliminar com blocos selecionados no galpão' }
    ]
  },
  {
    id: 'p-paulo-01',
    obraId: 'paulo-mesquita',
    disciplina: 'Arquitetura',
    codigo: 'ARQ-FACH-04',
    titulo: 'Desenho de Fachada e Detalhes de Alumínio Ripado',
    revisaoAtual: 'R03',
    dataRevisao: '2025-03-10',
    responsavel: 'Fremasa Projetos',
    statusAnalise: 'APROVADO',
    historicoRevisoes: [
      { revisao: 'R00', data: '2024-01-15', descricao: 'Versão de Aprovação de Loteamento' },
      { revisao: 'R03', data: '2025-03-10', descricao: 'Modificação de espaçamento ripamento p/ menor visibilidade' }
    ]
  }
];

export const ORCAMENTOS_SEED: OrcamentoItem[] = [
  // Residência Sitta Budget Real
  { id: 'or-s-01', obraId: 'sitta', item: '1.0', descricao: 'Serviços Iniciais, Topografia e Sondagem', unidade: 'vb', quantidade: 1, precoUnitario: 45000, totalBaseline: 45000, totalCorrente: 45000, executadoAcumulado: 45000, categoria: 'INFRAESTRUTURA' },
  { id: 'or-s-02', obraId: 'sitta', item: '2.0', descricao: 'Fundações em Estaca Hélice Contínua e Vigas Baldrame', unidade: 'm³', quantidade: 145, precoUnitario: 1850, totalBaseline: 268250, totalCorrente: 268250, executadoAcumulado: 268250, categoria: 'INFRAESTRUTURA' },
  { id: 'or-s-03', obraId: 'sitta', item: '3.1', descricao: 'Estruturas Metálicas de Supino e Pilares Centrais', unidade: 'ton', quantidade: 38, precoUnitario: 14200, totalBaseline: 539600, totalCorrente: 539600, executadoAcumulado: 539600, categoria: 'ESTRUTURA_METALICA' },
  { id: 'or-s-04', obraId: 'sitta', item: '3.2', descricao: 'Perfis de Steel Frame e Conectores de Tração', unidade: 'vb', quantidade: 1, precoUnitario: 680000, totalBaseline: 680000, totalCorrente: 680000, executadoAcumulado: 680000, categoria: 'ESTRUTURA_METALICA' },
  { id: 'or-s-05', obraId: 'sitta', item: '4.0', descricao: 'Fechamentos Termoacústicos e Placas Cimentícias', unidade: 'm²', quantidade: 1250, precoUnitario: 290, totalBaseline: 362500, totalCorrente: 362500, executadoAcumulado: 330000, categoria: 'ALVENARIA_DEMAIS' },
  { id: 'or-s-06', obraId: 'sitta', item: '5.0', descricao: 'Instalações Hidráulicas, Elétricas e Infra Ar-Condicionado', unidade: 'vb', quantidade: 1, precoUnitario: 480000, totalBaseline: 480000, totalCorrente: 510000, executadoAcumulado: 460000, categoria: 'INSTALACOES' }, // Desvio (+30k executado)
  { id: 'or-s-07', obraId: 'sitta', item: '6.1', descricao: 'Revestimentos de Mármore e Quartzito Selecionado', unidade: 'm²', quantidade: 430, precoUnitario: 1100, totalBaseline: 473000, totalCorrente: 440000, executadoAcumulado: 120000, categoria: 'REVESTIMENTOS' }, // Economia (-33k negociado)
  { id: 'or-s-08', obraId: 'sitta', item: '6.2', descricao: 'Pisos de Madeira Maciça Multiestruturada', unidade: 'm²', quantidade: 320, precoUnitario: 450, totalBaseline: 144000, totalCorrente: 144000, executadoAcumulado: 0, categoria: 'REVESTIMENTOS' },
  { id: 'or-s-09', obraId: 'sitta', item: '7.0', descricao: 'Esquadrias de Alumínio Minimalista e Vidros Térmicos', unidade: 'vb', quantidade: 1, precoUnitario: 890000, totalBaseline: 820000, totalCorrente: 890000, executadoAcumulado: 580000, categoria: 'ACABAMENTOS' }, // TA-02 incluído
  { id: 'or-s-10', obraId: 'sitta', item: '8.0', descricao: 'Acabamentos Especiais, Pintura e Limpeza Final', unidade: 'vb', quantidade: 1, precoUnitario: 350000, totalBaseline: 350000, totalCorrente: 350000, executadoAcumulado: 10000, categoria: 'PINTURA' },
  { id: 'or-s-11', obraId: 'sitta', item: '9.0', descricao: 'Equipamentos, Bombas, Automação Residencial e Lareira', unidade: 'vb', quantidade: 1, precoUnitario: 290000, totalBaseline: 290000, totalCorrente: 310000, executadoAcumulado: 0, categoria: 'GERAL' },

  // Residência Paulo Mesquita Prado Budget Simple
  { id: 'or-p-01', obraId: 'paulo-mesquita', item: '1.0', descricao: 'Terraplenagem e Canteiro', unidade: 'vb', quantidade: 1, precoUnitario: 38000, totalBaseline: 38000, totalCorrente: 38000, executadoAcumulado: 38000, categoria: 'INFRAESTRUTURA' },
  { id: 'or-p-02', obraId: 'paulo-mesquita', item: '2.0', descricao: 'Fundação por Sapatas e Blocos', unidade: 'm³', quantidade: 80, precoUnitario: 1400, totalBaseline: 112000, totalCorrente: 112000, executadoAcumulado: 112000, categoria: 'INFRAESTRUTURA' },
  { id: 'or-p-03', obraId: 'paulo-mesquita', item: '3.0', descricao: 'Superestrutura Concreto e Lajes Alveolares', unidade: 'vb', quantidade: 1, precoUnitario: 650000, totalBaseline: 650000, totalCorrente: 686000, executadoAcumulado: 686000, categoria: 'GERAL' },
  { id: 'or-p-04', obraId: 'paulo-mesquita', item: '4.0', descricao: 'Alvenaria de vedação e Chapisco/Reboco', unidade: 'm²', quantidade: 1800, precoUnitario: 165, totalBaseline: 297000, totalCorrente: 297000, executadoAcumulado: 297000, categoria: 'ALVENARIA_DEMAIS' },
  { id: 'or-p-05', obraId: 'paulo-mesquita', item: '5.0', descricao: 'Instalações Clínicas Prediais', unidade: 'vb', quantidade: 1, precoUnitario: 320000, totalBaseline: 320000, totalCorrente: 335000, executadoAcumulado: 335000, categoria: 'INSTALACOES' }
];

export const CRONOGRAMAS_SEED: CronogramaEtapa[] = [
  // Sitta Schedule
  { id: 'cro-s-1', obraId: 'sitta', etapaName: 'Estruturação Iniciar & Canteiro', startDate: '2024-06-15', endDate: '2024-08-10', progressFisicoPlanejado: 100, progressFisicoReal: 100, desembolsoPrevisto: 90000, desembolsoReal: 90000, status: 'CONCLUIDO' },
  { id: 'cro-s-2', obraId: 'sitta', etapaName: 'Fundações & Tubulações Iniciais', startDate: '2024-08-11', endDate: '2024-11-20', progressFisicoPlanejado: 100, progressFisicoReal: 100, desembolsoPrevisto: 300000, desembolsoReal: 300000, status: 'CONCLUIDO' },
  { id: 'cro-s-3', obraId: 'sitta', etapaName: 'Estrutura Metálica Pesada de Transição', startDate: '2024-11-21', endDate: '2025-04-15', progressFisicoPlanejado: 100, progressFisicoReal: 100, desembolsoPrevisto: 650000, desembolsoReal: 638000, status: 'CONCLUIDO' },
  { id: 'cro-s-4', obraId: 'sitta', etapaName: 'Framing de Parede e Lajes (Steel)', startDate: '2025-04-16', endDate: '2025-09-30', progressFisicoPlanejado: 100, progressFisicoReal: 100, desembolsoPrevisto: 820000, desembolsoReal: 820000, status: 'CONCLUIDO' },
  { id: 'cro-s-5', obraId: 'sitta', etapaName: 'Instalações, Dutos e Fiação Rinconada', startDate: '2025-10-01', endDate: '2026-03-15', progressFisicoPlanejado: 100, progressFisicoReal: 95, desembolsoPrevisto: 510000, desembolsoReal: 495000, status: 'CONCLUIDO' },
  { id: 'cro-s-6', obraId: 'sitta', etapaName: 'Fechamento Cimentício, Argamassa e Waterproofing', startDate: '2026-03-16', endDate: '2026-06-30', progressFisicoPlanejado: 85, progressFisicoReal: 80, desembolsoPrevisto: 420000, desembolsoReal: 390000, status: 'EM_ANDAMENTO' },
  { id: 'cro-s-7', obraId: 'sitta', etapaName: 'Vidros de Esquadrias, Caixilhos e Paginação', startDate: '2026-07-01', endDate: '2026-08-25', progressFisicoPlanejado: 0, progressFisicoReal: 0, desembolsoPrevisto: 950000, desembolsoReal: 0, status: 'NAO_INICIADO' },
  { id: 'cro-s-8', obraId: 'sitta', etapaName: 'Revestimentos Nobres, Louças e Pinturas', startDate: '2026-08-26', endDate: '2026-10-15', progressFisicoPlanejado: 0, progressFisicoReal: 0, desembolsoPrevisto: 840000, desembolsoReal: 0, status: 'NAO_INICIADO' },
  { id: 'cro-s-9', obraId: 'sitta', etapaName: 'Limpeza, Comissionamento e Chaves', startDate: '2026-10-16', endDate: '2026-10-30', progressFisicoPlanejado: 0, progressFisicoReal: 0, desembolsoPrevisto: 270000, desembolsoReal: 0, status: 'NAO_INICIADO' },

  // Paulo Mesquita Schedule
  { id: 'cro-p-1', obraId: 'paulo-mesquita', etapaName: 'Limpeza e Blocos de Fundação', startDate: '2024-01-10', endDate: '2024-04-10', progressFisicoPlanejado: 100, progressFisicoReal: 100, desembolsoPrevisto: 150000, desembolsoReal: 150000, status: 'CONCLUIDO' },
  { id: 'cro-p-2', obraId: 'paulo-mesquita', etapaName: 'Superestrutura Concreto Armado', startDate: '2024-04-11', endDate: '2024-11-15', progressFisicoPlanejado: 100, progressFisicoReal: 100, desembolsoPrevisto: 650000, desembolsoReal: 686000, status: 'CONCLUIDO' },
  { id: 'cro-p-3', obraId: 'paulo-mesquita', etapaName: 'Alvenarias e Linha de Instalação Interna', startDate: '2024-11-16', endDate: '2025-06-30', progressFisicoPlanejado: 100, progressFisicoReal: 100, desembolsoPrevisto: 520000, desembolsoReal: 535000, status: 'CONCLUIDO' },
  { id: 'cro-p-4', obraId: 'paulo-mesquita', etapaName: 'Paginação Gesso, Revestimentos e Porcelanatos', startDate: '2025-07-01', endDate: '2026-04-15', progressFisicoPlanejado: 100, progressFisicoReal: 96, desembolsoPrevisto: 680000, desembolsoReal: 660000, status: 'CONCLUIDO' },
  { id: 'cro-p-5', obraId: 'paulo-mesquita', etapaName: 'Iluminação, Metais, Louças e Entrega', startDate: '2026-04-16', endDate: '2026-08-15', progressFisicoPlanejado: 50, progressFisicoReal: 38, desembolsoPrevisto: 350000, desembolsoReal: 120000, status: 'EM_ANDAMENTO' }
];

export const DIARIOS_SEED: DiarioObra[] = [
  {
    id: 'rd-sitta-1',
    obraId: 'sitta',
    date: '2026-05-29',
    codigoRelatorio: '2026-05-29 — Diário OR.C.144.24',
    climaManha: 'SOL',
    climaTarde: 'NUBLADO',
    temperatura: '16°C - 23°C',
    efetivoFremasa: 3, // Engenheiro de Campo + Mestre + Estagiário
    efetivoSubempreitados: 18, // 8 gesseiros + 6 hidráulicos + 4 serventes
    atividades: [
      { id: 'at-s-1', descricao: 'Instalação de placas de Drywall acústico no teto dos quartos e closet principal (Setor Leste)', setor: 'Pavimento Superior' },
      { id: 'at-s-2', descricao: 'Distribuição e crimpagem dos dutos multicamadas de água quente sanitária nos shafts do banheiro master', setor: 'Pavimento Superior' },
      { id: 'at-s-3', descricao: 'Passagem dos conduítes de iluminação cênica na sala com pé direito duplo', setor: 'Área Social' },
      { id: 'at-s-4', descricao: 'Aplicação de primer elastomérico de impermeabilização nas floreiras externas da varanda', setor: 'Varanda Externa' }
    ],
    ocorrencias: [
      'Visita do Arquiteto Pedro Cornetta às 14:00 para alinhamento da paginação e locação dos interruptores especiais latonados.',
      'Atraso na entrega dos sacos de argamassa de alta aderência da Portokoll por falha logística do fornecedor Baroneza Material. Reprogramado para amanhã cedo, sem impacto direto na frente de trabalho atual.'
    ],
    fotos: [
      { id: 'ft-s-1', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800', legenda: 'Visualização da montagem do Drywall acústico na suíte máster', data: '2026-05-29' },
      { id: 'ft-s-2', url: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?q=80&w=800', legenda: 'Ajuste de prumo no duto multicamadas do Banheiro Casal', data: '2026-05-29' }
    ],
    aprovadoPor: 'Rafael Icimoto (Gestor da Obra)',
    dataAprovacao: '2026-05-29'
  },
  {
    id: 'rd-sitta-2',
    obraId: 'sitta',
    date: '2026-05-28',
    codigoRelatorio: '2026-05-28 — Diário OR.C.144.24',
    climaManha: 'NUBLADO',
    climaTarde: 'CHUVA',
    temperatura: '15°C - 21°C',
    efetivoFremasa: 3,
    efetivoSubempreitados: 12,
    atividades: [
      { id: 'at-s-10', descricao: 'Montagem de perfis metálicos estruturais auxiliares (canaletas e montantes) do Drywall das divisórias', setor: 'Pavimento Superior' },
      { id: 'at-s-11', descricao: 'Escavação manual e dreno pluvial secundário periférico do deck norte', setor: 'Área Externa' }
    ],
    ocorrencias: [
      'Chuva intempestiva na parte da tarde paralisou os serviços da escavação e drenagem externas. Mão de obra redirecionada para a passagem de cabeamento lógico interno.',
      'Recebimento técnico positivo do lote de tubos e conexões Amanco enviado pela matriz Fremasa.'
    ],
    fotos: [
      { id: 'ft-s-3', url: 'https://images.unsplash.com/photo-1581094288338-2314dddb7eed?q=80&w=800', legenda: 'Perfil estrutural interno e drywall de divisória montado', data: '2026-05-28' }
    ],
    aprovadoPor: 'Rafael Icimoto (Gestor da Obra)',
    dataAprovacao: '2026-05-28'
  },
  {
    id: 'rd-paulo-1',
    obraId: 'paulo-mesquita',
    date: '2026-05-29',
    codigoRelatorio: '2026-05-29 — Diário OR.R.217.22',
    climaManha: 'SOL',
    climaTarde: 'SOL',
    temperatura: '19°C - 27°C',
    efetivoFremasa: 2,
    efetivoSubempreitados: 6,
    atividades: [
      { id: 'at-p-1', descricao: 'Aplicação de primeira demão de pintura látex acetinado nas paredes das suítes de hóspedes.', setor: 'Pavimento Social' },
      { id: 'at-p-2', descricao: 'Vaporização e instalação dos pontos de iluminação LED do lounge gourmet.', setor: 'Varanda e Piscina' }
    ],
    ocorrencias: [
      'Contatada concessionária de energia para solicitar agendamento da homologação e ligação final do padrão de entrada de força.'
    ],
    fotos: [],
    aprovadoPor: 'Leandro Frehse (Diretor)',
    dataAprovacao: '2026-05-29'
  }
];

export const MEDICOES_SEED: Medicao[] = [
  {
    id: 'med-sitta-01',
    obraId: 'sitta',
    numero: 14,
    periodoInicio: '2026-04-01',
    periodoFim: '2026-04-30',
    dataEmissao: '2026-05-02',
    codigoMedicao: 'Medição 14 — 2026-05-02 — OR.C.144.24',
    fornecedorNome: 'Gesso Baroneza LTDA',
    servicoMedido: 'Rebaixamento de Teto Drywall Acústico (70% do pav. inferior)',
    valorMedido: 45000,
    valorAprovado: 45000,
    status: 'PAGO',
    retencaoGarantia: 2250
  },
  {
    id: 'med-sitta-02',
    obraId: 'sitta',
    numero: 15,
    periodoInicio: '2026-05-01',
    periodoFim: '2026-05-28',
    dataEmissao: '2026-05-29',
    codigoMedicao: 'Medição 15 — 2026-05-29 — OR.C.144.24',
    fornecedorNome: 'Ingegneria Hidrossanitária',
    servicoMedido: 'Passagem das prumadas e assentamento de joelhos térmicos',
    valorMedido: 38200,
    valorAprovado: 36000,
    status: 'APROVADO_PARCIAL', // Desconto de 2.200 por trecho não concluído na varanda
    retencaoGarantia: 1800
  },
  {
    id: 'med-sitta-03',
    obraId: 'sitta',
    numero: 16,
    periodoInicio: '2026-05-01',
    periodoFim: '2026-05-28',
    dataEmissao: '2026-05-29',
    codigoMedicao: 'Medição 16 — 2026-05-29 — OR.C.144.24',
    fornecedorNome: 'Nova Engemetal',
    servicoMedido: 'Complementos de Reforços nos Pilares de Escada Externa',
    valorMedido: 12500,
    valorAprovado: 12500,
    status: 'EM_ANALISE',
    retencaoGarantia: 625
  },
  {
    id: 'med-paulo-01',
    obraId: 'paulo-mesquita',
    numero: 22,
    periodoInicio: '2026-04-15',
    periodoFim: '2026-05-15',
    dataEmissao: '2026-05-18',
    codigoMedicao: 'Medição 22 — 2026-05-18 — OR.R.217.22',
    fornecedorNome: 'Montador Rápido Ripados',
    servicoMedido: 'Fixação de réguas longitudinais da fachada norte',
    valorMedido: 29000,
    valorAprovado: 29000,
    status: 'PAGO',
    retencaoGarantia: 1450
  }
];

export const TRANSCOES_SEED: TransacaoFinanceira[] = [
  // Sitta Transacional
  { id: 'f-s-1', obraId: 'sitta', descricao: 'Aporte de Fundo de Obra Conforme Cláusula 4.1', tipo: 'RECEITA', categoriaContas: 'CLIENTE_APORTE', valor: 350000, dataVencimento: '2026-05-05', dataPagamento: '2026-05-04', status: 'RECEBIDO' },
  { id: 'f-s-2', obraId: 'sitta', descricao: 'NF-3490 Gesso Baroneza (Medição 14)', tipo: 'DESPESA', categoriaContas: 'CON_DIRETO', valor: 42750, dataVencimento: '2026-05-25', dataPagamento: '2026-05-25', status: 'PAGO', fornecedorNome: 'Gesso Baroneza LTDA' },
  { id: 'f-s-3', obraId: 'sitta', descricao: 'Ingegneria Hidrossanitária (Boletim 15 regulado)', tipo: 'DESPESA', categoriaContas: 'CON_DIRETO', valor: 34200, dataVencimento: '2026-06-15', status: 'A_PAGAR', fornecedorNome: 'Ingegneria Hidrossanitária' },
  { id: 'f-s-4', obraId: 'sitta', descricao: 'Locação mensal de Gerador e Andaimes (Mês Maio)', tipo: 'DESPESA', categoriaContas: 'MAQUINARIO', valor: 14800, dataVencimento: '2026-05-30', dataPagamento: '2026-05-29', status: 'PAGO', fornecedorNome: 'RentTools Baroneza' },
  { id: 'f-s-5', obraId: 'sitta', descricao: 'Taxa de Gestão Fremasa Mês Maio (Sobre medido)', tipo: 'DESPESA', categoriaContas: 'IMPOSTOS', valor: 28400, dataVencimento: '2026-06-05', status: 'A_PAGAR', fornecedorNome: 'Grupo Fremasa' },
  { id: 'f-s-6', obraId: 'sitta', descricao: 'Reembolso Pequenas Despesas - Canteiro Silício e Pregos', tipo: 'DESPESA', categoriaContas: 'PEQUENAS_DESPESAS', valor: 3450, dataVencimento: '2026-05-28', dataPagamento: '2026-05-28', status: 'PAGO', fornecedorNome: 'Mestre da Obra (Fundo)' },

  // Paulo Mesquita
  { id: 'f-p-1', obraId: 'paulo-mesquita', descricao: 'Parcela Fixa Empreitada Construtiva Mai/26', tipo: 'RECEITA', categoriaContas: 'CLIENTE_APORTE', valor: 180000, dataVencimento: '2026-05-10', dataPagamento: '2026-05-10', status: 'RECEBIDO' },
  { id: 'f-p-2', obraId: 'paulo-mesquita', descricao: 'Pintores Associados Barueri (Medição demão)', tipo: 'DESPESA', categoriaContas: 'CON_DIRETO', valor: 32000, dataVencimento: '2026-06-05', status: 'A_PAGAR', fornecedorNome: 'Pintores Associados Barueri' }
];

export const FVS_SEED: FichaVerificacaoServico[] = [
  {
    id: 'fvs-s-1',
    obraId: 'sitta',
    servicoName: 'FVS-034 - Execução de Drywall Acústico Interno',
    setorObra: 'S-01 Suite Máster + Corredores Social',
    responsavelNome: 'Felipe Rosa (Eng. Residente)',
    dataVerificacao: '2026-05-28',
    status: 'CONFORME',
    itensVerificados: [
      { descricao: 'Alinhamento longitudinal e prumo da estrutura de guias metálicas', conforme: true },
      { descricao: 'Amarração das placas de gesso cartonado com espaçamento regulado (parafusos a cada 20cm)', conforme: true },
      { descricao: 'Presença e assentamento integral da manta acústica de Lã de Vidro (pesagem 14kg/m³)', conforme: true },
      { descricao: 'Tratamento de juntas com fita telada e aplicação de massa especial p/ drywall', conforme: true }
    ]
  },
  {
    id: 'fvs-s-2',
    obraId: 'sitta',
    servicoName: 'FVS-029 - Rede Isométrica de Distribuição Sanitária',
    setorObra: 'Pavimento Inferior - Prumadas do Lavabo Social',
    responsavelNome: 'Felipe Rosa (Eng. Residente)',
    dataVerificacao: '2026-05-25',
    status: 'NAO_CONFORME',
    itensVerificados: [
      { descricao: 'Caimento gravitacional mínimo de 1.5% nas saídas sanitárias de 100mm', conforme: false, observacao: 'Trecho do vaso sanitário social apresentou menos de 0.8% de declividade.' },
      { descricao: 'Estanqueidade e hermeticidade contra refluxos de odor', conforme: true },
      { descricao: 'Alinhamento com grelha de ralo Click oculta', conforme: true }
    ],
    rncVinculada: {
      id: 'rnc-s-001',
      origem: 'FVS-029',
      tratativa: 'Desmontagem física do cotovelo do vaso social, rebaixamento sutil da saída e reconstrução do caimento com travamento de abraçadeira metálica de fixação no bloco.',
      status: 'EM_TRATATIVA'
    }
  },
  {
    id: 'fvs-p-1',
    obraId: 'paulo-mesquita',
    servicoName: 'FVS-081 - Demão Preparatória de Pintura Acetinada',
    setorObra: 'Suíte Hóspedes',
    responsavelNome: 'André Castro (Eng. Campo)',
    dataVerificacao: '2026-05-20',
    status: 'RESOLVIDA' as any, // fallback UI compatible
    itensVerificados: [
      { descricao: 'Lixamento total e aplicação de selador', conforme: true },
      { descricao: 'Remoção de ondulações sob projeção de spot de luz focado', conforme: true }
    ]
  }
];

export const QC_SEED: QuadroConcorrencia[] = [
  {
    id: '202605-QC-002',
    obraId: 'sitta',
    pacoteNome: 'Estrutura Metálica de Arremates e Escada Flutuante',
    status: 'FECHADO',
    dataCriacao: '2026-05-02',
    dataFechamento: '2026-05-18',
    revisao: 1,
    itensRequisitados: [
      { id: 'it-1', descricao: 'Pórtico Auxiliar Leste em Cobre Envelhecido p/ Escoramento de Vidro', quantidade: 1, unidade: 'vb' },
      { id: 'it-2', descricao: 'Viga em Perfil I "I-Beam" de 12 pol para reforço vão teto sala', quantidade: 2.8, unidade: 'ton' },
      { id: 'it-3', descricao: 'Degraus em Chapa Quadriculada de Aço dobrada c/ suporte embutido', quantidade: 18, unidade: 'pç' }
    ],
    concorrentes: [
      {
        fornecedorId: 'prov-01',
        fornecedorNome: 'Nova Engemetal',
        cotacaoTotal: 125000,
        condicaoPagamento: '30% entrada + 50% após montagem + 20% As-Built homologado',
        vencedor: true,
        observacoes: 'Homologado historicamente. Fornece cálculo estrutural e projeto de montagem detalhado. Garantia de 5 anos.',
        itensCotados: [
          { itemId: 'it-1', precoUnitario: 45000, prazoEntregaDias: 25, nota: 'Peça calandrada de precisão' },
          { itemId: 'it-2', precoUnitario: 22000, prazoEntregaDias: 20 },
          { itemId: 'it-3', precoUnitario: 1022, prazoEntregaDias: 15 }
        ]
      },
      {
        fornecedorId: 'prov-02',
        fornecedorNome: 'Serralheria Barão do Vale',
        cotacaoTotal: 118000,
        condicaoPagamento: '50% entrada à vista + 50% contra entrega parcial',
        vencedor: false,
        observacoes: 'Preço ligeiramente menor, mas exige pagamento antecipado e não envia equipe completa de içamento complexo exigido no Quinta da Baroneza.',
        itensCotados: [
          { itemId: 'it-1', precoUnitario: 41000, prazoEntregaDias: 30, nota: 'Liga nacional pintada' },
          { itemId: 'it-2', precoUnitario: 21000, prazoEntregaDias: 30 },
          { itemId: 'it-3', precoUnitario: 1040, prazoEntregaDias: 20 }
        ]
      }
    ]
  },
  {
    id: '202605-QC-006',
    obraId: 'sitta',
    pacoteNome: 'Estaca Hélice Contínua e Injeção Ativa',
    status: 'FECHADO',
    dataCriacao: '2024-05-15',
    dataFechamento: '2024-06-03',
    revisao: 0,
    itensRequisitados: [
      { id: 'it-10', descricao: 'Mobilização de perfuratriz hidráulica rotativa de torque alto', quantidade: 1, unidade: 'vb' },
      { id: 'it-11', descricao: 'Perfuração hélice de diâmetro 400mm com concreto fck=30Mpa', quantidade: 380, unidade: 'm' }
    ],
    concorrentes: [
      {
        fornecedorId: 'prov-03',
        fornecedorNome: 'Fundatech do Brasil',
        cotacaoTotal: 185000,
        condicaoPagamento: 'Fat-30 ddl após boletim de escavação homologada',
        vencedor: true,
        observacoes: 'Ganhador por equipe local disponível de imediato, garantindo o início oficial do cronograma em data estrita.',
        itensCotados: [
          { itemId: 'it-10', precoUnitario: 25000, prazoEntregaDias: 5 },
          { itemId: 'it-11', precoUnitario: 421, prazoEntregaDias: 10 }
        ]
      },
      {
        fornecedorId: 'prov-04',
        fornecedorNome: 'PerfuraMais Terrenos',
        cotacaoTotal: 198000,
        condicaoPagamento: 'Entrada Facilitada',
        vencedor: false,
        observacoes: 'Frete de deslocamento de máquina de Campinas encareceu a proposta em 22 mil reais.',
        itensCotados: [
          { itemId: 'it-10', precoUnitario: 38000, prazoEntregaDias: 7 },
          { itemId: 'it-11', precoUnitario: 421, prazoEntregaDias: 10 }
        ]
      }
    ]
  },
  {
    id: '202606-QC-012',
    obraId: 'sitta',
    pacoteNome: 'Fornecimento e Plantio Paisagismo Árvores Adultas',
    status: 'EM_COTACAO',
    dataCriacao: '2026-05-25',
    revisao: 0,
    itensRequisitados: [
      { id: 'it-20', descricao: 'Palmeira Imperial adulta com tronco de 4 metros', quantidade: 4, unidade: 'un' },
      { id: 'it-21', descricao: 'Forração grama Esmeralda premium (lote limpo)', quantidade: 800, unidade: 'm²' }
    ],
    concorrentes: [
      {
        fornecedorId: 'prov-10',
        fornecedorNome: 'Flora Campo Real',
        cotacaoTotal: 34000,
        condicaoPagamento: '30 dias',
        vencedor: false,
        observacoes: 'Cotação recebida dia 26/05.',
        itensCotados: [
          { itemId: 'it-20', precoUnitario: 6500, prazoEntregaDias: 10 },
          { itemId: 'it-21', precoUnitario: 10, prazoEntregaDias: 5 }
        ]
      }
    ]
  }
];

export const GALERIA_SEED = [
  { id: 'g-1', obraId: 'sitta', url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800', categoria: 'Projetos', data: '2025-04-12', legenda: 'Acompanhamento de alinhamento estrutural central - Sitta' },
  { id: 'g-2', obraId: 'sitta', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800', categoria: 'Alvenaria / Framing', data: '2026-05-29', legenda: 'Instalação de gesso acartonado suíte master' },
  { id: 'g-3', obraId: 'sitta', url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800', categoria: 'Instalações', data: '2025-11-10', legenda: 'Vão hidráulico principal montado' },
  { id: 'g-4', obraId: 'sitta', url: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?q=80&w=800', categoria: 'Fundação', data: '2024-09-12', legenda: 'Injeção de bloco baldramico de carga' },
  { id: 'g-5', obraId: 'paulo-mesquita', url: 'https://images.unsplash.com/photo-1581094288338-2314dddb7eed?q=80&w=800', categoria: 'Pintura', data: '2026-05-29', legenda: 'Suíte Hóspedes - Primeira demão latex acetinado' }
];

export const INTEGRACAO_CATALOGO_SEED = {
  fornecedores: [
    { id: 'fc-1', nome: 'Gesso Baroneza LTDA', contato: 'Mário Baroneza (11) 98223-1122', servico: 'Gesso e drywall' },
    { id: 'fc-2', nome: 'Ingegneria Hidrossanitária', contato: 'Eng. Rodolfo (11) 97112-4400', servico: 'Sistemas prediais' },
    { id: 'fc-3', nome: 'Nova Engemetal', contato: 'Renato Silva (11) 96422-9988', servico: 'Estruturas Metálicas Sob Medida' },
    { id: 'fc-4', nome: 'Fundatech do Brasil', contato: 'Dr. Humberto (11) 3322-1144', servico: 'Fundações profundas' },
    { id: 'fc-5', nome: 'Flora Campo Real', contato: 'Rita (11) 97411-2299', servico: 'Paisagismo e recomposição vegetal' }
  ]
};
