'use client';
import { useState, useEffect } from 'react';
import { goalService, Goal } from '@/services/goalService';
import { projectService, Project } from '@/services/projectService';
import { Trash2, Plus, Target, LayoutDashboard } from 'lucide-react';

export default function ProjectsGoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState<number | ''>(''); 

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [fetchedGoals, fetchedProjects] = await Promise.all([
        goalService.getAllGoals(),
        projectService.getAllProjects()
      ]);
      setGoals(fetchedGoals);
      setProjects(fetchedProjects);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddGoal = async () => {
    if (!newGoalTitle.trim()) return;
    try {
      const newGoal = await goalService.createGoal(newGoalTitle);
      setGoals([...goals, newGoal]);
      setNewGoalTitle('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteGoal = async (id: number) => {
    if (!confirm('Czy na pewno chcesz usunąć ten cel?')) return;
    try {
      await goalService.deleteGoal(id);
      setGoals(goals.filter(g => g.id !== id));
      fetchData(); 
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddProject = async () => {
    if (!newProjectTitle.trim()) return;
    try {
      const goalId = selectedGoalId !== '' ? Number(selectedGoalId) : undefined;
      const newProject = await projectService.createProject(newProjectTitle, goalId);
      setProjects([...projects, newProject]);
      setNewProjectTitle('');
      setSelectedGoalId('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm('Czy na pewno chcesz usunąć ten projekt?')) return;
    try {
      await projectService.deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Panel Celów */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-red-600" /> Cele
          </h2>
          
          <div className="space-y-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                placeholder="Nowy cel..."
                className="flex-1 border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              />
              <button
                onClick={handleAddGoal}
                className="inline-flex items-center p-2 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {isLoading ? <p>Ładowanie...</p> : (
              <ul className="divide-y divide-gray-200">
                {goals.map(goal => (
                  <li key={goal.id} className="py-3 flex justify-between items-center">
                    <span className="text-gray-900">{goal.title}</span>
                    <button onClick={() => handleDeleteGoal(goal.id)} className="text-gray-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
                {goals.length === 0 && <p className="text-gray-500 text-sm">Brak celów.</p>}
              </ul>
            )}
          </div>
        </div>

        {/* Panel Projektów */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <LayoutDashboard className="w-5 h-5 mr-2 text-blue-600" /> Projekty
          </h2>

          <div className="space-y-4">
             <div className="flex flex-col space-y-2">
              <input
                type="text"
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
                placeholder="Nowy projekt..."
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              />
              <div className="flex space-x-2">
                <select
                  value={selectedGoalId}
                  onChange={(e) => setSelectedGoalId(e.target.value)}
                  className="flex-1 border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                >
                  <option value="">-- Przypisz do celu (opcjonalne) --</option>
                  {goals.map(g => (
                    <option key={g.id} value={g.id}>{g.title}</option>
                  ))}
                </select>
                <button
                  onClick={handleAddProject}
                  className="inline-flex items-center p-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {isLoading ? <p>Ładowanie...</p> : (
              <ul className="divide-y divide-gray-200">
                {projects.map(project => (
                  <li key={project.id} className="py-3 flex justify-between items-center">
                    <div>
                        <span className="text-gray-900 font-medium block">{project.name}</span>
                        {project.goal_id && (
                            <span className="text-xs text-gray-500">
                                Cel: {goals.find(g => g.id === project.goal_id)?.title || 'Nieznany'}
                            </span>
                        )}
                    </div>
                    <button onClick={() => handleDeleteProject(project.id)} className="text-gray-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
                {projects.length === 0 && <p className="text-gray-500 text-sm">Brak projektów.</p>}
              </ul>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}