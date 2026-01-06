'use client'; 
import { useAuth } from '@/hooks/auth';
import { useState, useEffect } from 'react';
import { taskService, Task } from '@/services/taskService';
import { projectService, Project } from '@/services/projectService';
import { goalService, Goal } from '@/services/goalService';
import { dailyLogService, DailyLog } from '@/services/dailyLogService';
import Link from 'next/link';
import { ActivityCalendar } from 'react-activity-calendar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { subDays, format } from 'date-fns';

export default function DashboardPage() {
  const { user } = useAuth({ middleware: 'auth' });
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<number | ''>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedTasks, fetchedProjects, fetchedGoals, fetchedLogs] = await Promise.all([
          taskService.getAllTasks(),
          projectService.getAllProjects(),
          goalService.getAllGoals(),
          dailyLogService.getAllLogs()
        ]);

        setTasks(fetchedTasks);
        setProjects(fetchedProjects);
        setGoals(fetchedGoals);
        setDailyLogs(fetchedLogs);

        if (fetchedProjects.length === 0) {
           const inbox = await projectService.createProject('Inbox');
           setProjects([inbox]);
           setSelectedProjectId(inbox.id);
        } else {
           setSelectedProjectId(fetchedProjects[0].id);
        }

      } catch (error) {
        console.error("Błąd pobierania danych:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    if (selectedProjectId === '') return; 

    try {
      const projectId = Number(selectedProjectId);
      const newTask = await taskService.createTask(newTaskTitle, projectId);
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
    } catch (error) {
      console.error("Błąd dodawania zadania:", error);
      alert("Nie udało się dodać zadania.");
    }
  };

  const toggleTaskCompletion = async (task: Task) => {
    const updatedTask = { ...task, is_completed: !task.is_completed };
    setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));

    try {
      await taskService.updateTask(task.id, { is_completed: updatedTask.is_completed });
      const logs = await dailyLogService.getAllLogs();
      setDailyLogs(logs);
    } catch (error) {
      console.error("Błąd aktualizacji zadania:", error);
      setTasks(tasks.map(t => t.id === task.id ? task : t));
    }
  };

  const calendarData = dailyLogs.map(log => ({
      date: log.log_date,
      count: log.completed_count,
      level: Math.min(Math.max(log.completed_count, 0), 4)
  }));
  
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  if (!calendarData.find(d => d.date === todayStr)) {
      calendarData.push({ date: todayStr, count: 0, level: 0 });
  }

  const chartData = Array.from({ length: 7 }, (_, i) => {
      const d = subDays(new Date(), 6 - i);
      const dateStr = format(d, 'yyyy-MM-dd');
      const log = dailyLogs.find(l => l.log_date === dateStr);
      return {
          name: format(d, 'dd.MM'),
          completed: log ? log.completed_count : 0
      };
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Witaj {user ? user.name : '...'}!
      </h1>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">My Day</h2>
            
            {isLoading ? (
              <div className="text-gray-500 text-sm">Ładowanie zadań...</div>
            ) : (
              <div className="space-y-3">
                {tasks.length === 0 && <p className="text-gray-500 text-sm">Brak zadań na dziś.</p>}
                
                {tasks.map(task => (
                  <div key={task.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={task.is_completed}
                      onChange={() => toggleTaskCompletion(task)}
                      className="form-checkbox text-red-600 rounded focus:ring-red-500"
                    />
                    <div className="flex flex-col">
                        <span
                        className={`text-gray-900 ${task.is_completed ? 'line-through text-gray-400' : ''}`}
                        >
                        {task.title}
                        </span>
                        <span className="text-xs text-gray-400">
                            {projects.find(p => p.id === task.project_id)?.name}
                        </span>
                    </div>
                  </div>
                ))}

                <div className="mt-4 flex flex-col space-y-2">
                    <input 
                        type="text" 
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="Wpisz nowe zadanie..."
                        className="w-full border-gray-300 rounded shadow-sm focus:border-red-500 focus:ring-red-500 text-base px-3 py-2 text-gray-900 placeholder-gray-500"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                    />
                    <div className="flex space-x-2">
                        <select
                            value={selectedProjectId}
                            onChange={(e) => setSelectedProjectId(e.target.value === '' ? '' : Number(e.target.value))}
                            className="flex-1 border-gray-300 rounded shadow-sm focus:border-red-500 focus:ring-red-500 text-base px-3 py-2 text-gray-900"
                        >
                            {projects.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                        <button 
                            onClick={handleAddTask}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Dodaj
                        </button>
                    </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Goals</h2>
            {isLoading ? <p className="text-sm text-gray-500">Ładowanie...</p> : (
              goals.length > 0 ? (
                 <div className="grid grid-cols-2 gap-4">
                  {goals.slice(0, 4).map((goal) => (
                    <div key={goal.id} className="border border-gray-200 rounded p-4 flex flex-col items-center justify-center bg-gray-50">
                      <div className="font-medium text-gray-800 text-center">{goal.title}</div>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-gray-500">Brak celów.</p>
            )}
             <Link href="/projects-goals" className="mt-4 block w-full text-center py-2 px-4 border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Zarządzaj celami
              </Link>
          </div>
          
           <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Projects</h2>
             {isLoading ? <p className="text-sm text-gray-500">Ładowanie...</p> : (
               projects.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {projects.slice(0, 4).map((project) => (
                    <div key={project.id} className="border border-gray-200 rounded p-4 flex flex-col items-center justify-center bg-gray-50">
                      <div className="font-medium text-gray-800 text-center">{project.name}</div>
                    </div>
                  ))}
                </div>
               ) : <p className="text-sm text-gray-500">Brak projektów.</p>
             )}
            <Link href="/projects-goals" className="mt-4 block w-full text-center py-2 px-4 border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Zarządzaj projektami
              </Link>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Statistics</h2>
             
             {/* Kalendarz Aktywności */}
             <div className="mb-8">
                 <h3 className="text-sm font-medium text-gray-500 mb-2">Aktywność (ostatni rok)</h3>
                 <div className="flex justify-center">
                    <ActivityCalendar 
                        data={calendarData} 
                        theme={{
                            light: ['#e5e7eb', '#fecaca', '#f87171', '#dc2626', '#991b1b'],
                            dark: ['#e5e7eb', '#fecaca', '#f87171', '#dc2626', '#991b1b'],
                        }}
                        labels={{
                            legend: {
                                less: 'Mniej',
                                more: 'Więcej'
                            },
                            months: ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'],
                            totalCount: '{{count}} wykonanych zadań w ostatnim roku',
                            weekdays: ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So']
                        }}
                        blockSize={12}
                        blockMargin={4}
                    />
                 </div>
             </div>

            {/* Wykres Liniowy */}
            <div>
                 <h3 className="text-sm font-medium text-gray-500 mb-2">Ostatnie 7 dni</h3>
                 <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Line type="monotone" dataKey="completed" stroke="#dc2626" activeDot={{ r: 8 }} name="Ukończone zadania" />
                        </LineChart>
                    </ResponsiveContainer>
                 </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}