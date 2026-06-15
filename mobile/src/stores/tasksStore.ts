import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiTask, apiGetTasks, apiCreateTask, apiCompleteTask, apiDeleteTask, apiUpdateTask } from '../api/tasks';
import { scheduleTaskNotification, cancelTaskNotification } from '../utils/notifications';

type PendingAction = {
  type: 'complete' | 'delete' | 'delete_bulk';
  task: ApiTask;
  tasks?: ApiTask[];
  count?: number;
  timer: ReturnType<typeof setTimeout>;
};

type TasksStore = {
  tasks: ApiTask[];
  isLoading: boolean;
  error: string | null;
  pendingAction: PendingAction | null;
  fetchTasks: () => Promise<void>;
  createTask: (title: string, dueDate?: string, priority?: number, projectId?: string | null, recurrenceRule?: string) => Promise<void>;
  updateTask: (id: string, title: string, dueDate?: string | null, priority?: number, projectId?: string | null, recurrenceRule?: string) => Promise<void>;
  importTasks: (titles: string[]) => Promise<void>;
  completeTask: (id: string) => void;
  deleteTask: (id: string) => void;
  deleteTasksBulk: (ids: string[]) => void;
  undoAction: () => void;
  confirmAction: () => void;
  reorderTasks: (orderedIds: string[]) => Promise<void>;
};

export const useTasksStore = create<TasksStore>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,
  pendingAction: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await apiGetTasks();
      const savedOrder = await AsyncStorage.getItem('task_order');
      if (savedOrder) {
        const orderedIds: string[] = JSON.parse(savedOrder);
        const ordered = [
          ...orderedIds.map(id => tasks.find(t => t.id === id)).filter(Boolean) as typeof tasks,
          ...tasks.filter(t => !orderedIds.includes(t.id)),
        ];
        set({ tasks: ordered, isLoading: false });
      } else {
        set({ tasks, isLoading: false });
      }
    } catch {
      set({ error: 'Impossible de charger les tâches', isLoading: false });
    }
  },

  createTask: async (title, dueDate?, priority = 4, projectId?, recurrenceRule = 'none') => {
    const task = await apiCreateTask(title, priority, dueDate, projectId, recurrenceRule);
    if (dueDate) scheduleTaskNotification(task.id, title, new Date(dueDate)).catch(() => {});
    set({ tasks: [task, ...get().tasks] });
  },

  updateTask: async (id, title, dueDate, priority, projectId, recurrenceRule) => {
    const updated = await apiUpdateTask(id, { title, dueDate: dueDate ?? null, priority, projectId, recurrenceRule });
    if (dueDate) scheduleTaskNotification(id, title, new Date(dueDate)).catch(() => {});
    else cancelTaskNotification(id).catch(() => {});
    set({ tasks: get().tasks.map(t => t.id === id ? updated : t) });
  },

  importTasks: async (titles) => {
    const newTasks = await Promise.all(titles.map(title => apiCreateTask(title)));
    set({ tasks: [...newTasks, ...get().tasks] });
  },

  completeTask: (id) => {
    const task = get().tasks.find(t => t.id === id);
    if (!task) return;

    if (get().pendingAction) get().confirmAction();

    set({ tasks: get().tasks.filter(t => t.id !== id) });

    const timer = setTimeout(() => {
      apiCompleteTask(id);
      set({ pendingAction: null });
    }, 4000);

    set({ pendingAction: { type: 'complete', task, timer } });
    cancelTaskNotification(id).catch(() => {});
  },

  deleteTask: (id) => {
    const task = get().tasks.find(t => t.id === id);
    if (!task) return;

    if (get().pendingAction) get().confirmAction();

    set({ tasks: get().tasks.filter(t => t.id !== id) });

    const timer = setTimeout(() => {
      apiDeleteTask(id);
      set({ pendingAction: null });
    }, 4000);

    set({ pendingAction: { type: 'delete', task, timer } });
    cancelTaskNotification(id).catch(() => {});
  },

  deleteTasksBulk: (ids) => {
    const deletedTasks = get().tasks.filter(t => ids.includes(t.id));
    if (deletedTasks.length === 0) return;

    if (get().pendingAction) get().confirmAction();

    set({ tasks: get().tasks.filter(t => !ids.includes(t.id)) });

    const timer = setTimeout(() => {
      deletedTasks.forEach(t => apiDeleteTask(t.id));
      set({ pendingAction: null });
    }, 4000);

    set({ pendingAction: { type: 'delete_bulk', task: deletedTasks[0], tasks: deletedTasks, count: deletedTasks.length, timer } });
    ids.forEach(id => cancelTaskNotification(id).catch(() => {}));
  },

  reorderTasks: async (orderedIds) => {
    const tasks = get().tasks;
    const reordered = [
      ...orderedIds.map(id => tasks.find(t => t.id === id)).filter(Boolean) as typeof tasks,
      ...tasks.filter(t => !orderedIds.includes(t.id)),
    ];
    await AsyncStorage.setItem('task_order', JSON.stringify(orderedIds));
    set({ tasks: reordered });
  },

  undoAction: () => {
    const pending = get().pendingAction;
    if (!pending) return;

    clearTimeout(pending.timer);
    const restoredTasks = pending.tasks ?? [pending.task];
    set({
      tasks: [...restoredTasks, ...get().tasks],
      pendingAction: null,
    });
  },

  confirmAction: () => {
    const pending = get().pendingAction;
    if (!pending) return;

    clearTimeout(pending.timer);
    if (pending.type === 'complete') apiCompleteTask(pending.task.id);
    if (pending.type === 'delete') apiDeleteTask(pending.task.id);
    if (pending.type === 'delete_bulk') (pending.tasks ?? [pending.task]).forEach(t => apiDeleteTask(t.id));
    set({ pendingAction: null });
  },
}));
