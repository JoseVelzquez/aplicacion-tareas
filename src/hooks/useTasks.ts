import { arrayMove } from '@dnd-kit/sortable';
import { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Task } from '../types/task';

const STORAGE_KEY = 'task-manager-pro-tasks';

function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) return false;
  const t = value as Record<string, unknown>;
  return (
    typeof t.id === 'string' &&
    typeof t.texto === 'string' &&
    typeof t.completada === 'boolean' &&
    (typeof t.createdAt === 'number' || t.createdAt === undefined)
  );
}

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isTask).map((t) => ({
      ...t,
      createdAt: typeof t.createdAt === 'number' ? t.createdAt : Date.now(),
    }));
  } catch {
    return [];
  }
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = useCallback((texto: string) => {
    const trimmed = texto.trim();
    if (!trimmed) return null;
    const task: Task = {
      id: uuidv4(),
      texto: trimmed,
      completada: false,
      createdAt: Date.now(),
    };
    setTasks((prev) => [task, ...prev]);
    return task;
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleComplete = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completada: !t.completada } : t
      )
    );
  }, []);

  const updateTask = useCallback((id: string, texto: string) => {
    const trimmed = texto.trim();
    if (!trimmed) return false;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, texto: trimmed } : t))
    );
    return true;
  }, []);

  const reorderTasks = useCallback((activeId: string, overId: string) => {
    setTasks((prev) => {
      const oldIndex = prev.findIndex((t) => t.id === activeId);
      const newIndex = prev.findIndex((t) => t.id === overId);
      if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });
  }, []);

  return {
    tasks,
    addTask,
    deleteTask,
    toggleComplete,
    updateTask,
    reorderTasks,
  };
}
