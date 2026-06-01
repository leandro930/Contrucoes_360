import { PlayCircle, Compass, Briefcase, StopCircle, CheckCircle, LucideIcon } from 'lucide-react';

export const STATUS_OBRA = {
  EM_EXECUCAO: 'EM_EXECUCAO',
  EM_FINALIZACAO: 'EM_FINALIZACAO',
  PRE_OBRA: 'PRE_OBRA',
  PARALISADA: 'PARALISADA',
  CONCLUIDA: 'CONCLUIDA'
} as const;

export type StatusObra = typeof STATUS_OBRA[keyof typeof STATUS_OBRA];

export interface StatusObraConfig {
  label: string;
  colorClass: string;
  icon: LucideIcon;
}

export const STATUS_OBRA_CONFIG: Record<StatusObra, StatusObraConfig> = {
  [STATUS_OBRA.EM_EXECUCAO]: {
    label: 'Em execução',
    colorClass: 'bg-amber-500/10 text-amber-500',
    icon: PlayCircle,
  },
  [STATUS_OBRA.EM_FINALIZACAO]: {
    label: 'Finalização',
    colorClass: 'bg-emerald-500/10 text-emerald-500',
    icon: Compass,
  },
  [STATUS_OBRA.PRE_OBRA]: {
    label: 'Pré-obra',
    colorClass: 'bg-slate-500/10 text-slate-400',
    icon: Briefcase,
  },
  [STATUS_OBRA.PARALISADA]: {
    label: 'Paralisada',
    colorClass: 'bg-rose-500/10 text-rose-500',
    icon: StopCircle,
  },
  [STATUS_OBRA.CONCLUIDA]: {
    label: 'Concluída',
    colorClass: 'bg-sky-500/10 text-sky-400',
    icon: CheckCircle,
  },
};
