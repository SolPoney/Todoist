import { create } from 'zustand';
import { ApiTask, apiGetTasks, apiCreateTask, apiCompleteTask, apiDeleteTask } from '../api/tasks';

type PendingAction = {
  type: 'complete' | 'delete';
  task: ApiTask;
  timer: ReturnType<typeof setTimeout>;
};

type TasksStore = {
  tasks: ApiTask[];
  isLoading: boolean;
  error: string | null;
  pendingAction: PendingAction | null;
  fetchTasks: () => Promise<void>;
  createTask: (title: string) => Promise<void>;
  completeTask: (id: string) => void;
  deleteTask: (id: string) => void;
  undoAction: () => void;
  confirmAction: () => void;
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
      set({ tasks, isLoading: false });
    } catch {
      set({ error: 'Impossible de charger les tâches', isLoading: false });
    }
  },

  createTask: async (title) => {
    const task = await apiCreateTask(title);
    set({ tasks: [task, ...get().tasks] });
  },

  // Retire la tâche visuellement, attend 4s avant l'API
  completeTask: (id) => {
    const task = get().tasks.find(t => t.id === id);
    if (!task) return;

    // Annule une action précédente en cours si elle existe
    if (get().pendingAction) get().confirmAction();

    // Retire visuellement
    set({ tasks: get().tasks.filter(t => t.id !== id) });

    const timer = setTimeout(() => {
      apiCompleteTask(id);
      set({ pendingAction: null });
    }, 4000);

    set({ pendingAction: { type: 'complete', task, timer } });
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
  },

  // L'utilisateur appuie sur "Annuler" → remet la tâche
  undoAction: () => {
    const pending = get().pendingAction;
    if (!pending) return;

    clearTimeout(pending.timer);
    set({
      tasks: [pending.task, ...get().tasks],
      pendingAction: null,
    });
  },

  // L'utilisateur n'a pas annulé → on exécute l'action API immédiatement
  confirmAction: () => {
    const pending = get().pendingAction;
    if (!pending) return;

    clearTimeout(pending.timer);
    if (pending.type === 'complete') apiCompleteTask(pending.task.id);
    if (pending.type === 'delete') apiDeleteTask(pending.task.id);
    set({ pendingAction: null });
  },
}));
