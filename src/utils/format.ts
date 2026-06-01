/**
 * Formata um valor numérico como moeda brasileira (BRL) sem casas decimais.
 * Exemplo: 15400.5 -> "R$ 15.401". Em caso de valor inválido, retorna "-".
 *
 * @param val - O valor a ser formatado.
 * @returns A string da moeda formatada.
 */
export function formatCurrency(val?: number | null): string {
  if (val === undefined || val === null || Number.isNaN(val)) return '-';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
}

/**
 * Formata um valor numérico como moeda brasileira (BRL) com duas casas decimais fixas.
 * Exemplo: 15400.5 -> "R$ 15.400,50". Em caso de valor inválido, retorna "-".
 *
 * @param val - O valor a ser formatado.
 * @returns A string da moeda formatada.
 */
export function formatCurrencyDecimals(val?: number | null): string {
  if (val === undefined || val === null || Number.isNaN(val)) return '-';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);
}

/**
 * Formata um valor numérico interpretado como percentual (0 a 100).
 * Divide por 100 para o formato nativo e gera o símbolo "%".
 * 
 * @param val - Valor do percentual a ser formatado (ex: 25.4).
 * @param showSign - Se for true, adiciona um "+" prefixado se for valor positivo (ex: "+25,4%").
 * @param digits - Quantidade máxima de casas decimais para exibir; default é 1.
 * @returns A string percentual formatada.
 */
export function formatPercent(val?: number | null, showSign = false, digits = 1): string {
  if (val === undefined || val === null || Number.isNaN(val)) return '-';
  const formatted = new Intl.NumberFormat('pt-BR', { 
    style: 'percent', 
    minimumFractionDigits: 0, 
    maximumFractionDigits: digits 
  }).format(val / 100);
  
  if (showSign && val > 0) {
    return `+${formatted}`;
  }
  return formatted;
}
