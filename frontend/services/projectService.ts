import axios from '@/lib/axios';

export interface Project {
    id: number;
    name: string;
    goal_id?: number;
}

export const projectService = {
    getAllProjects: async () => {
        const response = await axios.get('/api/projects');
        return Array.isArray(response.data) ? response.data : (response.data.data || []);
    },

    createProject: async (name: string, goalId?: number) => {
        const payload: any = { name };
        if (goalId) payload.goal_id = goalId;
        
        const response = await axios.post('/api/projects', payload);
        return response.data.data || response.data;
    }
};
