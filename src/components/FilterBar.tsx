import { motion } from 'framer-motion';
import type { TaskFilter } from '../types/task';

const FILTERS: { id: TaskFilter; label: string }[] = [
  { id: 'all', label: 'Todas' },
  { id: 'pending', label: 'Pendientes' },
  { id: 'completed', label: 'Completadas' },
];

type FilterBarProps = {
  value: TaskFilter;
  onChange: (f: TaskFilter) => void;
};

export function FilterBar({ value, onChange }: FilterBarProps) {
  return (
    <div
      className="flex flex-wrap gap-2 rounded-2xl border border-slate-200/60 bg-white/40 p-1.5 backdrop-blur-md dark:border-white/10 dark:bg-slate-900/40"
      role="tablist"
      aria-label="Filtrar tareas"
    >
      {FILTERS.map((f) => {
        const active = value === f.id;
        return (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(f.id)}
            className={`relative min-h-[40px] flex-1 rounded-xl px-3 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 sm:flex-none sm:px-4 ${
              active
                ? 'text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
            }`}
          >
            {active && (
              <motion.span
                layoutId="filter-pill"
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-md dark:from-violet-500 dark:to-fuchsia-500"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{f.label}</span>
          </button>
        );
      })}
    </div>
  );
}
