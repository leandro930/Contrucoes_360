import type { MapaConcorrencia } from '../types/governanca';

export const mapaConcorrenciaReal: MapaConcorrencia = {
  id: '202604-QC-001',
  codigoObra: 'OR.C.144.24',
  obra: 'Residência Sitta',
  endereco: 'Cond. Serra dos Cristais — Cajamar/SP',
  responsavel: 'Eng. Hugo Fortunato',
  pacote: 'Estrutura metálica',
  status: 'fechado',
  fornecedorVencedor: 'NovaEngemetal',
  propostas: [
    {
      fornecedor: 'NovaEngemetal',
      contato: 'Comercial',
      itens: [
        { item: '1.0', quantidade: 1, unidade: 'vb', descricao: 'Fornecimento e montagem de estrutura metálica', precoUnitario: 152000, precoTotal: 152000 },
        { item: '2.0', quantidade: 1, unidade: 'vb', descricao: 'Içamento e logística', precoUnitario: 18000, precoTotal: 18000 },
      ],
      totalPropostaInicial: 185000,
      totalPropostaFinal: 170000,
      percentualDesconto: 0.081,
      variacaoVsOrcamento: -0.04,
      variacaoVsMenorPreco: 0,
    },
    {
      fornecedor: 'Steel Frame SP',
      itens: [
        { item: '1.0', quantidade: 1, unidade: 'vb', descricao: 'Fornecimento e montagem de estrutura metálica', precoUnitario: 168000, precoTotal: 168000 },
        { item: '2.0', quantidade: 1, unidade: 'vb', descricao: 'Içamento e logística', precoUnitario: 19500, precoTotal: 19500 },
      ],
      totalPropostaInicial: 195000,
      totalPropostaFinal: 187500,
      percentualDesconto: 0.038,
      variacaoVsOrcamento: 0.058,
      variacaoVsMenorPreco: 0.103,
    },
    {
      fornecedor: 'MetalArq',
      itens: [
        { item: '1.0', quantidade: 1, unidade: 'vb', descricao: 'Fornecimento e montagem de estrutura metálica', precoUnitario: 175000, precoTotal: 175000 },
        { item: '2.0', quantidade: 1, unidade: 'vb', descricao: 'Içamento e logística', precoUnitario: 21000, precoTotal: 21000 },
      ],
      totalPropostaInicial: 210000,
      totalPropostaFinal: 196000,
      percentualDesconto: 0.067,
      variacaoVsOrcamento: 0.106,
      variacaoVsMenorPreco: 0.153,
    },
  ],
};