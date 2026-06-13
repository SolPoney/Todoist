import { create } from 'zustand';
import { ApiTask, apiGetTasks, apiCreateTask, apiCompleteTask, apiDeleteTask } from '../api/tasks';

type TasksStore = {
  tasks: ApiTask[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  createTask: (title: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
};

export const useTasksStore = create<TasksStore>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

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

  // Optimistic update : on coche localement avant la réponse API
  completeTask: async (id) => {
    set({ tasks: get().tasks.map(t => t.id === id ? { ...t, isCompleted: true } : t) });
    await apiCompleteTask(id);
  },

  deleteTask: async (id) => {
    set({ tasks: get().tasks.filter(t => t.id !== id) });
    await apiDeleteTask(id);
  },
}));
