import axios from '@/lib/axios';

export interface Task {
    id: number;
    title: string;
    is_completed: boolean;
    project_id: number;
    updated_at: string;
}

export const taskService = {
    getAllTasks: async () => {
        const response = await axios.get('/api/tasks');
        return Array.isArray(response.data) ? response.data : (response.data.data || []);
    },

    createTask: async (title: string, projectId: number) => {
        const response = await axios.post('/api/tasks', {
            title,
            project_id: projectId,
            is_completed: false
        });
        return response.data.data || response.data;
    },

    updateTask: async (id: number, data: Partial<Task>) => {
        const response = await axios.put(`/api/tasks/${id}`, data);
        return response.data.data || response.data;
    },

    deleteTask: async (id: number) => {
        await axios.delete(`/api/tasks/${id}`);
    }
};
