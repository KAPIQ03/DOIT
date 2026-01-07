'use client';

import { useState, useEffect } from 'react';
import { taskService, Task } from '@/services/taskService';
import { projectService, Project } from '@/services/projectService';
import { CheckCircle, Circle, LayoutList } from 'lucide-react';

interface ProjectGroup {
	project: Project;
	tasks: Task[];
}

export default function MyDayPage() {
	const [groupedTasks, setGroupedTasks] = useState<ProjectGroup[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [completingTaskIds, setCompletingTaskIds] = useState<Set<number>>(
		new Set()
	);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			setIsLoading(true);
			const [fetchedTasks, fetchedProjects] = await Promise.all([
				taskService.getAllTasks(),
				projectService.getAllProjects(),
			]);

			const uncompletedTasks = fetchedTasks.filter(
				(task: Task) => !task.is_completed
			);

			const groups: ProjectGroup[] = [];

			fetchedProjects.forEach((project: Project) => {
				const projectTasks = uncompletedTasks.filter(
					(task: Task) => task.project_id === project.id
				);

				if (projectTasks.length > 0) {
					groups.push({
						project: project,
						tasks: projectTasks,
					});
				}
			});

			const knownProjectIds = new Set(
				fetchedProjects.map((p: Project) => p.id)
			);
			const orphanedTasks = uncompletedTasks.filter(
				(t: Task) => !knownProjectIds.has(t.project_id)
			);

			if (orphanedTasks.length > 0) {
				groups.push({
					project: { id: -1, name: 'Inne / Nieznane' }, 
					tasks: orphanedTasks,
				});
			}

			setGroupedTasks(groups);
		} catch (error) {
			console.error('Błąd pobierania danych:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const toggleTaskCompletion = async (task: Task) => {
		try {
			setCompletingTaskIds(prev => new Set(prev).add(task.id));
			const updatedTask = { ...task, is_completed: !task.is_completed };
			await taskService.updateTask(task.id, updatedTask);

			setTimeout(() => {
				setGroupedTasks((prevGroups: ProjectGroup[]) =>
					prevGroups
						.map((group: ProjectGroup) => ({
							...group,
							tasks: group.tasks.filter((t: Task) => t.id !== task.id),
						}))
						.filter((group: ProjectGroup) => group.tasks.length > 0)
				);
				setCompletingTaskIds(prev => {
					const next = new Set(prev);
					next.delete(task.id);
					return next;
				});
			}, 500); 
		} catch (error) {
			console.error('Błąd aktualizacji zadania:', error);
			setCompletingTaskIds(prev => {
				const next = new Set(prev);
				next.delete(task.id);
				return next;
			});
		}
	};

	return (
		<div className='max-w-4xl mx-auto space-y-6'>
			<div className='flex items-center space-x-2 mb-6'>
				<LayoutList className='w-8 h-8 text-red-600' />
				<h1 className='text-3xl font-bold text-gray-900'>Mój Dzień</h1>
			</div>

			<p className='text-gray-500 mb-6'>Lista zadań do wykonania.</p>

			{isLoading ? (
				<div className='text-center py-10'>
					<p className='text-gray-500'>Ładowanie zadań...</p>
				</div>
			) : groupedTasks.length > 0 ? (
				<div className='space-y-8'>
					{groupedTasks.map(group => (
						<div
							key={group.project.id}
							className='bg-white shadow rounded-lg overflow-hidden'>
							<div className='bg-gray-50 px-6 py-3 border-b border-gray-200'>
								<h2 className='text-lg font-medium text-gray-800 flex items-center'>
									{group.project.name === 'Inbox'
										? 'Inbox'
										: group.project.name}
									<span className='ml-2 bg-gray-200 text-gray-600 text-xs py-0.5 px-2 rounded-full'>
										{group.tasks.length}
									</span>
								</h2>
							</div>
							<div className='divide-y divide-gray-100'>
								{group.tasks.map(task => (
									<div
										key={task.id}
										className={`p-4 hover:bg-gray-50 transition-all duration-500 ease-in-out flex items-center group ${
											completingTaskIds.has(task.id)
												? 'opacity-0 translate-x-10'
												: 'opacity-100 translate-x-0'
										}`}>
										<button
											onClick={() => toggleTaskCompletion(task)}
											className='shrink-0 text-gray-400 group-hover:text-red-600 focus:outline-none transition-colors'
											title='Oznacz jako wykonane'>
											<Circle className='w-6 h-6' />
										</button>
										<div className='ml-4 flex-1'>
											<span className='text-gray-900 font-medium block'>
												{task.title}
											</span>
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			) : (
				<div className='text-center py-12 bg-white rounded-lg shadow'>
					<CheckCircle className='w-16 h-16 text-green-500 mx-auto mb-4' />
					<h3 className='text-xl font-medium text-gray-900'>
						Wszystko zrobione!
					</h3>
					<p className='text-gray-500 mt-2'>
						Nie masz żadnych zadań do wykonania.
					</p>
				</div>
			)}
		</div>
	);
}
