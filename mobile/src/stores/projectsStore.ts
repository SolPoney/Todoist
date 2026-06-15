import { create } from 'zustand';
import { ApiProject, apiGetProjects, apiCreateProject, apiDeleteProject } from '../api/projects';

type ProjectsStore = {
  projects: ApiProject[];
  fetchProjects: () => Promise<void>;
  createProject: (name: string, color: string) => Promise<ApiProject>;
  deleteProject: (id: string) => Promise<void>;
};

export const useProjectsStore = create<ProjectsStore>((set, get) => ({
  projects: [],
  fetchProjects: async () => {
    const projects = await apiGetProjects();
    set({ projects });
  },
  createProject: async (name, color) => {
    const project = await apiCreateProject(name, color);
    set({ projects: [...get().projects, project] });
    return project;
  },
  deleteProject: async (id) => {
    await apiDeleteProject(id);
    set({ projects: get().projects.filter(p => p.id !== id) });
  },
}));
