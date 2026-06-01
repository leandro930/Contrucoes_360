import React from 'react';

interface SkeletonProps {
  className?: string;
}

/**
 * Componente de placeholder de carregamento (Skeleton).
 * Renderiza blocos com animação suave de "pulsar" para indicar
 * que o conteúdo real está sendo carregado, respeitando configurações de acessibilidade
 * (prefers-reduced-motion).
 * 
 * @param props - Propriedades do componente skeleton.
 * @param props.className - Classes utilitárias Tailwind (tamanho, margem, etc.) a serem injetadas no elemento base.
 * @returns Uma div animada estilizada representando o layout em loading.
 */
export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`bg-slate-800 rounded animate-pulse motion-reduce:animate-none ${className}`} />
  );
}
