import { motion } from 'framer-motion';
import { FormEvent, useRef, useState } from 'react';
import { HiPlus } from 'react-icons/hi2';

type TaskInputProps = {
  onAdd: (text: string) => boolean;
};

export function TaskInput({ onAdd }: TaskInputProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    const added = onAdd(trimmed);
    if (added) {
      setValue('');
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit();
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <label htmlFor="task-input" className="sr-only">
          Nueva tarea
        </label>
        <input
          ref={inputRef}
          id="task-input"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="¿Qué necesitas hacer?"
          autoFocus
          autoComplete="off"
          className="min-h-[52px] flex-1 rounded-2xl border border-slate-200/80 bg-white/70 px-5 py-3 text-base text-slate-900 shadow-inner outline-none ring-violet-500/30 backdrop-blur-md transition placeholder:text-slate-400 focus:border-violet-400/60 focus:ring-2 dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-violet-400/40"
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:shadow-xl hover:shadow-violet-500/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 dark:from-violet-500 dark:to-fuchsia-500 dark:shadow-violet-900/40"
        >
          <HiPlus className="h-5 w-5" aria-hidden />
          Añadir
        </motion.button>
      </div>
    </form>
  );
}
