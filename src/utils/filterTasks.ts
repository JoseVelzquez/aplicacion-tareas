import type { Task, TaskFilter } from '../types/task';

export function filterTasks(tasks: Task[], filter: TaskFilter): Task[] {
  switch (filter) {
    case 'completed':
      return tasks.filter((t) => t.completada);
    case 'pending':
      return tasks.filter((t) => !t.completada);
    default:
      return tasks;
  }
}
