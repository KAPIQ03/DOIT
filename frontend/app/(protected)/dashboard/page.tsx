'use client'; 
import { useAuth } from '@/hooks/auth';
import { useState, useEffect } from 'react';
import { taskService, Task } from '@/services/taskService';
import { projectService, Project } from '@/services/projectService';

export default function DashboardPage() {
  const { user } = useAuth({ middleware: 'auth' });
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedTasks, fetchedProjects] = await Promise.all([
          taskService.getAllTasks(),
          projectService.getAllProjects()
        ]);

        setTasks(fetchedTasks);
        setProjects(fetchedProjects);

        if (fetchedProjects.length === 0) {
           const inbox = await projectService.createProject('Inbox');
           setProjects([inbox]);
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
    if (projects.length === 0) return; 

    try {
      const defaultProject = projects[0]; 
      const newTask = await taskService.createTask(newTaskTitle, defaultProject.id);
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
    } catch (error) {
      console.error("Błąd aktualizacji zadania:", error);
      setTasks(tasks.map(t => t.id === task.id ? task : t));
    }
  };

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
                    <span
                      className={`text-gray-900 ${task.is_completed ? 'line-through text-gray-400' : ''}`}
                    >
                      {task.title}
                    </span>
                  </div>
                ))}

                <div className="mt-4">
                    <input 
                        type="text" 
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="Wpisz nowe zadanie..."
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm mb-2"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                    />
                    <button 
                        onClick={handleAddTask}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        Dodaj zadanie
                    </button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Goals (Placeholder)</h2>
            <div className="text-sm text-gray-500">Integracja w kolejnej turze...</div>
          </div>
           <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Projects (Placeholder)</h2>
             <div className="text-sm text-gray-500">Integracja w kolejnej turze...</div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Statistics</h2>
             <div className="border border-gray-200 h-48 flex items-center justify-center bg-gray-50 mb-4">
              <span className="text-gray-400 text-center">Wykresy wkrótce...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
