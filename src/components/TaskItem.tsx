import { motion } from 'framer-motion';
import type {
  DraggableAttributes,
  DraggableSyntheticListeners,
} from '@dnd-kit/core';
import { useEffect, useRef, useState } from 'react';
import {
  HiBars3,
  HiOutlinePencilSquare,
  HiOutlineTrash,
} from 'react-icons/hi2';
import type { Task } from '../types/task';
import { formatTaskDate } from '../utils/formatTaskDate';

export type TaskItemProps = {
  task: Task;
  onToggle: (id: string) => void;
  onUpdate: (id: string, texto: string) => boolean;
  onRequestDelete: (id: string) => void;
  showDragHandle?: boolean;
  dragAttributes?: DraggableAttributes;
  dragListeners?: DraggableSyntheticListeners;
  isDragging?: boolean;
};

export function TaskItem({
  task,
  onToggle,
  onUpdate,
  onRequestDelete,
  showDragHandle,
  dragAttributes,
  dragListeners,
  isDragging,
}: TaskItemProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.texto);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editing) setDraft(task.texto);
  }, [task.texto, editing]);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const save = () => {
    if (onUpdate(task.id, draft)) {
      setEditing(false);
    }
  };

  const cancel = () => {
    setDraft(task.texto);
    setEditing(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      save();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      cancel();
    }
  };

  return (
    <article
      className={`group flex items-stretch gap-2 rounded-2xl border border-slate-200/70 bg-white/60 p-2 shadow-sm backdrop-blur-md transition hover:border-violet-200/80 hover:shadow-md dark:border-white/10 dark:bg-slate-900/50 dark:hover:border-violet-500/30 ${
        isDragging ? 'scale-[1.02] shadow-lg ring-2 ring-violet-400/50' : ''
      } ${task.completada ? 'opacity-75' : ''}`}
    >
      {showDragHandle && (
        <button
          type="button"
          className="flex cursor-grab touch-none items-center justify-center rounded-xl px-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 active:cursor-grabbing dark:hover:bg-white/10 dark:hover:text-slate-300"
          aria-label="Arrastrar para reordenar"
          {...dragAttributes}
          {...dragListeners}
        >
          <HiBars3 className="h-5 w-5" />
        </button>
      )}

      <label className="flex cursor-pointer items-start pt-2.5">
        <input
          type="checkbox"
          checked={task.completada}
          onChange={() => onToggle(task.id)}
          className="peer sr-only"
        />
        <span
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-slate-300 bg-white transition peer-checked:border-violet-500 peer-checked:bg-violet-500 dark:border-slate-500 dark:bg-slate-800 peer-checked:dark:border-violet-400 peer-checked:dark:bg-violet-500"
          aria-hidden
        >
          <motion.svg
            className="h-3 w-3 text-white"
            viewBox="0 0 12 12"
            initial={false}
            animate={{ scale: task.completada ? 1 : 0, opacity: task.completada ? 1 : 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 32 }}
          >
            <path
              d="M2 6l3 3 5-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </span>
      </label>

      <div className="min-w-0 flex-1 py-1.5">
        {editing ? (
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={save}
            onKeyDown={onKeyDown}
            className="w-full rounded-lg border border-violet-300/80 bg-white px-2 py-1 text-base text-slate-900 outline-none ring-2 ring-violet-500/20 dark:border-violet-500/40 dark:bg-slate-900 dark:text-slate-100"
            aria-label="Editar tarea"
          />
        ) : (
          <button
            type="button"
            onDoubleClick={() => setEditing(true)}
            className="w-full text-left"
          >
            <span
              className={`block text-base leading-snug transition ${
                task.completada
                  ? 'text-slate-500 line-through dark:text-slate-500'
                  : 'text-slate-800 dark:text-slate-100'
              }`}
            >
              {task.texto}
            </span>
            <time
              dateTime={new Date(task.createdAt).toISOString()}
              className="mt-1 block text-xs text-slate-500 dark:text-slate-400"
            >
              {formatTaskDate(task.createdAt)}
            </time>
          </button>
        )}
      </div>

      <div className="flex shrink-0 flex-col gap-1 sm:flex-row sm:items-center">
        {!editing && (
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => setEditing(true)}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-violet-500/10 hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-300"
            aria-label="Editar tarea"
          >
            <HiOutlinePencilSquare className="h-5 w-5" />
          </motion.button>
        )}
        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={() => onRequestDelete(task.id)}
          className="rounded-xl p-2 text-slate-500 transition hover:bg-red-500/10 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"
          aria-label="Eliminar tarea"
        >
          <HiOutlineTrash className="h-5 w-5" />
        </motion.button>
      </div>
    </article>
  );
}
