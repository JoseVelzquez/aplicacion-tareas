import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AnimatePresence, motion } from 'framer-motion';
import type { Task, TaskFilter } from '../types/task';
import { TaskItem } from './TaskItem';

type TaskListProps = {
  tasks: Task[];
  filter: TaskFilter;
  onToggle: (id: string) => void;
  onUpdate: (id: string, texto: string) => boolean;
  onRequestDelete: (id: string) => void;
  onReorder: (activeId: string, overId: string) => void;
};

function SortableRow({
  task,
  reorderEnabled,
  onToggle,
  onUpdate,
  onRequestDelete,
}: {
  task: Task;
  reorderEnabled: boolean;
  onToggle: (id: string) => void;
  onUpdate: (id: string, texto: string) => boolean;
  onRequestDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, disabled: !reorderEnabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="touch-manipulation">
      <TaskItem
        task={task}
        onToggle={onToggle}
        onUpdate={onUpdate}
        onRequestDelete={onRequestDelete}
        showDragHandle={reorderEnabled}
        dragAttributes={attributes}
        dragListeners={listeners}
        isDragging={isDragging}
      />
    </div>
  );
}

export function TaskList({
  tasks,
  filter,
  onToggle,
  onUpdate,
  onRequestDelete,
  onReorder,
}: TaskListProps) {
  const reorderEnabled = filter === 'all' && tasks.length > 0;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      onReorder(String(active.id), String(over.id));
    }
  };

  const ids = tasks.map((t) => t.id);

  const list = (
    <ul className="flex flex-col gap-3" aria-label="Lista de tareas">
      <AnimatePresence initial={false} mode="popLayout">
        {tasks.map((task) => (
          <motion.li
            key={task.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="list-none"
          >
            {reorderEnabled ? (
              <SortableRow
                task={task}
                reorderEnabled
                onToggle={onToggle}
                onUpdate={onUpdate}
                onRequestDelete={onRequestDelete}
              />
            ) : (
              <TaskItem
                task={task}
                onToggle={onToggle}
                onUpdate={onUpdate}
                onRequestDelete={onRequestDelete}
              />
            )}
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );

  if (!reorderEnabled) {
    return list;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        {list}
      </SortableContext>
    </DndContext>
  );
}
