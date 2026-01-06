import axios from '@/lib/axios';

export interface DailyLog {
    id: number;
    log_date: string; // YYYY-MM-DD
    completed_count: number;
    user_id: number;
}

export const dailyLogService = {
    getAllLogs: async () => {
        const response = await axios.get('/api/daily-logs');
        return Array.isArray(response.data) ? response.data : (response.data.data || []);
    }
};
