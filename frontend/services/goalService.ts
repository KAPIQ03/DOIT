import axios from '@/lib/axios';

export interface Goal {
    id: number;
    title: string;
    description?: string;
    is_achieved: boolean;
}

export const goalService = {
    getAllGoals: async () => {
        const response = await axios.get('/api/goals');
        return Array.isArray(response.data) ? response.data : (response.data.data || []);
    },

    createGoal: async (title: string, description?: string) => {
        const response = await axios.post('/api/goals', {
            title,
            description,
            is_achieved: false
        });
        return response.data.data || response.data;
    },

    updateGoal: async (id: number, data: Partial<Goal>) => {
        const response = await axios.put(`/api/goals/${id}`, data);
        return response.data.data || response.data;
    },

    deleteGoal: async (id: number) => {
        await axios.delete(`/api/goals/${id}`);
    }
};
