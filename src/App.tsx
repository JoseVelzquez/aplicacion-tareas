import { useMemo, useState } from 'react';
import { Toaster, toast } from 'sonner';
import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi2';
import { motion } from 'framer-motion';
import { ConfirmDialog } from './components/ConfirmDialog';
import { EmptyState } from './components/EmptyState';
import { FilterBar } from './components/FilterBar';
import { TaskInput } from './components/TaskInput';
import { TaskList } from './components/TaskList';
import { useDarkMode } from './hooks/useDarkMode';
import { useTasks } from './hooks/useTasks';
import type { TaskFilter } from './types/task';
import { filterTasks } from './utils/filterTasks';

function App() {
  const { isDark, toggle } = useDarkMode();
  const {
    tasks,
    addTask,
    deleteTask,
    toggleComplete,
    updateTask,
    reorderTasks,
  } = useTasks();

  const [filter, setFilter] = useState<TaskFilter>('all');
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const visibleTasks = useMemo(
    () => filterTasks(tasks, filter),
    [tasks, filter]
  );

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completada).length;
    return { total, completed, pending: total - completed };
  }, [tasks]);

  const pendingDeleteTask = pendingDeleteId
    ? tasks.find((t) => t.id === pendingDeleteId)
    : undefined;

  const handleAdd = (text: string) => {
    const created = addTask(text);
    if (created) {
      toast.success('Tarea añadida');
      return true;
    }
    return false;
  };

  const handleUpdate = (id: string, texto: string) => {
    const ok = updateTask(id, texto);
    if (ok) toast.success('Tarea actualizada');
    return ok;
  };

  const confirmDelete = () => {
    if (pendingDeleteId) {
      deleteTask(pendingDeleteId);
      toast.success('Tarea eliminada');
    }
    setPendingDeleteId(null);
  };

  const showEmpty = visibleTasks.length === 0;

  return (
    <div className="min-h-screen bg-slate-50 bg-mesh-light font-sans text-slate-900 transition-colors dark:bg-slate-950 dark:bg-mesh-dark dark:text-slate-100">
      <a
        href="#main"
        className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:inline-block focus:rounded-lg focus:bg-violet-600 focus:px-3 focus:py-2 focus:text-white focus:shadow-lg focus:outline-none"
      >
        Ir al contenido
      </a>

      <Toaster
        position="top-center"
        richColors
        closeButton
        theme={isDark ? 'dark' : 'light'}
        toastOptions={{
          classNames: {
            toast:
              'backdrop-blur-md border border-slate-200/80 dark:border-white/10',
          },
        }}
      />

      <ConfirmDialog
        open={Boolean(pendingDeleteId && pendingDeleteTask)}
        title="¿Eliminar esta tarea?"
        message={`Se eliminará «${pendingDeleteTask?.texto ?? ''}». Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />

      <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-4 py-10 sm:px-6 sm:py-14">
        <header className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-violet-600 dark:text-violet-400">
              Productividad
            </p>
            <h1 className="font-display mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
              Task Manager Pro
            </h1>
            <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">
              Organiza tus pendientes con un tablero claro, rápido y agradable
              de usar.
            </p>
          </div>
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={toggle}
            aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center self-end rounded-2xl border border-slate-200/80 bg-white/70 text-slate-700 shadow-glass backdrop-blur-md transition hover:border-violet-300/60 hover:text-violet-600 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:border-violet-500/40 dark:hover:text-violet-300 sm:self-auto"
          >
            {isDark ? (
              <HiOutlineSun className="h-6 w-6" />
            ) : (
              <HiOutlineMoon className="h-6 w-6" />
            )}
          </motion.button>
        </header>

        <main
          id="main"
          className="flex flex-1 flex-col rounded-[2rem] border border-slate-200/60 bg-white/55 p-5 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/45 dark:shadow-glass-dark sm:p-8"
        >
          <TaskInput onAdd={handleAdd} />

          <div className="mt-6 space-y-4">
            <FilterBar value={filter} onChange={setFilter} />
            <p
              className="text-center text-sm text-slate-600 dark:text-slate-400"
              aria-live="polite"
            >
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {stats.total}
              </span>{' '}
              en total ·{' '}
              <span className="font-medium text-amber-700 dark:text-amber-400">
                {stats.pending}
              </span>{' '}
              pendientes ·{' '}
              <span className="font-medium text-emerald-700 dark:text-emerald-400">
                {stats.completed}
              </span>{' '}
              completadas
            </p>
          </div>

          <div className="mt-8 flex-1">
            {showEmpty ? (
              <EmptyState filter={filter} hasAnyTasks={tasks.length > 0} />
            ) : (
              <TaskList
                tasks={visibleTasks}
                filter={filter}
                onToggle={toggleComplete}
                onUpdate={handleUpdate}
                onRequestDelete={setPendingDeleteId}
                onReorder={reorderTasks}
              />
            )}
          </div>

          {filter === 'all' && tasks.length > 1 && (
            <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-500">
              Arrastra el icono de barras para reordenar las tareas.
            </p>
          )}
        </main>

        <footer className="mt-10 text-center text-xs text-slate-500 dark:text-slate-500">
          Hecho con React, TypeScript y Tailwind · Task Manager Pro
        </footer>
      </div>
    </div>
  );
}

export default App;
