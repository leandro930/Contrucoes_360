import React from 'react';

interface LogoFremasaProps {
  variant?: 'light' | 'dark';  // 'light' = fundo claro (texto escuro); 'dark' = fundo escuro (texto claro)
  width?: number;
  showEngenharia?: boolean;     // mostrar a palavra ENGENHARIA abaixo
}

export function LogoFremasa({ variant = 'light', width = 200, showEngenharia = true }: LogoFremasaProps) {
  const textColor = variant === 'dark' ? '#E2E8F0' : '#3A3A3A';
  const frameColor = variant === 'dark' ? '#64748B' : '#3A3A3A';
  const accent = '#E8821E'; // laranja Fremasa (constante nos dois temas)
  const viewH = showEngenharia ? 150 : 110;

  return (
    <svg
      viewBox={`0 0 520 ${viewH}`}
      width={width}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Fremasa Engenharia"
    >
      <rect x="20" y="20" width="480" height="80" fill="none" stroke={frameColor} strokeWidth="2.5" />
      <text x="55" y="80" fontFamily="Arial, Helvetica, sans-serif" fontSize="58" fontWeight="400" letterSpacing="4" fill={textColor}>FREMAS</text>
      <path d="M 415 78 L 438 34 L 461 78" fill="none" stroke={accent} strokeWidth="11" strokeLinejoin="miter" />
      {showEngenharia && (
        <text x="180" y="135" fontFamily="Arial, Helvetica, sans-serif" fontSize="26" fontWeight="400" letterSpacing="8" fill={textColor}>ENGENHARIA</text>
      )}
    </svg>
  );
}
