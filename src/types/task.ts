export type TaskFilter = 'all' | 'completed' | 'pending';

export interface Task {
  id: string;
  texto: string;
  completada: boolean;
  createdAt: number;
}
