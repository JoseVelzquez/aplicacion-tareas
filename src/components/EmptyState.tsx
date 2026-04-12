import { motion } from 'framer-motion';
import { HiClipboardDocumentList } from 'react-icons/hi2';
import type { TaskFilter } from '../types/task';

type EmptyStateProps = {
  filter: TaskFilter;
  hasAnyTasks: boolean;
};

const copy: Record<
  TaskFilter,
  { title: string; subtitle: string }
> = {
  all: {
    title: 'Sin tareas por ahora',
    subtitle:
      'Añade tu primera tarea arriba. Organiza tu día con claridad y estilo.',
  },
  pending: {
    title: 'No hay pendientes',
    subtitle: 'Todas las tareas están completadas o aún no has creado ninguna.',
  },
  completed: {
    title: 'Nada completado aún',
    subtitle: 'Marca tareas como hechas para verlas aquí.',
  },
};

export function EmptyState({ filter, hasAnyTasks }: EmptyStateProps) {
  const { title, subtitle } = copy[filter];
  const showSparkles = filter === 'all' && !hasAnyTasks;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200/80 bg-white/30 px-8 py-16 text-center dark:border-white/10 dark:bg-slate-900/30"
    >
      <motion.div
        animate={
          showSparkles
            ? { scale: [1, 1.05, 1], rotate: [0, -2, 2, 0] }
            : undefined
        }
        transition={{ repeat: showSparkles ? Infinity : 0, duration: 4 }}
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 text-violet-600 dark:text-violet-300"
      >
        <HiClipboardDocumentList className="h-10 w-10" aria-hidden />
      </motion.div>
      <h3 className="font-display text-xl font-semibold text-slate-800 dark:text-slate-100">
        {title}
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {subtitle}
      </p>
    </motion.div>
  );
}
